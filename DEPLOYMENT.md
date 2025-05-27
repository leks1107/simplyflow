# SimpFlow Deployment Guide

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your configuration
# Minimum required variables:
# - Database connection (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
# - At least one target service (Google Sheets, Notion, or Email)
```

### 2. Database Setup
```bash
# Install PostgreSQL locally or use Supabase
# Create database
createdb simpflow

# Start the server (it will create tables automatically)
npm install
npm start
```

### 3. Service Configuration

#### Google Sheets
1. Create a Google Cloud project
2. Enable Google Sheets API
3. Create a service account
4. Download service account key
5. Add credentials to `.env`:
   ```
   GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
   GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
   ```

#### Notion
1. Create a Notion integration at https://www.notion.so/my-integrations
2. Copy the integration token
3. Add to `.env`:
   ```
   NOTION_TOKEN=secret_your_notion_integration_token
   ```

#### Email
1. Set up SMTP credentials (Gmail, SendGrid, etc.)
2. Add to `.env`:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ```

## Render Deployment

### 1. Prepare for Deployment
```bash
# Ensure your code is in a Git repository
git init
git add .
git commit -m "Initial SimpFlow backend"

# Push to GitHub/GitLab
git remote add origin https://github.com/yourusername/simpflow-backend.git
git push -u origin main
```

### 2. Deploy on Render
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: simpflow-backend
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free (or paid for production)

### 3. Environment Variables in Render
Add these environment variables in Render:

**Required:**
```
NODE_ENV=production
DATABASE_URL=postgresql://user:pass@host:5432/dbname
```

**For Google Sheets:**
```
GOOGLE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY=your-private-key-here
```

**For Notion:**
```
NOTION_TOKEN=secret_your_notion_token
```

**For Email:**
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@yourdomain.com
```

### 4. Database Setup on Render
**Option 1: Render PostgreSQL (Paid)**
1. Create a PostgreSQL database on Render
2. Use the provided DATABASE_URL

**Option 2: Supabase (Free tier available)**
1. Create project at https://supabase.com
2. Get connection string from Settings → Database
3. Use as DATABASE_URL

**Option 3: External PostgreSQL**
1. Use any PostgreSQL provider (ElephantSQL, Railway, etc.)
2. Add connection string as DATABASE_URL

## API Usage

### 1. Create a Route
```bash
curl -X POST https://your-app.onrender.com/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Contact Form",
    "source_type": "typeform",
    "is_active": true,
    "config": {
      "filters": [
        {
          "field": "email",
          "operator": "is_not_empty"
        }
      ],
      "targets": [
        {
          "type": "google_sheets",
          "config": {
            "spreadsheetId": "your-spreadsheet-id",
            "sheetName": "Contacts"
          }
        }
      ],
      "duplicate_check": {
        "enabled": true,
        "fields": ["email"]
      }
    }
  }'
```

### 2. Use Webhook URL
After creating a route, use this URL in your form:
```
https://your-app.onrender.com/webhook/{route-id}
```

### 3. Monitor Webhooks
```bash
# Get webhook logs
curl https://your-app.onrender.com/api/routes/{route-id}/logs

# Get route statistics
curl https://your-app.onrender.com/api/routes/{route-id}/stats
```

## Testing

### Local Testing
```bash
# Start the server
npm run dev

# Test webhook with sample data
curl -X POST http://localhost:3000/webhook/{route-id} \
  -H "Content-Type: application/json" \
  -d '{
    "form_response": {
      "answers": [
        {
          "field": {"type": "email"},
          "email": "test@example.com"
        }
      ]
    }
  }'
```

### Production Testing
```bash
# Health check
curl https://your-app.onrender.com/health

# Database connection test
curl https://your-app.onrender.com/api/setup/test
```

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Check DATABASE_URL format
   - Ensure database exists
   - Check firewall/security groups

2. **Google Sheets Permission Denied**
   - Share spreadsheet with service account email
   - Check GOOGLE_PRIVATE_KEY format (keep \n characters)

3. **Notion Database Not Found**
   - Check database ID
   - Ensure integration has access to database

4. **Email Sending Failed**
   - Use app-specific password for Gmail
   - Check SMTP settings
   - Verify email provider settings

### Logs
```bash
# View Render logs
# Go to Render Dashboard → Your Service → Logs

# Check specific errors
curl https://your-app.onrender.com/api/routes/{route-id}/logs?status=error
```

## Scaling Considerations

### Free Tier Limitations
- Render free tier spins down after 15 minutes of inactivity
- Cold start time ~30 seconds
- 750 hours/month limit

### Production Recommendations
- Use Render paid tier for always-on service
- Set up monitoring and alerting
- Implement request retries in form providers
- Consider database connection pooling for high traffic

### Performance Optimization
- Enable database connection pooling
- Implement caching for route configurations
- Set up CDN for static assets
- Monitor response times and error rates

## Security

### Best Practices
- Use strong JWT secrets
- Enable CORS for specific domains only
- Implement rate limiting
- Validate webhook signatures when available
- Use HTTPS only in production
- Regularly rotate API keys and passwords

### Environment Variables Security
- Never commit `.env` files
- Use Render's encrypted environment variables
- Rotate secrets regularly
- Limit database user permissions
