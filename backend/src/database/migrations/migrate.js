#!/usr/bin/env node

/**
 * Database Migration Runner for SimpFlow
 * Applies database schema migrations
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const db = require('../db');
const logger = require('../../utils/logger');

class MigrationRunner {
    constructor() {
        this.migrationsDir = path.join(__dirname, './');
    }

    /**
     * Get all migration files
     */
    getMigrationFiles() {
        const files = fs.readdirSync(this.migrationsDir)
            .filter(file => file.endsWith('.sql') && file !== 'migrate.js')
            .sort();
        
        return files.map(file => ({
            name: file,
            path: path.join(this.migrationsDir, file)
        }));
    }

    /**
     * Create migrations tracking table
     */
    async createMigrationsTable() {
        const query = `
            CREATE TABLE IF NOT EXISTS migrations (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL UNIQUE,
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `;
        
        await db.query(query);
        logger.info('Migrations tracking table created');
    }

    /**
     * Check if migration has been applied
     */
    async isMigrationApplied(migrationName) {
        const result = await db.query(
            'SELECT name FROM migrations WHERE name = $1',
            [migrationName]
        );
        return result.rows.length > 0;
    }

    /**
     * Mark migration as applied
     */
    async markMigrationApplied(migrationName) {
        await db.query(
            'INSERT INTO migrations (name) VALUES ($1)',
            [migrationName]
        );
    }

    /**
     * Apply a single migration
     */
    async applyMigration(migration) {
        try {
            logger.info(`Applying migration: ${migration.name}`);
            
            const sql = fs.readFileSync(migration.path, 'utf8');
            await db.query(sql);
            await this.markMigrationApplied(migration.name);
            
            logger.info(`✅ Migration applied successfully: ${migration.name}`);
        } catch (error) {
            logger.error(`❌ Failed to apply migration ${migration.name}:`, error.message);
            throw error;
        }
    }

    /**
     * Run all pending migrations
     */
    async runMigrations() {
        try {
            // Test database connection
            await db.testConnection();
            logger.info('Database connection verified');

            // Create migrations tracking table
            await this.createMigrationsTable();

            // Get all migrations
            const migrations = this.getMigrationFiles();
            logger.info(`Found ${migrations.length} migration files`);

            let appliedCount = 0;

            // Apply each migration
            for (const migration of migrations) {
                const isApplied = await this.isMigrationApplied(migration.name);
                
                if (isApplied) {
                    logger.info(`⏭️  Skipping already applied migration: ${migration.name}`);
                } else {
                    await this.applyMigration(migration);
                    appliedCount++;
                }
            }

            if (appliedCount === 0) {
                logger.info('✅ All migrations are up to date');
            } else {
                logger.info(`✅ Applied ${appliedCount} new migrations`);
            }

        } catch (error) {
            logger.error('❌ Migration failed:', error.message);
            throw error;
        }
    }
}

// Run migrations if called directly
if (require.main === module) {
    const runner = new MigrationRunner();
    
    runner.runMigrations()
        .then(() => {
            logger.info('🎉 Migrations completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            logger.error('💥 Migration process failed:', error.message);
            process.exit(1);
        });
}

module.exports = MigrationRunner;
