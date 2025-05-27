const { google } = require('googleapis');
const logger = require('../utils/logger');

/**
 * Google Sheets Service
 * Handles all interactions with Google Sheets API
 */
class GoogleSheetsService {
    constructor() {
        this.auth = null;
        this.sheets = google.sheets('v4');
        this.spreadsheetId = process.env.SPREADSHEET_ID;
        this.sheetName = process.env.SHEET_NAME || 'Sheet1';
        
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
    }

    /**
     * Check if email already exists in the first column
     * @param {string} email - Email to check
     * @returns {boolean} - True if email exists
     */
    async checkEmailExists(email) {
        try {
            const range = `${this.sheetName}!A:A`;
            const response = await this.sheets.spreadsheets.values.get({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: range,
            });

            const emails = response.data.values || [];
            const emailList = emails.flat().map(e => e.toLowerCase().trim());
            const emailExists = emailList.includes(email.toLowerCase().trim());
            
            logger.debug(`Email check for ${email}: ${emailExists ? 'EXISTS' : 'NOT_FOUND'}`);
            return emailExists;
        } catch (error) {
            logger.error('Error checking email existence:', error.message);
            throw new Error(`Failed to check email existence: ${error.message}`);
        }
    }

    /**
     * Add a new row to the spreadsheet
     * @param {string} email - User email
     * @param {string} timestamp - UTC timestamp
     * @param {string} interest - User interest
     */
    async addRow(email, timestamp, interest) {
        try {
            const range = `${this.sheetName}!A:C`;
            const values = [[email, timestamp, interest]];

            await this.sheets.spreadsheets.values.append({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
                range: range,
                valueInputOption: 'RAW',
                insertDataOption: 'INSERT_ROWS',
                resource: {
                    values: values,
                },
            });

            logger.debug(`Row added successfully: [${email}, ${timestamp}, ${interest}]`);
        } catch (error) {
            logger.error('Error adding row to spreadsheet:', error.message);
            throw new Error(`Failed to add row to spreadsheet: ${error.message}`);
        }
    }

    /**
     * Validate Google Sheets connection
     */
    async validateConnection() {
        try {
            await this.sheets.spreadsheets.get({
                auth: this.auth,
                spreadsheetId: this.spreadsheetId,
            });
            logger.info('Google Sheets connection validated successfully');
            return true;
        } catch (error) {
            logger.error('Google Sheets connection validation failed:', error.message);
            throw new Error(`Google Sheets connection failed: ${error.message}`);
        }
    }
}

// Export singleton instance
module.exports = new GoogleSheetsService();