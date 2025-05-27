const express = require('express');
const router = express.Router();
const WebhookController = require('../controllers/webhookController');
const RouteService = require('../services/routeService');
const logger = require('../utils/logger');
const db = require('../database/db');

// Health check endpoint
router.get('/health', async (req, res) => {
    try {
        // Test database connection
        await db.testConnection();
        
        res.status(200).json({
            status: 'healthy',
            service: 'SimpFlow Backend',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            database: 'connected'
        });
    } catch (error) {
        logger.error('Health check failed:', error.message);
        res.status(503).json({
            status: 'unhealthy',
            service: 'SimpFlow Backend',
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Routes management endpoints
router.post('/routes', async (req, res) => {
    try {
        const route = await RouteService.createRoute(req.body);
        res.status(201).json({
            success: true,
            message: 'Route created successfully',
            data: route
        });
    } catch (error) {
        logger.error('Error creating route:', error.message);
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/routes', async (req, res) => {
    try {
        const { userId, page = 1, limit = 50 } = req.query;
        const routes = await RouteService.getRoutes(userId, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: routes
        });
    } catch (error) {
        logger.error('Error fetching routes:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.get('/routes/:id', async (req, res) => {
    try {
        const route = await RouteService.getRouteById(req.params.id);
        if (!route) {
            return res.status(404).json({
                success: false,
                error: 'Route not found'
            });
        }
        res.json({
            success: true,
            data: route
        });
    } catch (error) {
        logger.error('Error fetching route:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

router.delete('/routes/:id', async (req, res) => {
    try {
        const deleted = await RouteService.deleteRoute(req.params.id);
        if (!deleted) {
            return res.status(404).json({
                success: false,
                error: 'Route not found'
            });
        }
        res.json({
            success: true,
            message: 'Route deleted successfully'
        });
    } catch (error) {
        logger.error('Error deleting route:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Webhook trigger endpoint
router.post('/trigger/:routeId', WebhookController.handleWebhook);

// Get logs for a specific route
router.get('/routes/:id/logs', async (req, res) => {
    try {
        const { page = 1, limit = 100 } = req.query;
        const logs = await RouteService.getRouteLogs(req.params.id, parseInt(page), parseInt(limit));
        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        logger.error('Error fetching route logs:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// Initialize database tables (useful for first-time setup)
router.post('/setup/init-db', async (req, res) => {
    try {
        await db.initializeTables();
        res.json({
            success: true,
            message: 'Database tables initialized successfully'
        });
    } catch (error) {
        logger.error('Error initializing database:', error.message);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;