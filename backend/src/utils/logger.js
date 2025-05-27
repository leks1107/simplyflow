/**
 * Simple logger utility for consistent console output
 */
class Logger {
    static info(message, ...args) {
        console.log(`ℹ️  [${new Date().toISOString()}] INFO:`, message, ...args);
    }

    static success(message, ...args) {
        console.log(`✅ [${new Date().toISOString()}] SUCCESS:`, message, ...args);
    }

    static warning(message, ...args) {
        console.log(`⚠️  [${new Date().toISOString()}] WARNING:`, message, ...args);
    }

    static error(message, ...args) {
        console.error(`❌ [${new Date().toISOString()}] ERROR:`, message, ...args);
    }

    static debug(message, ...args) {
        if (process.env.NODE_ENV === 'development') {
            console.log(`🐛 [${new Date().toISOString()}] DEBUG:`, message, ...args);
        }
    }

    // Legacy methods for backwards compatibility
    static logSuccess(message) {
        this.success(message);
    }

    static logWarning(message) {
        this.warning(message);
    }

    static logError(message) {
        this.error(message);
    }
}

module.exports = Logger;