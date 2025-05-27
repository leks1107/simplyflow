/**
 * Email Digest Service
 * Handles email digest functionality for SimpFlow routes
 */

const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

class EmailDigestService {
    constructor() {
        this.transporter = null;
        this.initializeTransporter();
    }

    /**
     * Initialize email transporter
     */
    initializeTransporter() {
        if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
            throw new Error('Missing SMTP credentials. Check your environment variables.');
        }

        try {
            this.transporter = nodemailer.createTransporter({
                host: process.env.SMTP_HOST,
                port: parseInt(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            });
            
            logger.debug('Email transporter initialized');
        } catch (error) {
            logger.error('Failed to initialize email transporter:', error.message);
            throw error;
        }
    }

    /**
     * Send data via email based on route configuration
     * @param {Object} data - Validated webhook data
     * @param {Object} targetConfig - Email target configuration
     * @returns {Promise<Object>} - Result of the operation
     */
    async sendData(data, targetConfig) {
        try {
            const { 
                to, 
                cc = null, 
                bcc = null,
                subject = 'New Form Submission',
                template = 'default',
                includeAttachment = false
            } = targetConfig;
            
            if (!to) {
                throw new Error('Recipient email is required for email target');
            }

            logger.debug('Sending email notification', { 
                to,
                subject,
                template,
                dataKeys: Object.keys(data) 
            });

            // Generate email content
            const emailContent = this.generateEmailContent(data, template, targetConfig);
            
            // Prepare email options
            const mailOptions = {
                from: process.env.SMTP_FROM || process.env.SMTP_USER,
                to,
                subject,
                html: emailContent.html,
                text: emailContent.text,
            };

            // Add CC and BCC if specified
            if (cc) mailOptions.cc = cc;
            if (bcc) mailOptions.bcc = bcc;

            // Add attachment if requested
            if (includeAttachment) {
                mailOptions.attachments = [
                    {
                        filename: 'form-data.json',
                        content: JSON.stringify(data, null, 2),
                        contentType: 'application/json',
                    },
                ];
            }

            // Send email
            const result = await this.transporter.sendMail(mailOptions);
            
            logger.info('Email sent successfully', { 
                to,
                subject,
                messageId: result.messageId
            });

            return {
                success: true,
                target: 'email',
                to,
                subject,
                messageId: result.messageId,
                emailsSent: 1
            };
        } catch (error) {
            logger.error('Error sending email:', error.message);
            throw error;
        }
    }

    /**
     * Generate email content from data
     * @param {Object} data - Webhook data
     * @param {string} template - Template type
     * @param {Object} config - Email configuration
     * @returns {Object} - Email content { html, text }
     */
    generateEmailContent(data, template = 'default', config = {}) {
        try {
            const { customTemplate, includeMetadata = true } = config;
            
            // Use custom template if provided
            if (customTemplate) {
                return this.processCustomTemplate(customTemplate, data);
            }

            // Generate content based on template type
            switch (template) {
                case 'simple':
                    return this.generateSimpleTemplate(data, includeMetadata);
                case 'detailed':
                    return this.generateDetailedTemplate(data, includeMetadata);
                case 'minimal':
                    return this.generateMinimalTemplate(data, includeMetadata);
                default:
                    return this.generateDefaultTemplate(data, includeMetadata);
            }
        } catch (error) {
            logger.error('Error generating email content:', error.message);
            return this.generateFallbackTemplate(data);
        }
    }

    /**
     * Generate default email template
     * @param {Object} data - Webhook data
     * @param {boolean} includeMetadata - Whether to include metadata
     * @returns {Object} - Email content { html, text }
     */
    generateDefaultTemplate(data, includeMetadata = true) {
        const metadata = data._metadata || {};
        const formName = metadata.form_id || 'Unknown Form';
        const source = metadata.source || 'unknown';
        const submittedAt = metadata.submitted_at ? new Date(metadata.submitted_at).toLocaleString() : new Date().toLocaleString();

        let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>New Form Submission</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #007bff; }
                .header h1 { color: #007bff; margin: 0; }
                .field { margin-bottom: 15px; padding: 10px; background-color: #f8f9fa; border-radius: 4px; }
                .field-label { font-weight: bold; color: #333; margin-bottom: 5px; }
                .field-value { color: #666; word-break: break-word; }
                .metadata { margin-top: 30px; padding-top: 20px; border-top: 1px solid #dee2e6; font-size: 12px; color: #6c757d; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #6c757d; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>📝 New Form Submission</h1>
                    <p>You have received a new form submission</p>
                </div>
                
                <div class="content">
        `;

        let text = `NEW FORM SUBMISSION\n\n`;

        // Add form fields
        Object.keys(data).forEach(key => {
            if (key === '_metadata') return;
            
            const value = data[key];
            if (value !== undefined && value !== null && value !== '') {
                const label = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                
                html += `
                    <div class="field">
                        <div class="field-label">${label}:</div>
                        <div class="field-value">${this.escapeHtml(String(value))}</div>
                    </div>
                `;
                
                text += `${label}: ${value}\n`;
            }
        });

        // Add metadata if requested
        if (includeMetadata && metadata) {
            html += `
                <div class="metadata">
                    <strong>Submission Details:</strong><br>
                    Source: ${source}<br>
                    Form ID: ${formName}<br>
                    Submitted: ${submittedAt}
                </div>
            `;
            
            text += `\n--- Submission Details ---\n`;
            text += `Source: ${source}\n`;
            text += `Form ID: ${formName}\n`;
            text += `Submitted: ${submittedAt}\n`;
        }

        html += `
                </div>
                <div class="footer">
                    <p>This email was generated automatically by SimpFlow.</p>
                </div>
            </div>
        </body>
        </html>
        `;

        return { html, text };
    }

    /**
     * Generate simple email template
     * @param {Object} data - Webhook data
     * @param {boolean} includeMetadata - Whether to include metadata
     * @returns {Object} - Email content { html, text }
     */
    generateSimpleTemplate(data, includeMetadata = true) {
        const metadata = data._metadata || {};
        const source = metadata.source || 'form';

        let html = `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">New ${source} submission</h2>
            <ul style="list-style: none; padding: 0;">
        `;

        let text = `New ${source} submission\n\n`;

        Object.keys(data).forEach(key => {
            if (key === '_metadata') return;
            
            const value = data[key];
            if (value !== undefined && value !== null && value !== '') {
                const label = key.replace(/_/g, ' ');
                html += `<li style="margin: 10px 0;"><strong>${label}:</strong> ${this.escapeHtml(String(value))}</li>`;
                text += `${label}: ${value}\n`;
            }
        });

        html += `</ul></div>`;

        return { html, text };
    }

    /**
     * Generate detailed email template
     * @param {Object} data - Webhook data
     * @param {boolean} includeMetadata - Whether to include metadata
     * @returns {Object} - Email content { html, text }
     */
    generateDetailedTemplate(data, includeMetadata = true) {
        const defaultTemplate = this.generateDefaultTemplate(data, includeMetadata);
        
        // Add additional styling and information for detailed template
        let html = defaultTemplate.html.replace(
            '<div class="content">',
            `<div class="content">
                <div style="background-color: #e7f3ff; padding: 15px; border-radius: 4px; margin-bottom: 20px;">
                    <h3 style="margin: 0; color: #0066cc;">📊 Submission Summary</h3>
                    <p style="margin: 5px 0 0 0; color: #666;">
                        This submission contains ${Object.keys(data).filter(k => k !== '_metadata').length} fields
                    </p>
                </div>`
        );

        return { html, text: defaultTemplate.text };
    }

    /**
     * Generate minimal email template
     * @param {Object} data - Webhook data
     * @param {boolean} includeMetadata - Whether to include metadata
     * @returns {Object} - Email content { html, text }
     */
    generateMinimalTemplate(data, includeMetadata = false) {
        let content = '';
        let text = '';

        Object.keys(data).forEach(key => {
            if (key === '_metadata') return;
            
            const value = data[key];
            if (value !== undefined && value !== null && value !== '') {
                content += `${key}: ${value}<br>`;
                text += `${key}: ${value}\n`;
            }
        });

        const html = `<div style="font-family: Arial, sans-serif;">${content}</div>`;

        return { html, text };
    }

    /**
     * Process custom email template
     * @param {string} template - Custom template string
     * @param {Object} data - Webhook data
     * @returns {Object} - Email content { html, text }
     */
    processCustomTemplate(template, data) {
        try {
            let processedTemplate = template;

            // Replace placeholders with actual data
            Object.keys(data).forEach(key => {
                if (key === '_metadata') return;
                
                const placeholder = `{{${key}}}`;
                const value = data[key] || '';
                processedTemplate = processedTemplate.replace(new RegExp(placeholder, 'g'), value);
            });

            // Replace metadata placeholders if they exist
            if (data._metadata) {
                const metadata = data._metadata;
                processedTemplate = processedTemplate.replace(/{{source}}/g, metadata.source || '');
                processedTemplate = processedTemplate.replace(/{{form_id}}/g, metadata.form_id || '');
                processedTemplate = processedTemplate.replace(/{{submitted_at}}/g, metadata.submitted_at || '');
            }

            // Generate text version by stripping HTML
            const text = processedTemplate.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

            return { html: processedTemplate, text };
        } catch (error) {
            logger.error('Error processing custom template:', error.message);
            return this.generateFallbackTemplate(data);
        }
    }

    /**
     * Generate fallback email template
     * @param {Object} data - Webhook data
     * @returns {Object} - Email content { html, text }
     */
    generateFallbackTemplate(data) {
        const text = `New form submission:\n\n${JSON.stringify(data, null, 2)}`;
        const html = `<pre>${this.escapeHtml(text)}</pre>`;
        
        return { html, text };
    }

    /**
     * Escape HTML characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, m => map[m]);
    }

    /**
     * Validate email connection
     * @returns {Promise<boolean>} - True if connection is valid
     */
    async validateConnection() {
        try {
            await this.transporter.verify();
            logger.info('Email connection validated successfully');
            return true;
        } catch (error) {
            logger.error('Email connection validation failed:', error.message);
            throw new Error(`Email connection failed: ${error.message}`);
        }
    }

    /**
     * Send test email
     * @param {string} to - Recipient email
     * @returns {Promise<Object>} - Result of the test
     */
    async sendTestEmail(to) {
        try {
            const testData = {
                name: 'Test User',
                email: 'test@example.com',
                message: 'This is a test submission from SimpFlow',
                _metadata: {
                    source: 'test',
                    form_id: 'test-form',
                    submitted_at: new Date().toISOString()
                }
            };

            const result = await this.sendData(testData, {
                to,
                subject: 'SimpFlow Test Email',
                template: 'default'
            });

            return result;
        } catch (error) {
            logger.error('Error sending test email:', error.message);
            throw error;
        }
    }
}

// Export class (not singleton) so it can be instantiated per route
module.exports = EmailDigestService;
