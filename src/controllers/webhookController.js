const googleSheetsService = require('../services/googleSheetsService');
const ValidationService = require('../services/validationService');
const logger = require('../utils/logger');

/**
 * Webhook Controller
 * Handles incoming webhooks from Typeform
 */
class WebhookController {
    /**
     * Handle Typeform webhook requests
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async handleWebhook(req, res) {
        const startTime = Date.now();
        
        try {
            logger.info('📨 Received webhook request');
            logger.debug('Webhook payload:', JSON.stringify(req.body, null, 2));

            // Validate webhook data
            const validation = ValidationService.validateWebhookData(req.body);
            
            if (!validation.valid) {
                logger.warning(`⚠️ Skipped: ${validation.reason}`);
                return res.status(400).json({
                    success: false,
                    message: validation.reason,
                    data: validation.data
                });
            }

            const { email, city, interest } = validation.data;
            
            // Check if email already exists in the sheet
            const emailExists = await googleSheetsService.checkEmailExists(email);
            if (emailExists) {
                logger.warning(`⚠️ Skipped: duplicate email "${email}"`);
                return res.status(409).json({
                    success: false,
                    message: 'Email already exists in the sheet',
                    email: email
                });
            }

            // Create UTC timestamp
            const timestamp = new Date().toISOString();
            
            // Add row to Google Sheets
            await googleSheetsService.addRow(email, timestamp, interest);
            
            const processingTime = Date.now() - startTime;
            logger.success(`✅ Added: ${email} | ${city} | ${interest} (${processingTime}ms)`);
            
            return res.status(201).json({
                success: true,
                message: 'Data successfully added to Google Sheets',
                data: {
                    email,
                    timestamp,
                    interest,
                    city
                },
                processingTime: `${processingTime}ms`
            });

        } catch (error) {
            const processingTime = Date.now() - startTime;
            logger.error(`❌ Error processing webhook: ${error.message} (${processingTime}ms)`);
            
            return res.status(500).json({
                success: false,
                message: 'Internal server error while processing webhook',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong',
                processingTime: `${processingTime}ms`
            });
        }
    }

    /**
     * Health check for webhook endpoint
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static async healthCheck(req, res) {
        try {
            // Test Google Sheets connection
            await googleSheetsService.validateConnection();
            
            return res.status(200).json({
                status: 'healthy',
                message: 'Webhook service is operational',
                timestamp: new Date().toISOString(),
                services: {
                    googleSheets: 'connected'
                }
            });
        } catch (error) {
            logger.error('Health check failed:', error.message);
            
            return res.status(503).json({
                status: 'unhealthy',
                message: 'Service unavailable',
                error: error.message,
                timestamp: new Date().toISOString()
            });
        }
    }
}

module.exports = WebhookController;