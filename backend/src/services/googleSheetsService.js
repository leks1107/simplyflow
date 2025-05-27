const { google } = require('googleapis');
const logger = require('../utils/logger');

/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API for SimpFlow routes
 */
class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = google.sheets('v4');
        this.initializeAuth();
    }

    /**
     * Initialize Google Sheets authentication
     */
    initializeAuth() {
        if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
            throw new Error('Missing Google Sheets credentials. Check your environment variables.');
        }

        try {
            this.auth = new google.auth.JWT(
                process.env.GOOGLE_CLIENT_EMAIL,
                null,
                process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
                ['https://www.googleapis.com/auth/spreadsheets']
            );
            
            logger.debug('Google Sheets authentication initialized');
        } catch (error) {
            logger.error('Failed to initialize Google Sheets authentication:', error.message);
            throw error;
        }
    }    /**
     * Send data to Google Sheets based on route configuration
     * @param {Object} data - Validated webhook data
     * @param {Object} targetConfig - Google Sheets target configuration
     * @returns {Promise<Object>} - Result of the operation
     */
    async sendData(data, targetConfig) {
        try {
            const { spreadsheetId, sheetName = 'Sheet1', mapping = {} } = targetConfig;
            
            if (!spreadsheetId) {
                throw new Error('Spreadsheet ID is required for Google Sheets target');
            }

            logger.debug('Sending data to Google Sheets', { 
                spreadsheetId, 
                sheetName, 
                dataKeys: Object.keys(data) 
            });

            // Get or create headers
            const headers = await this.getOrCreateHeaders(spreadsheetId, sheetName, data, mapping);
            
            // Prepare row data based on headers
            const rowData = this.prepareRowData(data, headers, mapping);
            
            // Add row to spreadsheet
            await this.addRowToSheet(spreadsheetId, sheetName, rowData);
            
            logger.info('Data sent to Google Sheets successfully', { 
                spreadsheetId, 
                sheetName,
                rowCount: 1
            });

            return {
                success: true,
                target: 'google_sheets',
                spreadsheetId,
                sheetName,
                rowsAdded: 1
            };
        } catch (error) {
            logger.error('Error sending data to Google Sheets:', error.message);
            throw error;
        }
    }

    /**
     * Get existing headers or create them if sheet is empty
     * @param {string} spreadsheetId - Spreadsheet ID
     * @param {string} sheetName - Sheet name
     * @param {Object} data - Data object to create headers from
     * @param {Object} mapping - Field mapping configuration
     * @returns {Promise<Array>} - Array of header names
     */
    async getOrCreateHeaders(spreadsheetId, sheetName, data, mapping = {}) {
        try {
            const range = `${sheetName}!1:1`;
            const response = await this.sheets.spreadsheets.values.get({
                auth: this.auth,
                spreadsheetId,
                range,
            });

            let headers = response.data.values?.[0] || [];
            
            // If no headers exist, create them from data
            if (headers.length === 0) {
                headers = this.createHeadersFromData(data, mapping);
                
                await this.sheets.spreadsheets.values.update({
                    auth: this.auth,
                    spreadsheetId,
                    range: `${sheetName}!1:1`,
                    valueInputOption: 'RAW',
                    resource: {
                        values: [headers],
                    },
                });
                
                logger.debug('Created headers in Google Sheets', { headers });
            }

            return headers;
        } catch (error) {
            logger.error('Error getting/creating headers:', error.message);
            throw error;
        }
    }

    /**
     * Create headers from data object
     * @param {Object} data - Data object
     * @param {Object} mapping - Field mapping configuration
     * @returns {Array} - Array of header names
     */
    createHeadersFromData(data, mapping = {}) {
        const headers = [];
        
        // Standard fields with preferred order
        const preferredOrder = ['email', 'phone', 'name', 'first_name', 'last_name', 'company'];
        
        // Add preferred fields first if they exist
        preferredOrder.forEach(field => {
            if (data[field] !== undefined) {
                const mappedName = mapping[field] || field;
                headers.push(mappedName);
            }
        });
        
        // Add remaining fields (except metadata)
        Object.keys(data).forEach(field => {
            if (field !== '_metadata' && !preferredOrder.includes(field)) {
                const mappedName = mapping[field] || field;
                if (!headers.includes(mappedName)) {
                    headers.push(mappedName);
                }
            }
        });
        
        // Add timestamp field
        headers.push('timestamp');
        headers.push('source');
        
        return headers;
    }

    /**
     * Prepare row data based on headers
     * @param {Object} data - Data object
     * @param {Array} headers - Header names
     * @param {Object} mapping - Field mapping configuration
     * @returns {Array} - Array of values for the row
     */
    prepareRowData(data, headers, mapping = {}) {
        const rowData = [];
        
        headers.forEach(header => {
            // Find the original field name for this header
            const originalField = Object.keys(mapping).find(key => mapping[key] === header) || header;
            
            if (originalField === 'timestamp') {
                rowData.push(new Date().toISOString());
            } else if (originalField === 'source') {
                rowData.push(data._metadata?.source || 'unknown');
            } else {
                const value = data[originalField];
                rowData.push(value !== undefined ? String(value) : '');
            }
        });
        
        return rowData;
    }

    /**
     * Add a row to the spreadsheet
     * @param {string} spreadsheetId - Spreadsheet ID
     * @param {string} sheetName - Sheet name
     * @param {Array} rowData - Array of values for the row
     */
    async addRowToSheet(spreadsheetId, sheetName, rowData) {
        try {
            const range = `${sheetName}!A:A`;
            
            await this.sheets.spreadsheets.values.append({
                auth: this.auth,
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: [rowData],
                },
            });

            logger.debug('Row added to Google Sheets successfully', { 
                spreadsheetId, 
                sheetName, 
                dataLength: rowData.length 
            });
        } catch (error) {
            logger.error('Error adding row to sheet:', error.message);
            throw error;
        }
    }

    /**
     * Check for duplicate data in spreadsheet
     * @param {string} spreadsheetId - Spreadsheet ID
     * @param {string} sheetName - Sheet name
     * @param {string} field - Field name to check
     * @param {string} value - Value to check for
     * @returns {Promise<boolean>} - True if duplicate found
     */
    async checkDuplicate(spreadsheetId, sheetName, field, value) {
        try {
            // Get headers to find column index
            const headers = await this.getOrCreateHeaders(spreadsheetId, sheetName, {}, {});
            const columnIndex = headers.findIndex(header => header.toLowerCase() === field.toLowerCase());
            
            if (columnIndex === -1) {
                return false; // Field doesn't exist, so no duplicate
            }
            
            // Convert column index to letter (A, B, C, etc.)
            const columnLetter = String.fromCharCode(65 + columnIndex);
            const range = `${sheetName}!${columnLetter}:${columnLetter}`;
            
            const response = await this.sheets.spreadsheets.values.get({
                auth: this.auth,
                spreadsheetId,
                range,
            });

            const values = response.data.values || [];
            const existingValues = values.flat().map(v => String(v).toLowerCase().trim());
            const isDuplicate = existingValues.includes(String(value).toLowerCase().trim());
            
            logger.debug(`Duplicate check for ${field}=${value}: ${isDuplicate ? 'FOUND' : 'NOT_FOUND'}`);
            return isDuplicate;
        } catch (error) {
            logger.error('Error checking for duplicate:', error.message);
            return false; // Return false on error to avoid blocking
        }
    }

    /**
     * Validate Google Sheets connection and permissions
     * @param {string} spreadsheetId - Spreadsheet ID to test
     * @returns {Promise<boolean>} - True if connection is valid
     */
    async validateConnection(spreadsheetId) {
        try {
            await this.sheets.spreadsheets.get({
                auth: this.auth,
                spreadsheetId,
            });
            logger.info('Google Sheets connection validated successfully', { spreadsheetId });
            return true;
        } catch (error) {
            logger.error('Google Sheets connection validation failed:', error.message);
            throw new Error(`Google Sheets connection failed: ${error.message}`);
        }
    }
}

// Export class (not singleton) so it can be instantiated per route
module.exports = GoogleSheetsService;