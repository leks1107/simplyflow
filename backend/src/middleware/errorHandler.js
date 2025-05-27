const logger = require('../utils/logger');

// Move Map to module level instead of using this in static method
const rateLimitRequests = new Map();

/**
 * Error handling middleware
 * Centralized error handling for the Express application
 */
class ErrorHandler {
    /**
     * Global error handler middleware
     * @param {Error} error - Error object
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static handle(error, req, res, next) {
        // Log the error
        logger.error('Unhandled error:', {
            message: error.message,
            stack: error.stack,
            url: req.url,
            method: req.method,
            ip: req.ip,
            userAgent: req.get('User-Agent')
        });

        // Determine error type and status code
        let statusCode = 500;
        let message = 'Internal server error';

        if (error.name === 'ValidationError') {
            statusCode = 400;
            message = error.message;
        } else if (error.name === 'UnauthorizedError') {
            statusCode = 401;
            message = 'Unauthorized';
        } else if (error.status) {
            statusCode = error.status;
            message = error.message;
        }

        // Send error response
        const errorResponse = {
            success: false,
            error: message,
            timestamp: new Date().toISOString()
        };

        // Include stack trace in development
        if (process.env.NODE_ENV === 'development') {
            errorResponse.stack = error.stack;
            errorResponse.details = error;
        }

        res.status(statusCode).json(errorResponse);
    }

    /**
     * 404 Not Found handler
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     */
    static notFound(req, res) {
        logger.warning(`404 - Route not found: ${req.method} ${req.url}`);
        
        res.status(404).json({
            success: false,
            error: 'Endpoint not found',
            availableEndpoints: [
                'GET /api/health',
                'POST /api/routes',
                'GET /api/routes',
                'POST /api/trigger/:routeId'
            ],
            timestamp: new Date().toISOString()
        });
    }

    /**
     * Request logging middleware
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */
    static logRequests(req, res, next) {
        const start = Date.now();
        
        // Log request
        logger.debug(`➡️  ${req.method} ${req.url}`, {
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            contentType: req.get('Content-Type')
        });

        // Override res.json to log response
        const originalJson = res.json;
        res.json = function(data) {
            const duration = Date.now() - start;
            logger.debug(`⬅️  ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
            return originalJson.call(this, data);
        };

        next();
    }

    /**
     * Rate limiting simulation (basic)
     * Note: For production, use express-rate-limit package
     * @param {Object} req - Express request object
     * @param {Object} res - Express response object
     * @param {Function} next - Express next function
     */    static basicRateLimit(req, res, next) {
        // Use module-level variable instead of this.requests
        const clientIp = req.ip;
        const now = Date.now();
        const windowMs = 60000; // 1 minute
        const maxRequests = 60; // max 60 requests per minute

        if (!rateLimitRequests.has(clientIp)) {
            rateLimitRequests.set(clientIp, []);
        }

        const clientRequests = rateLimitRequests.get(clientIp);
        
        // Remove old requests outside the window
        const validRequests = clientRequests.filter(time => now - time < windowMs);
        
        if (validRequests.length >= maxRequests) {
            logger.warning(`Rate limit exceeded for IP: ${clientIp}`);
            return res.status(429).json({
                success: false,
                error: 'Too many requests',
                retryAfter: windowMs / 1000,
                timestamp: new Date().toISOString()
            });
        }

        // Add current request
        validRequests.push(now);
        rateLimitRequests.set(clientIp, validRequests);

        next();
    }
}

// Clean up old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    const windowMs = 60000;
    
    for (const [ip, requests] of rateLimitRequests.entries()) {
        const validRequests = requests.filter(time => now - time < windowMs);
        if (validRequests.length === 0) {
            rateLimitRequests.delete(ip);
        } else {
            rateLimitRequests.set(ip, validRequests);
        }
    }
}, 300000); // 5 minutes

module.exports = ErrorHandler;
