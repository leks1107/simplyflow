/**
 * Validation Utilities
 * Handles data validation, sanitization, and transformation for multi-source webhooks
 */

const logger = require('./logger');

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * URL validation regex
 */
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

/**
 * Phone number validation regex (international format)
 */
const PHONE_REGEX = /^[\+]?[1-9][\d]{0,15}$/;

class ValidateUtils {
    /**
     * Validate email address
     * @param {string} email - Email to validate
     * @returns {boolean} - True if valid email
     */
    static isValidEmail(email) {
        if (!email || typeof email !== 'string') {
            return false;
        }
        return EMAIL_REGEX.test(email.trim());
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean} - True if valid URL
     */
    static isValidUrl(url) {
        if (!url || typeof url !== 'string') {
            return false;
        }
        return URL_REGEX.test(url.trim());
    }

    /**
     * Validate phone number
     * @param {string} phone - Phone number to validate
     * @returns {boolean} - True if valid phone number
     */
    static isValidPhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return false;
        }
        return PHONE_REGEX.test(phone.replace(/[\s\-\(\)]/g, ''));
    }

    /**
     * Validate if string is not empty
     * @param {string} value - Value to check
     * @returns {boolean} - True if not empty
     */
    static isNotEmpty(value) {
        return value && typeof value === 'string' && value.trim().length > 0;
    }

    /**
     * Validate if value is a number
     * @param {any} value - Value to check
     * @returns {boolean} - True if valid number
     */
    static isValidNumber(value) {
        return !isNaN(value) && !isNaN(parseFloat(value));
    }

    /**
     * Validate if value is a valid date
     * @param {any} value - Value to check
     * @returns {boolean} - True if valid date
     */
    static isValidDate(value) {
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
    }

    /**
     * Sanitize string by removing HTML tags and trimming
     * @param {string} value - Value to sanitize
     * @returns {string} - Sanitized value
     */
    static sanitizeString(value) {
        if (!value || typeof value !== 'string') {
            return '';
        }
        return value
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .trim()
            .replace(/\s+/g, ' '); // Replace multiple spaces with single space
    }

    /**
     * Normalize email address
     * @param {string} email - Email to normalize
     * @returns {string} - Normalized email
     */
    static normalizeEmail(email) {
        if (!this.isValidEmail(email)) {
            return null;
        }
        return email.toLowerCase().trim();
    }

    /**
     * Normalize phone number
     * @param {string} phone - Phone number to normalize
     * @returns {string} - Normalized phone number
     */
    static normalizePhone(phone) {
        if (!phone || typeof phone !== 'string') {
            return null;
        }
        return phone.replace(/[\s\-\(\)]/g, '');
    }

    /**
     * Extract data from Typeform webhook payload
     * @param {Object} webhookData - Raw webhook data from Typeform
     * @returns {Object} - Extracted and validated data
     */
    static extractTypeformData(webhookData) {
        try {
            logger.debug('Extracting data from Typeform webhook payload');
            
            if (!webhookData.form_response || !webhookData.form_response.answers) {
                logger.warn('Invalid Typeform webhook structure');
                return null;
            }

            const answers = webhookData.form_response.answers;
            const extractedData = {};

            answers.forEach(answer => {
                const fieldType = answer.field?.type;
                const fieldRef = answer.field?.ref;
                const fieldId = answer.field?.id;

                // Extract based on field type and reference
                switch (fieldType) {
                    case 'email':
                        if (answer.email) {
                            extractedData.email = this.normalizeEmail(answer.email);
                        }
                        break;
                    
                    case 'phone_number':
                        if (answer.phone_number) {
                            extractedData.phone = this.normalizePhone(answer.phone_number);
                        }
                        break;
                    
                    case 'short_text':
                    case 'long_text':
                        if (answer.text) {
                            const sanitizedText = this.sanitizeString(answer.text);
                            if (fieldRef) {
                                extractedData[fieldRef] = sanitizedText;
                            } else {
                                // Try to identify field by content
                                if (this.isValidEmail(sanitizedText) && !extractedData.email) {
                                    extractedData.email = this.normalizeEmail(sanitizedText);
                                } else if (this.isValidPhone(sanitizedText) && !extractedData.phone) {
                                    extractedData.phone = this.normalizePhone(sanitizedText);
                                }
                            }
                        }
                        break;
                    
                    case 'multiple_choice':
                    case 'dropdown':
                        if (answer.choice?.label) {
                            const value = this.sanitizeString(answer.choice.label);
                            if (fieldRef) {
                                extractedData[fieldRef] = value;
                            }
                        }
                        break;
                    
                    case 'number':
                        if (answer.number !== undefined) {
                            if (fieldRef) {
                                extractedData[fieldRef] = answer.number;
                            }
                        }
                        break;
                    
                    case 'date':
                        if (answer.date) {
                            if (fieldRef) {
                                extractedData[fieldRef] = answer.date;
                            }
                        }
                        break;
                    
                    case 'url':
                        if (answer.url && this.isValidUrl(answer.url)) {
                            if (fieldRef) {
                                extractedData[fieldRef] = answer.url;
                            }
                        }
                        break;
                }
            });

            // Add metadata
            extractedData._metadata = {
                form_id: webhookData.form_response?.form_id,
                response_id: webhookData.form_response?.token,
                submitted_at: webhookData.form_response?.submitted_at,
                source: 'typeform'
            };

            logger.debug('Extracted Typeform data:', extractedData);
            return extractedData;
        } catch (error) {
            logger.error('Error extracting Typeform data:', error.message);
            return null;
        }
    }

    /**
     * Extract data from Tally webhook payload
     * @param {Object} webhookData - Raw webhook data from Tally
     * @returns {Object} - Extracted and validated data
     */
    static extractTallyData(webhookData) {
        try {
            logger.debug('Extracting data from Tally webhook payload');
            
            if (!webhookData.data || !webhookData.data.fields) {
                logger.warn('Invalid Tally webhook structure');
                return null;
            }

            const fields = webhookData.data.fields;
            const extractedData = {};

            fields.forEach(field => {
                const fieldType = field.type;
                const fieldKey = field.key;
                const fieldValue = field.value;

                if (!fieldValue) return;

                switch (fieldType) {
                    case 'INPUT_EMAIL':
                        extractedData.email = this.normalizeEmail(fieldValue);
                        break;
                    
                    case 'INPUT_PHONE':
                        extractedData.phone = this.normalizePhone(fieldValue);
                        break;
                    
                    case 'INPUT_TEXT':
                    case 'TEXTAREA':
                        const sanitizedText = this.sanitizeString(fieldValue);
                        if (fieldKey) {
                            extractedData[fieldKey] = sanitizedText;
                        }
                        break;
                    
                    case 'SELECT':
                    case 'MULTIPLE_CHOICE':
                        if (fieldKey) {
                            extractedData[fieldKey] = this.sanitizeString(fieldValue);
                        }
                        break;
                    
                    case 'INPUT_NUMBER':
                        if (this.isValidNumber(fieldValue) && fieldKey) {
                            extractedData[fieldKey] = parseFloat(fieldValue);
                        }
                        break;
                    
                    case 'INPUT_DATE':
                        if (this.isValidDate(fieldValue) && fieldKey) {
                            extractedData[fieldKey] = fieldValue;
                        }
                        break;
                    
                    case 'INPUT_URL':
                        if (this.isValidUrl(fieldValue) && fieldKey) {
                            extractedData[fieldKey] = fieldValue;
                        }
                        break;
                }
            });

            // Add metadata
            extractedData._metadata = {
                form_id: webhookData.data?.formId,
                response_id: webhookData.data?.responseId,
                submitted_at: webhookData.data?.createdAt,
                source: 'tally'
            };

            logger.debug('Extracted Tally data:', extractedData);
            return extractedData;
        } catch (error) {
            logger.error('Error extracting Tally data:', error.message);
            return null;
        }
    }

    /**
     * Extract data from Paperform webhook payload
     * @param {Object} webhookData - Raw webhook data from Paperform
     * @returns {Object} - Extracted and validated data
     */
    static extractPaperformData(webhookData) {
        try {
            logger.debug('Extracting data from Paperform webhook payload');
            
            if (!webhookData.data) {
                logger.warn('Invalid Paperform webhook structure');
                return null;
            }

            const data = webhookData.data;
            const extractedData = {};

            // Paperform sends data with field keys directly
            Object.keys(data).forEach(key => {
                const value = data[key];
                
                if (!value) return;

                // Check if it's an email field
                if (key.toLowerCase().includes('email') || this.isValidEmail(value)) {
                    extractedData.email = this.normalizeEmail(value);
                }
                // Check if it's a phone field
                else if (key.toLowerCase().includes('phone') || this.isValidPhone(value)) {
                    extractedData.phone = this.normalizePhone(value);
                }
                // Check if it's a URL field
                else if (key.toLowerCase().includes('url') || this.isValidUrl(value)) {
                    extractedData[key] = value;
                }
                // Check if it's a number field
                else if (this.isValidNumber(value)) {
                    extractedData[key] = parseFloat(value);
                }
                // Check if it's a date field
                else if (this.isValidDate(value)) {
                    extractedData[key] = value;
                }
                // Default to sanitized string
                else if (typeof value === 'string') {
                    extractedData[key] = this.sanitizeString(value);
                }
                else {
                    extractedData[key] = value;
                }
            });

            // Add metadata
            extractedData._metadata = {
                form_id: webhookData.form_id,
                response_id: webhookData.submission_id,
                submitted_at: webhookData.created_at,
                source: 'paperform'
            };

            logger.debug('Extracted Paperform data:', extractedData);
            return extractedData;
        } catch (error) {
            logger.error('Error extracting Paperform data:', error.message);
            return null;
        }
    }

    /**
     * Validate extracted data against route configuration
     * @param {Object} data - Extracted data
     * @param {Object} routeConfig - Route configuration with validation rules
     * @returns {Object} - Validation result { isValid, errors, sanitizedData }
     */
    static validateData(data, routeConfig = {}) {
        const errors = [];
        const sanitizedData = { ...data };

        try {
            const validationRules = routeConfig.validation || {};

            // Check required fields
            if (validationRules.required) {
                validationRules.required.forEach(fieldName => {
                    if (!data[fieldName] || (typeof data[fieldName] === 'string' && !data[fieldName].trim())) {
                        errors.push(`Required field '${fieldName}' is missing or empty`);
                    }
                });
            }

            // Validate email if present
            if (data.email && !this.isValidEmail(data.email)) {
                errors.push('Invalid email format');
            }

            // Validate phone if present
            if (data.phone && !this.isValidPhone(data.phone)) {
                errors.push('Invalid phone number format');
            }

            // Validate URLs if present
            Object.keys(data).forEach(key => {
                if (key.toLowerCase().includes('url') && data[key] && !this.isValidUrl(data[key])) {
                    errors.push(`Invalid URL format for field '${key}'`);
                }
            });

            // Apply custom validation rules
            if (validationRules.custom) {
                validationRules.custom.forEach(rule => {
                    const { field, type, value } = rule;
                    
                    if (!data[field]) return;
                    
                    switch (type) {
                        case 'min_length':
                            if (data[field].length < value) {
                                errors.push(`Field '${field}' must be at least ${value} characters long`);
                            }
                            break;
                        case 'max_length':
                            if (data[field].length > value) {
                                errors.push(`Field '${field}' must be no more than ${value} characters long`);
                            }
                            break;
                        case 'pattern':
                            const regex = new RegExp(value);
                            if (!regex.test(data[field])) {
                                errors.push(`Field '${field}' does not match required pattern`);
                            }
                            break;
                    }
                });
            }

            logger.debug('Data validation completed', { 
                isValid: errors.length === 0, 
                errorsCount: errors.length 
            });

            return {
                isValid: errors.length === 0,
                errors,
                sanitizedData
            };
        } catch (error) {
            logger.error('Error during data validation:', error.message);
            return {
                isValid: false,
                errors: ['Validation error occurred'],
                sanitizedData: data
            };
        }
    }

    /**
     * Check for duplicate data based on specified fields
     * @param {Object} data - Data to check
     * @param {Array} duplicateFields - Fields to check for duplicates
     * @param {Function} checkFunction - Function to check existing data
     * @returns {Promise<boolean>} - True if duplicate found
     */
    static async checkDuplicate(data, duplicateFields = ['email'], checkFunction) {
        try {
            if (!checkFunction || typeof checkFunction !== 'function') {
                return false;
            }

            for (const field of duplicateFields) {
                if (data[field]) {
                    const isDuplicate = await checkFunction(field, data[field]);
                    if (isDuplicate) {
                        logger.debug(`Duplicate found for ${field}: ${data[field]}`);
                        return true;
                    }
                }
            }

            return false;
        } catch (error) {
            logger.error('Error checking for duplicates:', error.message);
            return false;
        }
    }
}

module.exports = ValidateUtils;
