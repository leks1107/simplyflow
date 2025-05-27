require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const db = require('./database/db');

const PORT = process.env.PORT;
// Test database connection on startup
async function startServer() {
    try {
        // Test database connection
        await db.testConnection();
        logger.info('Database connection established successfully');
        
        // Start the server
        app.listen(PORT, () => {
            logger.info(`🚀 SimpFlow Backend is running on port ${PORT}`);
            logger.info(`📋 Health check: http://localhost:${PORT}/api/health`);
            logger.info(`🔗 Webhook endpoints: http://localhost:${PORT}/api/trigger/:routeId`);
            logger.info(`⚙️  Routes API: http://localhost:${PORT}/api/routes`);
            logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        logger.error('Failed to start server:', error.message);
        process.exit(1);
    }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
    logger.info('SIGTERM received, shutting down gracefully');
    await db.closeConnection();
    process.exit(0);
});

process.on('SIGINT', async () => {
    logger.info('SIGINT received, shutting down gracefully');
    await db.closeConnection();
    process.exit(0);
});

startServer();