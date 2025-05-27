const { Pool } = require('pg');
const logger = require('../utils/logger');

class Database {
    constructor() {
        this.pool = null;
        this.initializePool();
    }

    initializePool() {
        // Database configuration
        const config = {
            connectionString: process.env.DATABASE_URL,
            ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
            max: 20, // Maximum number of connections in the pool
            idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
            connectionTimeoutMillis: 2000, // Return error after 2 seconds if connection could not be established
        };

        this.pool = new Pool(config);

        // Handle pool errors
        this.pool.on('error', (err) => {
            logger.error('Unexpected error on idle client', err);
        });

        logger.info('Database pool initialized');
    }

    async testConnection() {
        try {
            const client = await this.pool.connect();
            await client.query('SELECT NOW()');
            client.release();
            logger.info('Database connection test successful');
            return true;
        } catch (error) {
            logger.error('Database connection test failed:', error.message);
            throw error;
        }
    }

    async query(text, params) {
        const start = Date.now();
        try {
            const result = await this.pool.query(text, params);
            const duration = Date.now() - start;
            logger.debug('Executed query', { text, duration, rows: result.rowCount });
            return result;
        } catch (error) {
            logger.error('Database query error:', { text, error: error.message });
            throw error;
        }
    }

    async getClient() {
        return await this.pool.connect();
    }

    async closeConnection() {
        if (this.pool) {
            await this.pool.end();
            logger.info('Database pool closed');
        }
    }

    // Initialize database tables
    async initializeTables() {
        const createTablesQuery = `
            -- Users table
            CREATE TABLE IF NOT EXISTS users (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                email VARCHAR(255) UNIQUE NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Routes table
            CREATE TABLE IF NOT EXISTS routes (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                user_id UUID REFERENCES users(id) ON DELETE CASCADE,
                name VARCHAR(255) NOT NULL,
                source VARCHAR(50) NOT NULL, -- typeform, tally, paperform
                target VARCHAR(50) NOT NULL, -- sheets, notion, digest
                webhook_url TEXT,
                is_active BOOLEAN DEFAULT true,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Route configuration table
            CREATE TABLE IF NOT EXISTS route_config (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
                filters JSONB, -- { field: "city", op: "=", value: "New York" }
                credentials JSONB, -- API keys, sheet IDs, etc.
                duplicate_check_field VARCHAR(255), -- field to check for duplicates
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            -- Logs table
            CREATE TABLE IF NOT EXISTS logs (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                route_id UUID REFERENCES routes(id) ON DELETE CASCADE,
                timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                raw_request JSONB,
                processed_data JSONB,
                status VARCHAR(50) NOT NULL, -- success, filtered, duplicate, error
                error_message TEXT,
                processing_time_ms INTEGER
            );

            -- Indexes for better performance
            CREATE INDEX IF NOT EXISTS idx_routes_user_id ON routes(user_id);
            CREATE INDEX IF NOT EXISTS idx_route_config_route_id ON route_config(route_id);
            CREATE INDEX IF NOT EXISTS idx_logs_route_id ON logs(route_id);
            CREATE INDEX IF NOT EXISTS idx_logs_timestamp ON logs(timestamp);
            CREATE INDEX IF NOT EXISTS idx_logs_status ON logs(status);
        `;

        try {
            await this.query(createTablesQuery);
            logger.info('Database tables initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize database tables:', error.message);
            throw error;
        }
    }
}

// Export singleton instance
module.exports = new Database();