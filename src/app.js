require('dotenv').config();
const express = require('express');
const cors = require('cors');
const WebhookController = require('./controllers/webhookController');
const ErrorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Trust proxy for proper IP handling (important for rate limiting)
app.set('trust proxy', 1);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(ErrorHandler.logRequests);
}

// Basic rate limiting
app.use(ErrorHandler.basicRateLimit);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Typeform to Google Sheets Integrator is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Webhook health check
app.get('/webhook/health', WebhookController.healthCheck);

// Main webhook endpoint
app.post('/webhook', WebhookController.handleWebhook);

// 404 handler
app.use('*', ErrorHandler.notFound);

// Global error handler
app.use(ErrorHandler.handle);

app.listen(PORT, () => {
    logger.info(`🚀 Server is running on port ${PORT}`);
    logger.info(`📋 Health check: http://localhost:${PORT}/health`);
    logger.info(`🔗 Webhook endpoint: http://localhost:${PORT}/webhook`);
    logger.info(`🏥 Webhook health: http://localhost:${PORT}/webhook/health`);
    logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});