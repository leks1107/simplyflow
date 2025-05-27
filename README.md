# Typeform to Google Sheets Integrator

A Node.js application with Express that integrates Typeform with Google Sheets via webhooks. The application receives data from Typeform forms, validates them according to specific rules, and adds them to Google Sheets.

## 🎯 Core Logic

1. **Webhook reception**: The application accepts POST requests from Typeform at `/webhook`
2. **Data validation**: Checks for presence of email, city and interest in the request
3. **Duplicate check**: If email already exists in the sheet — skips the record
4. **City validation**: Only accepts records with city "New York"
5. **Add to sheet**: Upon successful validation adds row: Email, Timestamp (UTC), Interest

## 📋 Requirements

- Node.js (version 14 or higher)
- npm (Node Package Manager)
- Google Cloud account with access to Google Sheets API
- Typeform account with configured form

## 🚀 Installation and Setup

### 1. Clone repository

```bash
git clone <repository-url>
cd typeform-sheets-integrator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Google Sheets API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a service account:
   - Go to "IAM & Admin" → "Service Accounts"
   - Click "Create Service Account"
   - Fill in the data and create the account
   - Create a JSON key for the service account
5. Grant access to the service account for your Google Sheets spreadsheet:
   - Open the spreadsheet in Google Sheets
   - Click "Share" and add the service account email with "Editor" permissions

### 4. Environment variables setup

Create a `.env` file based on `.env.example`:

```bash
cp .env.example .env
```

Fill in the variables in `.env`:

```env
# Google Sheets Configuration
SPREADSHEET_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
GOOGLE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"

# Server Configuration
PORT=3000
NODE_ENV=production

# Optional: Sheet name (defaults to 'Sheet1')
SHEET_NAME=Sheet1
```

**Important**: 
- `SPREADSHEET_ID` can be found in the URL of your Google Sheets spreadsheet
- `GOOGLE_PRIVATE_KEY` must be in quotes and contain `\n` for line breaks

### 5. Run the application

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

The server will start on port 3000 (or the port from the PORT variable).

## 🔗 API Endpoints

### POST /webhook
Main endpoint for receiving webhooks from Typeform.

**Expected data structure from Typeform:**
```json
{
  "form_response": {
    "answers": [
      {
        "field": { "type": "email" },
        "email": "user@example.com"
      },
      {
        "field": { "ref": "city" },
        "text": "New York"
      },
      {
        "field": { "ref": "interest" },
        "text": "Web Development"
      }
    ]
  }
}
```

**Possible responses:**
- `201` - Data successfully added
- `400` - Data validation error
- `409` - Email already exists in the sheet
- `500` - Internal server error

### GET /health
Server health check.

### GET /webhook/health
Webhook service health check and Google Sheets connection.

## 🔧 Typeform Setup

1. Open your form in Typeform
2. Go to "Connect" → "Webhooks"
3. Add a new webhook with URL: `https://your-domain.com/webhook`
4. Make sure your form contains fields:
   - Email (type: Email)
   - City (type: Short text or Multiple choice)
   - Interest (type: Short text or Multiple choice)

## 📊 Google Sheets Structure

The application expects the following table structure:

| A (Email) | B (Timestamp) | C (Interest) |
|-----------|---------------|--------------|
| user@example.com | 2025-05-27T10:30:00.000Z | Web Development |

## 🐛 Logging

The application outputs detailed logs to the console:

- `✅ Added` - record successfully added
- `⚠️ Skipped: duplicate` - email already exists
- `⚠️ Skipped: city doesn't match` - city is not "New York"
- `❌ Error` - execution errors

## 🚢 Deployment

### Railway

1. Connect repository to Railway
2. Add environment variables in project settings
3. Railway will automatically deploy the application

### Render

1. Create a new Web Service on Render
2. Connect repository
3. Set startup command: `npm start`
4. Add environment variables

### Production environment variables setup:
- `SPREADSHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `NODE_ENV=production`
- `PORT` (usually set automatically)

## 📁 Project Structure

```
typeform-sheets-integrator/
├── src/
│   ├── app.js                 # Main application file
│   ├── controllers/
│   │   └── webhookController.js # Controller for handling webhooks
│   ├── services/
│   │   ├── googleSheetsService.js # Service for working with Google Sheets
│   │   └── validationService.js   # Data validation service
│   └── utils/
│       └── logger.js          # Logging utilities
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔍 Debugging

To enable debug logs set:
```env
NODE_ENV=development
```

This will add additional information about incoming data structure and validation process.

## 📝 License

MIT License. See LICENSE file for details.