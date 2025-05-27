const RouteService = require('../services/routeService');
const GoogleSheetsService = require('../services/googleSheetsService');
const NotionService = require('../services/notionService');
const EmailDigestService = require('../services/emailDigestService');
const FilterUtils = require('../utils/filterUtils');
const ValidateUtils = require('../utils/validateUtils');
const logger = require('../utils/logger');

// Rate limiting cache for webhook requests
const webhookRateLimit = new Map();
const RATE_LIMIT_WINDOW = 1000; // 1 second
const RATE_LIMIT_MAX_REQUESTS = 5; // Max 5 requests per second per route

// Clean up rate limit cache every 60 seconds
setInterval(() => {
    const now = Date.now();
    for (const [routeId, requests] of webhookRateLimit.entries()) {
        const filteredRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
        if (filteredRequests.length === 0) {
            webhookRateLimit.delete(routeId);
        } else {
            webhookRateLimit.set(routeId, filteredRequests);
        }
    }
}, 60000);

/**
 * Webhook Controller for SimpFlow
 * Handles incoming webhooks and processes them according to route configuration
 */
class WebhookController {
    /**
     * Check rate limit for a route
     * @param {string} routeId - Route ID
     * @returns {Object} Rate limit result
     */
    static checkRateLimit(routeId) {
        const now = Date.now();
        const requests = webhookRateLimit.get(routeId) || [];
        
        // Filter out requests outside the current window
        const recentRequests = requests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
        
        if (recentRequests.length >= RATE_LIMIT_MAX_REQUESTS) {
            return { allowed: false, remaining: 0 };
        }
        
        // Add current request timestamp
        recentRequests.push(now);
        webhookRateLimit.set(routeId, recentRequests);
        
        return { 
            allowed: true, 
            remaining: RATE_LIMIT_MAX_REQUESTS - recentRequests.length 
        };
    }

    /**
     * Check if required fields are present in extracted data
     * @param {Object} extractedData - Extracted webhook data
     * @param {Array} requiredFields - Array of required field names
     * @returns {Object} Validation result
     */
    static checkRequiredFields(extractedData, requiredFields = []) {
        if (!Array.isArray(requiredFields) || requiredFields.length === 0) {
            return { valid: true, missingFields: [] };
        }

        const missingFields = [];
        
        for (const fieldName of requiredFields) {
            if (!extractedData[fieldName] || 
                (typeof extractedData[fieldName] === 'string' && extractedData[fieldName].trim() === '')) {
                missingFields.push(fieldName);
            }
        }

        return {
            valid: missingFields.length === 0,
            missingFields
        };
    }

    /**
     * Handle webhook requests for a specific route
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async handleWebhook(req, res) {
        const startTime = Date.now();
        const routeId = req.params.routeId;
        let logData = {
            route_id: routeId,
            raw_request: req.body,
            status: 'error',
            error_message: null,
            processing_time_ms: 0
        };

        try {
            logger.info(`📨 Received webhook for route: ${routeId}`);

            // Rate limiting check
            const rateLimitResult = this.checkRateLimit(routeId);
            if (!rateLimitResult.allowed) {
                logData.status = 'rate_limited';
                logData.error_message = 'Rate limit exceeded: maximum 5 requests per second';
                logData.processing_time_ms = Date.now() - startTime;
                await RouteService.logWebhookRequest(logData);
                
                return res.status(429).json({
                    success: false,
                    error: 'Too Many Requests',
                    message: 'Rate limit exceeded: maximum 5 requests per second per route',
                    retryAfter: 1
                });
            }

            // Get route configuration
            const route = await RouteService.getRouteById(routeId);
            if (!route) {
                logData.error_message = 'Route not found';
                logData.processing_time_ms = Date.now() - startTime;
                await RouteService.logWebhookRequest(logData);
                return res.status(404).json({
                    success: false,
                    error: 'Route not found'
                });
            }

            // Check route status
            if (route.status !== 'active') {
                logData.status = 'skipped';
                logData.error_message = 'route_inactive';
                logData.processing_time_ms = Date.now() - startTime;
                await RouteService.logWebhookRequest(logData);
                
                return res.status(200).json({
                    success: false,
                    reason: 'route_inactive'
                });
            }

            // Legacy check for is_active field (backward compatibility)
            if (!route.is_active) {
                logData.status = 'skipped';
                logData.error_message = 'route_inactive';
                logData.processing_time_ms = Date.now() - startTime;
                await RouteService.logWebhookRequest(logData);
                
                return res.status(200).json({
                    success: false,
                    reason: 'route_inactive'
                });
            }

            const config = route.config || {};
            
            // Extract data based on source type
            const extractedData = this.extractDataFromWebhook(req.body, route.source);
            if (!extractedData) {
                logData.error_message = 'Could not extract data from webhook payload';
                logData.processing_time_ms = Date.now() - startTime;
                await RouteService.logWebhookRequest(logData);
                return res.status(400).json({
                    success: false,
                    error: 'Invalid webhook payload'
                });
            }

            logger.debug('Extracted data:', extractedData);

            // Check required fields
            if (config.required_fields && config.required_fields.length > 0) {
                const requiredFieldsCheck = this.checkRequiredFields(extractedData, config.required_fields);
                if (!requiredFieldsCheck.valid) {
                    logData.status = 'skipped';
                    logData.error_message = `missing_fields: ${requiredFieldsCheck.missingFields.join(', ')}`;
                    logData.processing_time_ms = Date.now() - startTime;
                    await RouteService.logWebhookRequest(logData);
                    
                    logger.info(`Skipping webhook - missing required fields: ${requiredFieldsCheck.missingFields.join(', ')}`);
                    
                    return res.status(200).json({
                        success: false,
                        reason: 'missing_fields',
                        missing_fields: requiredFieldsCheck.missingFields
                    });
                }
            }

            // Apply filters
            if (config.filters && config.filters.length > 0) {
                const filterResult = FilterUtils.applyFilters(extractedData, config.filters);
                if (!filterResult.passed) {
                    logData.status = 'filtered';
                    logData.error_message = filterResult.reason;
                    logData.processing_time_ms = Date.now() - startTime;
                    await RouteService.logWebhookRequest(logData);
                    
                    logger.info('Webhook filtered out:', filterResult.reason);
                    
                    return res.status(200).json({
                        success: false,
                        reason: 'filtered',
                        filter_reason: filterResult.reason
                    });
                }
            }

            // Check for duplicates
            if (config.duplicate_check_field) {
                const isDuplicate = await this.checkDuplicate(extractedData, route, config.duplicate_check_field);
                if (isDuplicate) {
                    logData.status = 'duplicate';
                    logData.error_message = `Duplicate ${config.duplicate_check_field}`;
                    logData.processing_time_ms = Date.now() - startTime;
                    await RouteService.logWebhookRequest(logData);
                    
                    logger.info(`Duplicate detected for ${config.duplicate_check_field}: ${extractedData[config.duplicate_check_field]}`);
                    
                    return res.status(200).json({
                        success: false,
                        reason: 'duplicate',
                        duplicate_field: config.duplicate_check_field
                    });
                }
            }

            // Send to target
            const result = await this.sendToTarget(extractedData, route);
            
            logData.status = 'success';
            logData.processing_time_ms = Date.now() - startTime;
            await RouteService.logWebhookRequest(logData);

            logger.info(`✅ Webhook processed successfully for route: ${routeId}`);
            
            return res.status(200).json({
                success: true,
                route_id: routeId,
                result
            });

        } catch (error) {
            logData.error_message = error.message;
            logData.processing_time_ms = Date.now() - startTime;
            await RouteService.logWebhookRequest(logData);
            
            logger.error(`❌ Webhook processing failed for route ${routeId}:`, error.message);
            
            return res.status(500).json({
                success: false,
                error: 'Internal server error',
                message: error.message
            });
        }
    }

    /**
     * Extract data from webhook payload based on source type
     * @param {Object} payload - Webhook payload
     * @param {string} source - Source type
     * @returns {Object|null} Extracted data
     */
    static extractDataFromWebhook(payload, source) {
        try {
            switch (source.toLowerCase()) {
                case 'typeform':
                    return ValidateUtils.extractTypeformData(payload);
                case 'tally':
                    return ValidateUtils.extractTallyData(payload);
                case 'paperform':
                    return ValidateUtils.extractPaperformData(payload);
                default:
                    logger.warn(`Unknown source type: ${source}`);
                    return null;
            }
        } catch (error) {
            logger.error(`Error extracting data from ${source}:`, error.message);
            return null;
        }
    }

    /**
     * Check for duplicate data
     * @param {Object} extractedData - Extracted data
     * @param {Object} route - Route configuration
     * @param {string} duplicateField - Field to check for duplicates
     * @returns {boolean} True if duplicate found
     */
    static async checkDuplicate(extractedData, route, duplicateField) {
        try {
            const value = extractedData[duplicateField];
            if (!value) {
                return false;
            }

            switch (route.target) {
                case 'sheets':
                    const sheetsService = new GoogleSheetsService();
                    const { spreadsheetId, sheetName } = route.config.credentials;
                    return await sheetsService.checkDuplicate(spreadsheetId, sheetName, duplicateField, value);
                
                case 'notion':
                    const notionService = new NotionService();
                    const { notionDbId } = route.config.credentials;
                    return await notionService.checkDuplicate(notionDbId, duplicateField, value);
                
                case 'digest':
                    // Email digest doesn't support duplicate checking
                    return false;
                
                default:
                    logger.warn(`Duplicate check not supported for target: ${route.target}`);
                    return false;
            }
        } catch (error) {
            logger.error('Error checking for duplicates:', error.message);
            return false; // Don't block on duplicate check errors
        }
    }

    /**
     * Send data to target service
     * @param {Object} extractedData - Extracted data
     * @param {Object} route - Route configuration
     * @returns {Object} Result from target service
     */
    static async sendToTarget(extractedData, route) {
        const { target, config } = route;

        switch (target) {
            case 'sheets':
                const sheetsService = new GoogleSheetsService();
                return await sheetsService.sendData(extractedData, config.credentials);
                
            case 'notion':
                const notionService = new NotionService();
                return await notionService.sendData(extractedData, config.credentials);
                
            case 'digest':
                const emailService = new EmailDigestService();
                return await emailService.sendData(extractedData, config.credentials);
                
            default:
                throw new Error(`Unsupported target type: ${target}`);
        }
    }
}

module.exports = WebhookController;
