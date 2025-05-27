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
class WebhookController {    /**
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
                    error: 'Too Many Requests',                    message: 'Rate limit exceeded: maximum 5 requests per second per route',
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
                });
            }

            // Extract data from webhook payload based on source type
            const extractedData = this.extractWebhookData(req.body, route.source);
            if (!extractedData) {
                logData.error_message = 'Could not extract data from webhook payload';
                await RouteService.logWebhookRequest(logData);
                return res.status(400).json({
                    success: false,
                    error: 'Invalid webhook payload'
                });
            }

            logData.processed_data = extractedData;

            // Apply filters
            const config = route.config;
            if (config.filters && config.filters.length > 0) {
                const filterResult = FilterUtils.applyFilters(extractedData, config.filters);
                if (!filterResult.passed) {
                    logData.status = 'filtered';
                    logData.error_message = filterResult.reason;
                    await RouteService.logWebhookRequest(logData);
                    logger.warning(`⚠️ Filtered: ${filterResult.reason}`);
                    return res.status(200).json({
                        success: true,
                        message: 'Data filtered',
                        reason: filterResult.reason
                    });
                }
            }

            // Check for duplicates
            if (config.duplicate_check_field) {
                const duplicateValue = extractedData[config.duplicate_check_field];
                if (duplicateValue) {
                    const isDuplicate = await this.checkDuplicate(route, config.duplicate_check_field, duplicateValue);
                    if (isDuplicate) {
                        logData.status = 'duplicate';
                        logData.error_message = `Duplicate found for ${config.duplicate_check_field}: ${duplicateValue}`;
                        await RouteService.logWebhookRequest(logData);
                        logger.warning(`⚠️ Duplicate: ${config.duplicate_check_field} = ${duplicateValue}`);
                        return res.status(200).json({
                            success: true,
                            message: 'Duplicate entry skipped',
                            field: config.duplicate_check_field,
                            value: duplicateValue
                        });
                    }
                }
            }

            // Send to target service
            const result = await this.sendToTarget(route, extractedData);
            
            logData.status = 'success';
            logData.processing_time_ms = Date.now() - startTime;
            await RouteService.logWebhookRequest(logData);

            logger.success(`✅ Successfully processed webhook for route ${routeId} (${logData.processing_time_ms}ms)`);
            
            return res.status(200).json({
                success: true,
                message: 'Data processed successfully',
                target: route.target,
                processingTime: `${logData.processing_time_ms}ms`,
                data: extractedData
            });

        } catch (error) {
            logData.error_message = error.message;
            logData.processing_time_ms = Date.now() - startTime;
            await RouteService.logWebhookRequest(logData);
            
            logger.error(`❌ Error processing webhook for route ${routeId}: ${error.message} (${logData.processing_time_ms}ms)`);
            
            return res.status(500).json({
                success: false,
                error: 'Internal server error while processing webhook',
                message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
                processingTime: `${logData.processing_time_ms}ms`
            });
        }
    }

    /**
     * Extract data from webhook payload based on source type
     * @param {Object} payload - Raw webhook payload
     * @param {string} source - Source type (typeform, tally, paperform)
     * @returns {Object|null} - Extracted data or null if failed
     */
    static extractWebhookData(payload, source) {
        try {
            switch (source.toLowerCase()) {
                case 'typeform':
                    return this.extractTypeformData(payload);
                case 'tally':
                    return this.extractTallyData(payload);
                case 'paperform':
                    return this.extractPaperformData(payload);
                default:
                    logger.warning(`Unknown source type: ${source}`);
                    return null;
            }
        } catch (error) {
            logger.error(`Error extracting ${source} data:`, error.message);
            return null;
        }
    }

    /**
     * Extract data from Typeform webhook
     */
    static extractTypeformData(payload) {
        if (!payload.form_response || !payload.form_response.answers) {
            return null;
        }

        const extractedData = {};
        const answers = payload.form_response.answers;

        answers.forEach(answer => {
            const fieldType = answer.field?.type;
            const fieldRef = answer.field?.ref;
            
            // Extract email
            if (fieldType === 'email' || answer.email) {
                extractedData.email = answer.email;
            }
            
            // Extract text fields by reference
            if (fieldRef && answer.text) {
                extractedData[fieldRef] = answer.text;
            }
            
            // Extract choice fields
            if (answer.choice && fieldRef) {
                extractedData[fieldRef] = answer.choice.label || answer.choice.value;
            }
        });

        return Object.keys(extractedData).length > 0 ? extractedData : null;
    }

    /**
     * Extract data from Tally webhook
     */
    static extractTallyData(payload) {
        // Implement Tally-specific extraction logic
        // This is a placeholder - adjust based on Tally's webhook format
        if (!payload.data) {
            return null;
        }

        const extractedData = {};
        const data = payload.data;

        // Extract fields based on Tally's structure
        Object.keys(data).forEach(key => {
            if (data[key] && typeof data[key] === 'string') {
                extractedData[key] = data[key];
            }
        });

        return Object.keys(extractedData).length > 0 ? extractedData : null;
    }

    /**
     * Extract data from Paperform webhook
     */
    static extractPaperformData(payload) {
        // Implement Paperform-specific extraction logic
        // This is a placeholder - adjust based on Paperform's webhook format
        if (!payload.submission) {
            return null;
        }

        const extractedData = {};
        const submission = payload.submission;

        // Extract fields based on Paperform's structure
        Object.keys(submission).forEach(key => {
            if (submission[key] && typeof submission[key] === 'string') {
                extractedData[key] = submission[key];
            }
        });

        return Object.keys(extractedData).length > 0 ? extractedData : null;
    }

    /**
     * Check for duplicates in the target service
     */
    static async checkDuplicate(route, field, value) {
        try {
            switch (route.target) {
                case 'sheets':
                    return await GoogleSheetsService.checkDuplicate(route.config.credentials, field, value);
                case 'notion':
                    return await NotionService.checkDuplicate(route.config.credentials, field, value);
                case 'digest':
                    return await EmailDigestService.checkDuplicate(route.id, field, value);
                default:
                    return false;
            }
        } catch (error) {
            logger.error(`Error checking duplicate: ${error.message}`);
            return false; // If check fails, assume no duplicate
        }
    }

    /**
     * Send data to target service
     */
    static async sendToTarget(route, data) {
        const { target, config } = route;
        
        switch (target) {
            case 'sheets':
                return await GoogleSheetsService.addRow(config.credentials, data);
            case 'notion':
                return await NotionService.addRow(config.credentials, data);
            case 'digest':
                return await EmailDigestService.addToDigest(route.id, data);
            default:
                throw new Error(`Unknown target type: ${target}`);
        }
    }
}

module.exports = WebhookController;