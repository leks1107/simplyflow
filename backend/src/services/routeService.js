const db = require('../database/db');
const { v4: uuidv4 } = require('uuid');
const logger = require('../utils/logger');

/**
 * Route Service
 * Manages routes, configurations, and logging
 */
class RouteService {    /**
     * Create a new route
     * @param {Object} routeData - Route data
     * @returns {Object} Created route
     */
    static async createRoute(routeData) {
        const {
            userId,
            name,
            source,
            target,
            filters = [],
            credentials = {},
            duplicateCheckField = null,
            requiredFields = []
        } = routeData;

        // Validate required fields
        if (!name || !source || !target) {
            throw new Error('Name, source, and target are required');
        }

        // Validate source and target types
        const validSources = ['typeform', 'tally', 'paperform'];
        const validTargets = ['sheets', 'notion', 'digest'];
        
        if (!validSources.includes(source.toLowerCase())) {
            throw new Error(`Invalid source. Must be one of: ${validSources.join(', ')}`);
        }
        
        if (!validTargets.includes(target.toLowerCase())) {
            throw new Error(`Invalid target. Must be one of: ${validTargets.join(', ')}`);
        }

        // Validate target-specific configuration
        this.validateTargetConfiguration(target.toLowerCase(), credentials);

        // Validate filters structure
        this.validateFilters(filters);

        // Validate required fields
        if (requiredFields && !Array.isArray(requiredFields)) {
            throw new Error('Required fields must be an array of strings');
        }

        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');

            // Create user if doesn't exist (for MVP, we'll auto-create users)
            let actualUserId = userId;
            if (userId) {
                const userResult = await client.query(
                    'INSERT INTO users (id, email) VALUES ($1, $2) ON CONFLICT (id) DO NOTHING RETURNING id',
                    [userId, `user-${userId}@simpflow.com`]
                );
            } else {
                // Create a default user for MVP
                const userResult = await client.query(
                    'INSERT INTO users (email) VALUES ($1) RETURNING id',
                    [`user-${Date.now()}@simpflow.com`]
                );
                actualUserId = userResult.rows[0].id;
            }

            // Create route
            const routeId = uuidv4();
            const webhookUrl = `${process.env.BASE_URL || 'http://localhost:3000'}/api/trigger/${routeId}`;
            
            const routeResult = await client.query(
                `INSERT INTO routes (id, user_id, name, source, target, webhook_url, is_active) 
                 VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
                [routeId, actualUserId, name, source.toLowerCase(), target.toLowerCase(), webhookUrl, true]
            );            // Create route configuration
            await client.query(
                `INSERT INTO route_config (route_id, filters, credentials, duplicate_check_field, required_fields) 
                 VALUES ($1, $2, $3, $4, $5)`,
                [routeId, JSON.stringify(filters), JSON.stringify(credentials), duplicateCheckField, JSON.stringify(requiredFields)]
            );

            await client.query('COMMIT');

            const route = routeResult.rows[0];
            route.config = {
                filters,
                credentials,
                duplicate_check_field: duplicateCheckField,
                required_fields: requiredFields
            };

            logger.info(`Created new route: ${routeId} (${name})`);
            return route;

        } catch (error) {
            await client.query('ROLLBACK');
            logger.error('Error creating route:', error.message);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get routes for a user (or all routes if no userId provided)
     * @param {string} userId - User ID (optional)
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Array} Routes
     */
    static async getRoutes(userId = null, page = 1, limit = 50) {
        const offset = (page - 1) * limit;
          let query = `
            SELECT r.*, rc.filters, rc.credentials, rc.duplicate_check_field, rc.required_fields
            FROM routes r
            LEFT JOIN route_config rc ON r.id = rc.route_id
        `;
        let params = [];
        
        if (userId) {
            query += ' WHERE r.user_id = $1';
            params.push(userId);
        }
        
        query += ` ORDER BY r.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
        params.push(limit, offset);

        try {
            const result = await db.query(query, params);
              return result.rows.map(row => ({
                ...row,
                config: {
                    filters: row.filters || [],
                    credentials: row.credentials || {},
                    duplicate_check_field: row.duplicate_check_field,
                    required_fields: row.required_fields || []
                }
            }));
        } catch (error) {
            logger.error('Error fetching routes:', error.message);
            throw error;
        }
    }

    /**
     * Get a single route by ID
     * @param {string} routeId - Route ID
     * @returns {Object|null} Route or null if not found
     */
    static async getRouteById(routeId) {
        try {            const result = await db.query(
                `SELECT r.*, rc.filters, rc.credentials, rc.duplicate_check_field, rc.required_fields
                 FROM routes r
                 LEFT JOIN route_config rc ON r.id = rc.route_id
                 WHERE r.id = $1`,
                [routeId]
            );

            if (result.rows.length === 0) {
                return null;
            }            const row = result.rows[0];
            return {
                ...row,
                config: {
                    filters: row.filters || [],
                    credentials: row.credentials || {},
                    duplicate_check_field: row.duplicate_check_field,
                    required_fields: row.required_fields || []
                }
            };
        } catch (error) {
            logger.error('Error fetching route by ID:', error.message);
            throw error;
        }
    }

    /**
     * Delete a route
     * @param {string} routeId - Route ID
     * @returns {boolean} True if deleted, false if not found
     */
    static async deleteRoute(routeId) {
        try {
            const result = await db.query(
                'DELETE FROM routes WHERE id = $1',
                [routeId]
            );

            const deleted = result.rowCount > 0;
            if (deleted) {
                logger.info(`Deleted route: ${routeId}`);
            }
            
            return deleted;
        } catch (error) {
            logger.error('Error deleting route:', error.message);
            throw error;
        }
    }

    /**
     * Log webhook request
     * @param {Object} logData - Log data
     */
    static async logWebhookRequest(logData) {
        try {
            await db.query(
                `INSERT INTO logs (route_id, raw_request, processed_data, status, error_message, processing_time_ms)
                 VALUES ($1, $2, $3, $4, $5, $6)`,
                [
                    logData.route_id,
                    JSON.stringify(logData.raw_request),
                    JSON.stringify(logData.processed_data || {}),
                    logData.status,
                    logData.error_message,
                    logData.processing_time_ms
                ]
            );
        } catch (error) {
            logger.error('Error logging webhook request:', error.message);
            // Don't throw error here - logging failure shouldn't break the main flow
        }
    }

    /**
     * Get logs for a route
     * @param {string} routeId - Route ID
     * @param {number} page - Page number
     * @param {number} limit - Items per page
     * @returns {Array} Logs
     */
    static async getRouteLogs(routeId, page = 1, limit = 100) {
        const offset = (page - 1) * limit;
        
        try {
            const result = await db.query(
                `SELECT * FROM logs 
                 WHERE route_id = $1 
                 ORDER BY timestamp DESC 
                 LIMIT $2 OFFSET $3`,
                [routeId, limit, offset]
            );

            return result.rows;
        } catch (error) {
            logger.error('Error fetching route logs:', error.message);
            throw error;
        }
    }

    /**
     * Get statistics for a route
     * @param {string} routeId - Route ID
     * @param {number} days - Number of days to look back
     * @returns {Object} Statistics
     */
    static async getRouteStats(routeId, days = 30) {
        try {
            const result = await db.query(
                `SELECT 
                    status,
                    COUNT(*) as count,
                    AVG(processing_time_ms) as avg_processing_time
                 FROM logs 
                 WHERE route_id = $1 
                   AND timestamp >= NOW() - INTERVAL '${days} days'
                 GROUP BY status`,
                [routeId]
            );

            const stats = {
                total: 0,
                success: 0,
                filtered: 0,
                duplicate: 0,
                error: 0,
                avg_processing_time: 0
            };

            result.rows.forEach(row => {
                stats[row.status] = parseInt(row.count);
                stats.total += parseInt(row.count);
                if (row.status === 'success') {
                    stats.avg_processing_time = parseFloat(row.avg_processing_time) || 0;
                }
            });

            return stats;
        } catch (error) {
            logger.error('Error fetching route stats:', error.message);
            throw error;
        }
    }

    /**
     * Validate target-specific configuration
     * @param {string} target - Target type
     * @param {Object} credentials - Credentials object
     */
    static validateTargetConfiguration(target, credentials) {
        switch (target) {
            case 'sheets':
                if (!credentials.spreadsheetId) {
                    throw new Error('Google Sheets target requires spreadsheetId in credentials');
                }
                if (!credentials.sheetName) {
                    throw new Error('Google Sheets target requires sheetName in credentials');
                }
                break;

            case 'notion':
                if (!credentials.notionDbId) {
                    throw new Error('Notion target requires notionDbId in credentials');
                }
                if (!credentials.token) {
                    throw new Error('Notion target requires token in credentials');
                }
                break;

            case 'digest':
                if (!credentials.email) {
                    throw new Error('Email digest target requires email in credentials');
                }
                if (!credentials.time) {
                    throw new Error('Email digest target requires time in credentials');
                }
                // Validate email format
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(credentials.email)) {
                    throw new Error('Invalid email format in digest target credentials');
                }
                break;

            default:
                throw new Error(`Unknown target type: ${target}`);
        }
    }

    /**
     * Validate filters structure
     * @param {Array} filters - Array of filter objects
     */
    static validateFilters(filters) {
        if (!Array.isArray(filters)) {
            throw new Error('Filters must be an array');
        }

        const validOperators = [
            'equals', 'not_equals', 'contains', 'not_contains',
            'starts_with', 'ends_with', 'regex', 'not_regex',
            'greater_than', 'less_than', 'greater_than_or_equal',
            'less_than_or_equal', 'is_empty', 'is_not_empty'
        ];

        filters.forEach((filter, index) => {
            if (!filter || typeof filter !== 'object') {
                throw new Error(`Filter at index ${index} must be an object`);
            }

            if (!filter.field || typeof filter.field !== 'string') {
                throw new Error(`Filter at index ${index} must have a valid field name (string)`);
            }

            if (!filter.op || typeof filter.op !== 'string') {
                throw new Error(`Filter at index ${index} must have a valid operator (op)`);
            }

            if (!validOperators.includes(filter.op)) {
                throw new Error(`Filter at index ${index} has invalid operator '${filter.op}'. Valid operators: ${validOperators.join(', ')}`);
            }

            // Check if value is required for the operator
            const operatorsWithoutValue = ['is_empty', 'is_not_empty'];
            if (!operatorsWithoutValue.includes(filter.op) && filter.value === undefined) {
                throw new Error(`Filter at index ${index} with operator '${filter.op}' requires a value`);
            }
        });
    }
}

module.exports = RouteService;
