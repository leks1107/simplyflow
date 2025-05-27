# SimpFlow Backend Testing Guide

This guide helps you test the 4 major backend improvements implemented in SimpFlow.

## Prerequisites

1. **Node.js installed** (version 14 or higher)
2. **PostgreSQL database** set up and accessible
3. **Environment variables** configured in `.env` file
4. **Dependencies installed**: `npm install`

## Quick Test Setup

### 1. Apply Database Migration
```bash
# Run the database migration to add required columns
npm run migrate
```

### 2. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Or production mode
npm start
```

### 3. Run Automated Tests
```bash
# Run comprehensive test suite
npm test

# Or manual PowerShell webhook test
npm run test:webhook
```

## Manual Testing

### Test 1: Route Validation

#### Create Valid Route
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Valid Google Sheets Route",
    "source": "typeform", 
    "target": "sheets",
    "credentials": {
      "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
      "sheetName": "Sheet1"
    },
    "requiredFields": ["email", "city"],
    "filters": [
      {"field": "city", "op": "equals", "value": "New York"}
    ]
  }'
```

**Expected Result**: 201 Created with route details

#### Create Invalid Route (Missing spreadsheetId)
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Invalid Sheets Route",
    "source": "typeform",
    "target": "sheets", 
    "credentials": {
      "sheetName": "Sheet1"
    }
  }'
```

**Expected Result**: 400 Bad Request with validation error about missing spreadsheetId

### Test 2: Rate Limiting

#### Rapid Fire Test
```bash
# Get route ID from previous test, then send 6 rapid requests
ROUTE_ID="your-route-id-here"

for i in {1..6}; do
  curl -X POST http://localhost:3000/api/trigger/$ROUTE_ID \
    -H "Content-Type: application/json" \
    -d '{
      "form_response": {
        "answers": [
          {"field": {"type": "email"}, "email": "test@example.com"},
          {"field": {"ref": "city"}, "text": "New York"}
        ]
      }
    }' &
done
wait
```

**Expected Result**: At least 1-2 requests should return 429 Too Many Requests

### Test 3: Required Fields Validation

#### Test Missing Required Field
```bash
curl -X POST http://localhost:3000/api/trigger/$ROUTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "form_response": {
      "answers": [
        {"field": {"type": "email"}, "email": "test@example.com"}
      ]
    }
  }'
```

**Expected Result**: 200 OK with `{"success": false, "reason": "missing_fields", "missing_fields": ["city"]}`

### Test 4: Route Status

#### Create Inactive Route
```bash
curl -X POST http://localhost:3000/api/routes \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Inactive Route",
    "source": "typeform",
    "target": "sheets",
    "status": "inactive",
    "credentials": {
      "spreadsheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms", 
      "sheetName": "Sheet1"
    }
  }'
```

#### Test Inactive Route Trigger
```bash
INACTIVE_ROUTE_ID="inactive-route-id-here"

curl -X POST http://localhost:3000/api/trigger/$INACTIVE_ROUTE_ID \
  -H "Content-Type: application/json" \
  -d '{
    "form_response": {
      "answers": [
        {"field": {"type": "email"}, "email": "test@example.com"},
        {"field": {"ref": "city"}, "text": "New York"}
      ]
    }
  }'
```

**Expected Result**: 200 OK with `{"success": false, "reason": "route_inactive"}`

## PowerShell Testing (Windows)

For Windows users, you can use PowerShell instead of curl:

### Rate Limiting Test
```powershell
# Set route ID
$routeId = "your-route-id-here"
$uri = "http://localhost:3000/api/trigger/$routeId"

$body = @{
    form_response = @{
        answers = @(
            @{
                field = @{ type = "email" }
                email = "test@example.com"
            },
            @{
                field = @{ ref = "city" }
                text = "New York"
            }
        )
    }
} | ConvertTo-Json -Depth 5

# Send 6 rapid requests
1..6 | ForEach-Object {
    try {
        $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"
        Write-Host "Request $_`: $($response.success)"
    } catch {
        Write-Host "Request $_`: Rate limited (429)" -ForegroundColor Red
    }
}
```

## Verification Checklist

After running tests, verify the following:

### ✅ Route Validation
- [ ] Invalid Google Sheets routes rejected (missing spreadsheetId/sheetName)
- [ ] Invalid Notion routes rejected (missing notionDbId/token) 
- [ ] Invalid Email routes rejected (missing email/time or invalid email format)
- [ ] Invalid filters rejected (missing field/op/value)

### ✅ Rate Limiting  
- [ ] 6+ rapid requests result in 429 responses
- [ ] Rate limit cache cleans up after time window
- [ ] Retry-After header present in 429 responses
- [ ] Different routes have independent rate limits

### ✅ Required Fields
- [ ] Routes with required fields reject incomplete data
- [ ] Missing field names properly identified in response
- [ ] Routes without required fields accept any data
- [ ] Error logged with specific missing field names

### ✅ Route Status
- [ ] Inactive routes reject all webhook attempts
- [ ] Active routes process normally
- [ ] Legacy is_active field still supported
- [ ] Proper JSON response for inactive routes

## Troubleshooting

### Common Issues

1. **Node.js not found**: Install Node.js or add to PATH
2. **Database connection error**: Check PostgreSQL is running and DATABASE_URL is correct
3. **Migration fails**: Ensure database user has CREATE TABLE permissions
4. **Rate limits not working**: Check server restart and cache cleanup

### Log Analysis

Check server logs for:
- `rate_limited` status entries
- `skipped` status with `missing_fields` reason  
- `skipped` status with `route_inactive` reason
- Validation error messages during route creation

### Manual Database Check

```sql
-- Check if migrations applied
SELECT * FROM migrations;

-- Check new columns exist
\d routes
\d route_config

-- Check route status values
SELECT id, name, status, is_active FROM routes;

-- Check required fields configuration
SELECT route_id, required_fields FROM route_config WHERE required_fields IS NOT NULL;
```

## Performance Testing

For production readiness, test with higher loads:

```bash
# Install Apache Bench
sudo apt-get install apache2-utils  # Ubuntu/Debian
brew install httpie                   # macOS

# Load test (100 requests, 10 concurrent)
ab -n 100 -c 10 -H "Content-Type: application/json" \
   -p webhook-payload.json \
   http://localhost:3000/api/trigger/your-route-id
```

## Next Steps

After successful testing:

1. **Deploy to staging environment**
2. **Run tests against staging**
3. **Update production database with migration**
4. **Deploy to production**
5. **Monitor logs for any issues**

## Support

If tests fail or you encounter issues:

1. Check server logs for detailed error messages
2. Verify all environment variables are set correctly
3. Ensure database schema is up to date with migrations
4. Test individual components (database connection, Google Sheets API, etc.)

For additional help, refer to:
- `README.md` - Setup and configuration
- `API.md` - Complete API documentation  
- `DEPLOYMENT.md` - Deployment instructions
