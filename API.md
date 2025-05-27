# API Documentation

## Recent Backend Improvements (2025-05-27)

SimpFlow now includes 4 major backend improvements for enhanced reliability and stability:

### 1. Route Validation
- **Target-specific validation**: Validates required credentials for each target type
  - Google Sheets: requires `spreadsheetId` and `sheetName`
  - Notion: requires `notionDbId` and `token`
  - Email Digest: requires `email` and `time` with email format validation
- **Filter validation**: Validates filter structure (`field`, `op`, `value`)
- **Required fields support**: Validates `requiredFields` parameter during route creation

### 2. Rate Limiting
- **Per-route rate limiting**: Maximum 5 requests per second per route
- **429 response**: Returns "Too Many Requests" with retry-after header
- **Automatic cleanup**: Rate limit cache cleaned every 60 seconds
- **Comprehensive logging**: Rate-limited requests logged with status 'rate_limited'

### 3. Required Fields Validation
- **Runtime validation**: Checks if mandatory fields are present in webhook data
- **Configurable per route**: Set `requiredFields` array when creating routes
- **Graceful handling**: Returns status 'skipped' with reason 'missing_fields'
- **Detailed logging**: Missing field names logged for debugging

### 4. Route Status Management
- **Active/Inactive routes**: Support for route status (active, inactive, draft, archived)
- **Backward compatibility**: Maintains support for legacy `is_active` field
- **Proper responses**: Returns JSON with reason 'route_inactive' for inactive routes
- **Status logging**: Inactive route attempts logged as 'skipped'

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

### POST /api/routes
Create a new webhook route with validation.

**Request Body:**
```json
{
  "name": "My Typeform to Sheets Route",
  "source": "typeform",
  "target": "sheets",
  "status": "active",
  "credentials": {
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "sheetName": "Sheet1"
  },
  "filters": [
    {
      "field": "city",
      "op": "equals",
      "value": "New York"
    }
  ],
  "requiredFields": ["email", "city"],
  "duplicateCheckField": "email"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "route": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "My Typeform to Sheets Route",
    "source": "typeform",
    "target": "sheets",
    "status": "active",
    "webhook_url": "https://your-domain.com/api/trigger/550e8400-e29b-41d4-a716-446655440000",
    "created_at": "2025-05-27T08:30:00.000Z"
  }
}
```

**Response (Validation Error - 400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": {
    "target": "Google Sheets target requires spreadsheetId and sheetName",
    "filters": "Filter at index 0 is missing required 'op' field"
  }
}
```

### POST /api/trigger/:routeId
Trigger a webhook for a specific route (replaces legacy /webhook endpoint).

**Path Parameters:**
- `routeId` - UUID of the route to trigger

**Request Body:** Same as POST /webhook (webhook payload from form provider)

**Response (Success - 200):**
```json
{
  "success": true,
  "route_id": "550e8400-e29b-41d4-a716-446655440000",
  "result": {
    "target": "google_sheets",
    "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
    "rowsAdded": 1
  }
}
```

**Response (Rate Limited - 429):**
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded: maximum 5 requests per second per route",
  "retryAfter": 1
}
```

**Response (Missing Required Fields - 200):**
```json
{
  "success": false,
  "reason": "missing_fields",
  "missing_fields": ["email", "city"]
}
```

**Response (Route Inactive - 200):**
```json
{
  "success": false,
  "reason": "route_inactive"
}
```

**Response (Duplicate Found - 200):**
```json
{
  "success": false,
  "reason": "duplicate",
  "duplicate_field": "email"
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

SimpFlow implements two levels of rate limiting:

### 1. Per-Route Rate Limiting (NEW)
- **Limit**: Maximum 5 requests per second per route
- **Scope**: Applied per individual webhook route
- **Response**: 429 status with retry-after header
- **Cache**: Automatic cleanup every 60 seconds

### 2. Global Rate Limiting
- **Limit**: Maximum 60 requests per minute from one IP address
- **Scope**: Applied globally across all endpoints
- **Response**: 429 status with retry-after header

**Response (Per-Route Rate Limit - 429):**
```json
{
  "success": false,
  "error": "Too Many Requests",
  "message": "Rate limit exceeded: maximum 5 requests per second per route",
  "retryAfter": 1
}
```

**Response (Global Rate Limit - 429):**
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
