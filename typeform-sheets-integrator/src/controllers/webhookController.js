const { validateRequest } = require('../services/validationService');
const { checkEmailExists, addRow } = require('../services/googleSheetsService');
const logger = require('../utils/logger');

const handleWebhook = async (req, res) => {
    const { body } = req;

    // Validate the incoming request
    const validationError = validateRequest(body);
    if (validationError) {
        logger.warn(`⚠ Skipped: ${validationError}`);
        return res.status(400).json({ error: validationError });
    }

    const { email, city, interest } = body;

    // Check if the email already exists in the Google Sheet
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        logger.warn('⚠ Skipped: duplicate');
        return res.status(409).json({ error: 'Duplicate entry' });
    }

    // Check if the city is "New York"
    if (city !== 'New York') {
        logger.warn('⚠ Skipped: city not suitable');
        return res.status(400).json({ error: 'City not suitable' });
    }

    // Add the new row to the Google Sheet
    const timestamp = new Date().toISOString();
    await addRow(email, timestamp, interest);
    logger.info('✔ Added');
    
    return res.status(201).json({ message: 'Data added successfully' });
};

module.exports = { handleWebhook };