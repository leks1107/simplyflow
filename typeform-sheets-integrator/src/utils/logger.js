const logger = {
    info: (message) => {
        console.log(`INFO: ${message}`);
    },
    warn: (message) => {
        console.log(`WARN: ${message}`);
    },
    error: (message) => {
        console.log(`ERROR: ${message}`);
    }
};

module.exports = logger;