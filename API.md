# API Documentation

## Endpoints

### GET /health
Server health check.

**Response:**
```json
{
  "status": "OK",
  "message": "Typeform to Google Sheets Integrator is running",
  "timestamp": "2025-05-27T08:30:00.000Z",
  "version": "1.0.0"
}
```

### GET /webhook/health
Webhook service health check and Google Sheets connection.

**Response (Success):**
```json
{
  "status": "healthy",
  "message": "Webhook service is operational",
  "timestamp": "2025-05-27T08:30:00.000Z",
  "services": {
    "googleSheets": "connected"
  }
}
```

**Response (Error):**
```json
{
  "status": "unhealthy",
  "message": "Service unavailable",
  "error": "Failed to connect to Google Sheets",
  "timestamp": "2025-05-27T08:30:00.000Z"
}
```

### POST /webhook
Main endpoint for receiving webhooks from Typeform.

**Request Body (Typeform Format):**
```json
{
  "event_id": "01G0JDMC2KJX3VYG85YA6KXQEH",
  "event_type": "form_response",
  "form_response": {
    "form_id": "lT4Z3j",
    "token": "a3a12ec67a1365927098a606107fbc15",
    "landed_at": "2025-05-27T08:30:00Z",
    "submitted_at": "2025-05-27T08:30:12Z",
    "answers": [
      {
        "field": {
          "id": "4oMGzjc9q9rJ",
          "type": "email",
          "ref": "email_question"
        },
        "type": "email",
        "email": "user@example.com"
      },
      {
        "field": {
          "id": "gFFf3xAkJKsr",
          "type": "short_text",
          "ref": "city_question"
        },
        "type": "text",
        "text": "New York"
      },
      {
        "field": {
          "id": "k6TP9oLGgHjl",
          "type": "short_text",
          "ref": "interest_question"
        },
        "type": "text",
        "text": "Web Development"
      }
    ]
  }
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Data successfully added to Google Sheets",
  "data": {
    "email": "user@example.com",
    "timestamp": "2025-05-27T08:30:12.456Z",
    "interest": "Web Development",
    "city": "New York"
  },
  "processingTime": "245ms"
}
```

**Response (Duplicate Email - 409):**
```json
{
  "success": false,
  "message": "Email already exists in the sheet",
  "email": "user@example.com"
}
```

**Response (Invalid City - 400):**
```json
{
  "success": false,
  "message": "City validation failed: \"London\" is not \"New York\"",
  "data": {
    "email": "user@example.com",
    "city": "London",
    "interest": "Web Development"
  }
}
```

**Response (Missing Fields - 400):**
```json
{
  "success": false,
  "message": "Validation failed: Valid email is required, City is required",
  "data": {
    "email": "",
    "city": "",
    "interest": "Web Development"
  }
}
```

**Response (Server Error - 500):**
```json
{
  "success": false,
  "message": "Internal server error while processing webhook",
  "error": "Failed to connect to Google Sheets API",
  "processingTime": "1234ms"
}
```

## Validation Rules

1. **Required Fields:**
   - `email` - must be a valid email address
   - `city` - must be a non-empty string
   - `interest` - must be a non-empty string

2. **City Validation:**
   - Only accepts records with city "New York" (case insensitive)

3. **Duplicate Check:**
   - Email is checked for uniqueness in the first column of Google Sheets
   - Comparison is case insensitive

## Rate Limiting

- Maximum 60 requests per minute from one IP address
- When limit is exceeded, status 429 is returned

**Response (Rate Limit - 429):**
```json
{
  "success": false,
  "error": "Too many requests",
  "retryAfter": 60,
  "timestamp": "2025-05-27T08:30:00.000Z"
}
```

## Error Handling

All errors are returned in a unified format:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-05-27T08:30:00.000Z"
}
```

In development mode, additional fields may be included for debugging:
- `stack` - error stack trace
- `details` - additional error information

## Google Sheets Integration

### Sheet Structure
Data is added to the spreadsheet in the following format:

| Column A (Email) | Column B (Timestamp) | Column C (Interest) |
|------------------|---------------------|---------------------|
| user@example.com | 2025-05-27T08:30:12.456Z | Web Development |

### Permissions
Service account must have "Editor" permissions on the Google Sheets document.

### API Quotas
- Google Sheets API has limits: 100 requests per 100 seconds per user
- In case of quota exceeding, the service will automatically retry the request
