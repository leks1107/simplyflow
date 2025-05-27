const logger = require('../utils/logger');

/**
 * Validation Service
 * Handles all data validation logic for Typeform webhooks
 */
class ValidationService {
    /**
     * Extract data from Typeform webhook payload
     * Typeform sends data in form_response.answers array
     * @param {Object} webhookData - Raw webhook data from Typeform
     * @returns {Object} - Extracted data { email, city, interest }
     */
    static extractTypeformData(webhookData) {
        try {
            logger.debug('Extracting data from Typeform webhook payload');
            
            // Check if we have the expected Typeform structure
            if (!webhookData.form_response || !webhookData.form_response.answers) {
                logger.warning('Invalid Typeform webhook structure');
                return null;
            }

            const answers = webhookData.form_response.answers;
            const extractedData = {};

            // Extract data based on field types or field references
            answers.forEach(answer => {
                const fieldType = answer.field?.type;
                const fieldRef = answer.field?.ref;
                
                // Extract email
                if (fieldType === 'email' || (answer.email && !extractedData.email)) {
                    extractedData.email = answer.email;
                }                // Extract city (could be short_text, dropdown, or multiple_choice)
                if (fieldRef?.includes('city') || fieldRef?.includes('city') || 
                    (answer.text && !extractedData.city && fieldType === 'short_text')) {
                    extractedData.city = answer.text || answer.choice?.label;
                }
                
                // Extract interest
                if (fieldRef?.includes('interest') || fieldRef?.includes('interest') ||
                    (answer.text && !extractedData.interest && !extractedData.city)) {
                    extractedData.interest = answer.text || answer.choice?.label;
                }
            });

            logger.debug('Extracted data:', extractedData);
            return extractedData;
        } catch (error) {
            logger.error('Error extracting Typeform data:', error.message);
            return null;
        }
    }

    /**
     * Validate webhook data contains required fields
     * @param {Object} data - Extracted data object
     * @returns {Object} - { valid: boolean, errors: string[] }
     */
    static validateRequiredFields(data) {
        const errors = [];
        
        if (!data) {
            errors.push('No data extracted from webhook');
            return { valid: false, errors };
        }

        if (!data.email || !this.isValidEmail(data.email)) {
            errors.push('Valid email is required');
        }

        if (!data.city || typeof data.city !== 'string' || data.city.trim() === '') {
            errors.push('City is required');
        }

        if (!data.interest || typeof data.interest !== 'string' || data.interest.trim() === '') {
            errors.push('Interest is required');
        }

        const isValid = errors.length === 0;
        logger.debug(`Field validation result: ${isValid ? 'PASSED' : 'FAILED'}`, { errors });
        
        return { valid: isValid, errors };
    }

    /**
     * Check if email format is valid
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid
     */
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Check if city is valid (must be "New York")
     * @param {string} city - City to validate
     * @returns {boolean} - True if city is "New York"
     */
    static isCityValid(city) {
        if (!city || typeof city !== 'string') {
            return false;
        }
        
        const normalizedCity = city.trim().toLowerCase();
        const isValid = normalizedCity === 'new york';
        
        logger.debug(`City validation for "${city}": ${isValid ? 'VALID' : 'INVALID'}`);
        return isValid;
    }

    /**
     * Complete validation pipeline
     * @param {Object} webhookData - Raw webhook data
     * @returns {Object} - { valid: boolean, data: Object|null, reason: string }
     */
    static validateWebhookData(webhookData) {
        // Extract data from Typeform structure
        const extractedData = this.extractTypeformData(webhookData);
        
        if (!extractedData) {
            return {
                valid: false,
                data: null,
                reason: 'Could not extract data from webhook payload'
            };
        }

        // Validate required fields
        const fieldValidation = this.validateRequiredFields(extractedData);
        if (!fieldValidation.valid) {
            return {
                valid: false,
                data: extractedData,
                reason: `Validation failed: ${fieldValidation.errors.join(', ')}`
            };
        }

        // Validate city
        if (!this.isCityValid(extractedData.city)) {
            return {
                valid: false,
                data: extractedData,
                reason: `City validation failed: "${extractedData.city}" is not "New York"`
            };
        }

        return {
            valid: true,
            data: extractedData,
            reason: 'All validations passed'
        };
    }
}

module.exports = ValidationService;