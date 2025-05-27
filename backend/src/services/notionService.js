/**
 * Notion Service
 * Handles all interactions with Notion API for SimpFlow routes
 */

const { Client } = require('@notionhq/client');
const logger = require('../utils/logger');

class NotionService {
    constructor() {
        this.notion = null;
        this.initializeClient();
    }

    /**
     * Initialize Notion client
     */
    initializeClient() {
        if (!process.env.NOTION_TOKEN) {
            throw new Error('Missing Notion token. Check your environment variables.');
        }

        try {
            this.notion = new Client({
                auth: process.env.NOTION_TOKEN,
            });
            
            logger.debug('Notion client initialized');
        } catch (error) {
            logger.error('Failed to initialize Notion client:', error.message);
            throw error;
        }
    }

    /**
     * Send data to Notion database based on route configuration
     * @param {Object} data - Validated webhook data
     * @param {Object} targetConfig - Notion target configuration
     * @returns {Promise<Object>} - Result of the operation
     */
    async sendData(data, targetConfig) {
        try {
            const { databaseId, mapping = {} } = targetConfig;
            
            if (!databaseId) {
                throw new Error('Database ID is required for Notion target');
            }

            logger.debug('Sending data to Notion database', { 
                databaseId, 
                dataKeys: Object.keys(data) 
            });

            // Prepare properties for Notion page
            const properties = await this.prepareNotionProperties(data, databaseId, mapping);
            
            // Create page in Notion database
            const response = await this.notion.pages.create({
                parent: {
                    database_id: databaseId,
                },
                properties,
            });
            
            logger.info('Data sent to Notion successfully', { 
                databaseId,
                pageId: response.id
            });

            return {
                success: true,
                target: 'notion',
                databaseId,
                pageId: response.id,
                pagesAdded: 1
            };
        } catch (error) {
            logger.error('Error sending data to Notion:', error.message);
            throw error;
        }
    }

    /**
     * Prepare Notion properties from webhook data
     * @param {Object} data - Webhook data
     * @param {string} databaseId - Notion database ID
     * @param {Object} mapping - Field mapping configuration
     * @returns {Promise<Object>} - Notion properties object
     */
    async prepareNotionProperties(data, databaseId, mapping = {}) {
        try {
            // Get database schema to understand property types
            const database = await this.notion.databases.retrieve({
                database_id: databaseId,
            });

            const properties = {};
            const dbProperties = database.properties;

            // Process each field in the data
            Object.keys(data).forEach(field => {
                if (field === '_metadata') return; // Skip metadata

                const mappedField = mapping[field] || field;
                const value = data[field];
                
                if (value === undefined || value === null) return;

                // Find matching property in Notion database (case-insensitive)
                const dbPropertyKey = Object.keys(dbProperties).find(
                    key => key.toLowerCase() === mappedField.toLowerCase()
                );

                if (!dbPropertyKey) {
                    logger.warn(`Property '${mappedField}' not found in Notion database`);
                    return;
                }

                const propertyType = dbProperties[dbPropertyKey].type;
                
                // Convert value based on Notion property type
                properties[dbPropertyKey] = this.convertValueToNotionProperty(value, propertyType);
            });

            // Add metadata properties if they exist in the database
            if (data._metadata) {
                const metadata = data._metadata;
                
                // Add source
                if (metadata.source && dbProperties['Source']) {
                    properties['Source'] = this.convertValueToNotionProperty(
                        metadata.source, 
                        dbProperties['Source'].type
                    );
                }
                
                // Add submission timestamp
                if (metadata.submitted_at && dbProperties['Submitted At']) {
                    properties['Submitted At'] = this.convertValueToNotionProperty(
                        metadata.submitted_at, 
                        dbProperties['Submitted At'].type
                    );
                }
                
                // Add form ID
                if (metadata.form_id && dbProperties['Form ID']) {
                    properties['Form ID'] = this.convertValueToNotionProperty(
                        metadata.form_id, 
                        dbProperties['Form ID'].type
                    );
                }
            }

            // Add current timestamp if Created property exists
            if (dbProperties['Created'] || dbProperties['Date Created']) {
                const createdProperty = dbProperties['Created'] || dbProperties['Date Created'];
                const propertyKey = dbProperties['Created'] ? 'Created' : 'Date Created';
                properties[propertyKey] = this.convertValueToNotionProperty(
                    new Date().toISOString(), 
                    createdProperty.type
                );
            }

            logger.debug('Prepared Notion properties', { 
                fieldCount: Object.keys(properties).length 
            });

            return properties;
        } catch (error) {
            logger.error('Error preparing Notion properties:', error.message);
            throw error;
        }
    }

    /**
     * Convert value to appropriate Notion property format
     * @param {any} value - Value to convert
     * @param {string} propertyType - Notion property type
     * @returns {Object} - Notion property object
     */
    convertValueToNotionProperty(value, propertyType) {
        try {
            switch (propertyType) {
                case 'title':
                    return {
                        title: [
                            {
                                text: {
                                    content: String(value).substring(0, 2000), // Notion title limit
                                },
                            },
                        ],
                    };

                case 'rich_text':
                    return {
                        rich_text: [
                            {
                                text: {
                                    content: String(value).substring(0, 2000), // Notion text limit
                                },
                            },
                        ],
                    };

                case 'email':
                    return {
                        email: String(value),
                    };

                case 'phone_number':
                    return {
                        phone_number: String(value),
                    };

                case 'url':
                    return {
                        url: String(value),
                    };

                case 'number':
                    const numValue = parseFloat(value);
                    return {
                        number: isNaN(numValue) ? null : numValue,
                    };

                case 'date':
                    const dateValue = new Date(value);
                    return {
                        date: {
                            start: isNaN(dateValue.getTime()) ? null : dateValue.toISOString().split('T')[0],
                        },
                    };

                case 'checkbox':
                    return {
                        checkbox: Boolean(value),
                    };

                case 'select':
                    return {
                        select: {
                            name: String(value).substring(0, 100), // Notion select option limit
                        },
                    };

                case 'multi_select':
                    const options = Array.isArray(value) ? value : [value];
                    return {
                        multi_select: options.map(option => ({
                            name: String(option).substring(0, 100),
                        })),
                    };

                default:
                    // Default to rich text for unknown types
                    return {
                        rich_text: [
                            {
                                text: {
                                    content: String(value).substring(0, 2000),
                                },
                            },
                        ],
                    };
            }
        } catch (error) {
            logger.error('Error converting value to Notion property:', error.message);
            // Return safe fallback
            return {
                rich_text: [
                    {
                        text: {
                            content: String(value).substring(0, 100),
                        },
                    },
                ],
            };
        }
    }

    /**
     * Check for duplicate data in Notion database
     * @param {string} databaseId - Notion database ID
     * @param {string} field - Field name to check
     * @param {string} value - Value to check for
     * @returns {Promise<boolean>} - True if duplicate found
     */
    async checkDuplicate(databaseId, field, value) {
        try {
            logger.debug(`Checking for duplicate in Notion: ${field}=${value}`);

            // Get database schema to find the property
            const database = await this.notion.databases.retrieve({
                database_id: databaseId,
            });

            const dbProperties = database.properties;
            const dbPropertyKey = Object.keys(dbProperties).find(
                key => key.toLowerCase() === field.toLowerCase()
            );

            if (!dbPropertyKey) {
                logger.warn(`Property '${field}' not found in Notion database for duplicate check`);
                return false;
            }

            const propertyType = dbProperties[dbPropertyKey].type;

            // Create filter based on property type
            let filter;
            switch (propertyType) {
                case 'email':
                    filter = {
                        property: dbPropertyKey,
                        email: {
                            equals: value,
                        },
                    };
                    break;
                
                case 'phone_number':
                    filter = {
                        property: dbPropertyKey,
                        phone_number: {
                            equals: value,
                        },
                    };
                    break;
                
                case 'title':
                case 'rich_text':
                    filter = {
                        property: dbPropertyKey,
                        rich_text: {
                            equals: value,
                        },
                    };
                    break;
                
                case 'number':
                    filter = {
                        property: dbPropertyKey,
                        number: {
                            equals: parseFloat(value),
                        },
                    };
                    break;
                
                default:
                    // For other types, use rich_text comparison
                    filter = {
                        property: dbPropertyKey,
                        rich_text: {
                            equals: String(value),
                        },
                    };
            }

            // Query database with filter
            const response = await this.notion.databases.query({
                database_id: databaseId,
                filter,
                page_size: 1,
            });

            const isDuplicate = response.results.length > 0;
            logger.debug(`Duplicate check for ${field}=${value}: ${isDuplicate ? 'FOUND' : 'NOT_FOUND'}`);
            
            return isDuplicate;
        } catch (error) {
            logger.error('Error checking for duplicate in Notion:', error.message);
            return false; // Return false on error to avoid blocking
        }
    }

    /**
     * Validate Notion connection and permissions
     * @param {string} databaseId - Database ID to test
     * @returns {Promise<boolean>} - True if connection is valid
     */
    async validateConnection(databaseId) {
        try {
            await this.notion.databases.retrieve({
                database_id: databaseId,
            });
            logger.info('Notion connection validated successfully', { databaseId });
            return true;
        } catch (error) {
            logger.error('Notion connection validation failed:', error.message);
            throw new Error(`Notion connection failed: ${error.message}`);
        }
    }

    /**
     * Get database schema information
     * @param {string} databaseId - Database ID
     * @returns {Promise<Object>} - Database schema information
     */
    async getDatabaseSchema(databaseId) {
        try {
            const database = await this.notion.databases.retrieve({
                database_id: databaseId,
            });

            const schema = {
                id: database.id,
                title: database.title[0]?.plain_text || 'Untitled',
                properties: {},
            };

            Object.keys(database.properties).forEach(key => {
                const property = database.properties[key];
                schema.properties[key] = {
                    type: property.type,
                    id: property.id,
                };
            });

            logger.debug('Retrieved Notion database schema', { 
                databaseId,
                propertyCount: Object.keys(schema.properties).length 
            });

            return schema;
        } catch (error) {
            logger.error('Error getting Notion database schema:', error.message);
            throw error;
        }
    }
}

// Export class (not singleton) so it can be instantiated per route
module.exports = NotionService;
