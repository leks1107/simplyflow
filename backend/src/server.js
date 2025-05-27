require('dotenv').config();
const app = require('./app');
const logger = require('./utils/logger');
const db = require('./database/db');

// Render всегда задаёт PORT — обязательно использовать его
const PORT = process.env.PORT;

if (!PORT) {
  throw new Error("❌ 'PORT' is not defined. This app must be run in a managed environment like Render.");
}

async function startServer() {
  try {
    await db.testConnection();
    logger.info('Database connection established successfully');

    // Обязательно слушаем на 0.0.0.0
    app.listen(PORT, '0.0.0.0', () => {
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