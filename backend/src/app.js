require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const apiRoutes = require('./routes/apiRoutes');
const ErrorHandler = require('./middleware/errorHandler');
const logger = require('./utils/logger');

const app = express();

// Trust proxy for proper IP handling (important for Render hosting)
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
    credentials: true
}));

// Body parsing middleware
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Request logging (only in development)
if (process.env.NODE_ENV === 'development') {
    app.use(ErrorHandler.logRequests);
}

// Basic rate limiting
app.use(ErrorHandler.basicRateLimit);

// API routes
app.use('/api', apiRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        service: 'SimpFlow Backend',
        version: '1.0.0',
        status: 'running',
        timestamp: new Date().toISOString(),
        endpoints: {
            health: '/api/health',
            routes: '/api/routes',
            trigger: '/api/trigger/:routeId'
        }
    });
});

// 404 handler
app.use('*', ErrorHandler.notFound);

// Global error handler
app.use(ErrorHandler.handle);

module.exports = app;