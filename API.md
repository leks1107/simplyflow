# API Documentation

## Endpoints

### GET /health
Проверка состояния сервера.

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
Проверка состояния webhook сервиса и подключения к Google Sheets.

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
Основной endpoint для получения webhooks от Typeform.

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
   - `email` - должен быть валидным email адресом
   - `city` - должен быть непустой строкой
   - `interest` - должен быть непустой строкой

2. **City Validation:**
   - Принимаются только записи с городом "New York" (регистр не важен)

3. **Duplicate Check:**
   - Email проверяется на уникальность в первой колонке Google Sheets
   - Сравнение без учета регистра

## Rate Limiting

- Максимум 60 запросов в минуту с одного IP адреса
- При превышении лимита возвращается статус 429

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

Все ошибки возвращаются в едином формате:

```json
{
  "success": false,
  "error": "Error message",
  "timestamp": "2025-05-27T08:30:00.000Z"
}
```

В development режиме могут включаться дополнительные поля для отладки:
- `stack` - stack trace ошибки
- `details` - дополнительная информация об ошибке

## Google Sheets Integration

### Sheet Structure
Данные добавляются в таблицу в следующем формате:

| Column A (Email) | Column B (Timestamp) | Column C (Interest) |
|------------------|---------------------|---------------------|
| user@example.com | 2025-05-27T08:30:12.456Z | Web Development |

### Permissions
Сервисный аккаунт должен иметь права "Editor" на Google Sheets документ.

### API Quotas
- Google Sheets API имеет лимиты: 100 запросов в 100 секунд на пользователя
- В случае превышения лимитов сервис автоматически попытается повторить запрос
