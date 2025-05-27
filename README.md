# Typeform to Google Sheets Integrator

Node.js приложение с Express, которое интегрирует Typeform с Google Sheets через webhooks. Приложение получает данные из форм Typeform, проверяет их по определённым правилам и добавляет в Google Sheets.

## 🎯 Основная логика

1. **Прием webhook**: Приложение принимает POST-запросы от Typeform на `/webhook`
2. **Валидация данных**: Проверяет наличие email, city и interest в запросе
3. **Проверка дубликатов**: Если email уже есть в таблице — пропускает запись
4. **Валидация города**: Принимает только записи с городом "New York"
5. **Добавление в таблицу**: При успешной валидации добавляет строку: Email, Timestamp (UTC), Interest

## 📋 Требования

- Node.js (версия 14 или выше)
- npm (Node Package Manager)
- Google Cloud аккаунт с доступом к Google Sheets API
- Typeform аккаунт с настроенной формой

## 🚀 Установка и настройка

### 1. Клонирование репозитория

```bash
git clone <repository-url>
cd typeform-sheets-integrator
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка Google Sheets API

1. Перейдите в [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий
3. Включите Google Sheets API
4. Создайте сервисный аккаунт:
   - Перейдите в "IAM & Admin" → "Service Accounts"
   - Нажмите "Create Service Account"
   - Заполните данные и создайте аккаунт
   - Создайте JSON ключ для сервисного аккаунта
5. Предоставьте доступ сервисному аккаунту к вашей Google Sheets таблице:
   - Откройте таблицу в Google Sheets
   - Нажмите "Share" и добавьте email сервисного аккаунта с правами "Editor"

### 4. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Заполните переменные в `.env`:

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

**Важно**: 
- `SPREADSHEET_ID` можно найти в URL вашей Google Sheets таблицы
- `GOOGLE_PRIVATE_KEY` должен быть в кавычках и содержать `\n` для переносов строк

### 5. Запуск приложения

```bash
# Production
npm start

# Development (с автоперезагрузкой)
npm run dev
```

Сервер запустится на порту 3000 (или на порту из переменной PORT).

## 🔗 API Endpoints

### POST /webhook
Основной endpoint для получения webhooks от Typeform.

**Ожидаемая структура данных от Typeform:**
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

**Возможные ответы:**
- `201` - Данные успешно добавлены
- `400` - Ошибка валидации данных
- `409` - Email уже существует в таблице
- `500` - Внутренняя ошибка сервера

### GET /health
Проверка состояния сервера.

### GET /webhook/health
Проверка состояния webhook сервиса и подключения к Google Sheets.

## 🔧 Настройка Typeform

1. Откройте вашу форму в Typeform
2. Перейдите в "Connect" → "Webhooks"
3. Добавьте новый webhook с URL: `https://your-domain.com/webhook`
4. Убедитесь, что ваша форма содержит поля:
   - Email (тип: Email)
   - City/Город (тип: Short text или Multiple choice)
   - Interest/Интерес (тип: Short text или Multiple choice)

## 📊 Структура Google Sheets

Приложение ожидает следующую структуру таблицы:

| A (Email) | B (Timestamp) | C (Interest) |
|-----------|---------------|--------------|
| user@example.com | 2025-05-27T10:30:00.000Z | Web Development |

## 🐛 Логирование

Приложение выводит подробные логи в консоль:

- `✅ Добавлено` - запись успешно добавлена
- `⚠️ Пропущено: дубликат` - email уже существует
- `⚠️ Пропущено: город не подходит` - город не "New York"
- `❌ Error` - ошибки выполнения

## 🚢 Деплой

### Railway

1. Подключите репозиторий к Railway
2. Добавьте переменные окружения в настройках проекта
3. Railway автоматически развернет приложение

### Render

1. Создайте новый Web Service на Render
2. Подключите репозиторий
3. Установите команду запуска: `npm start`
4. Добавьте переменные окружения

### Настройка переменных для продакшена:
- `SPREADSHEET_ID`
- `GOOGLE_CLIENT_EMAIL`
- `GOOGLE_PRIVATE_KEY`
- `NODE_ENV=production`
- `PORT` (обычно устанавливается автоматически)

## 📁 Структура проекта

```
typeform-sheets-integrator/
├── src/
│   ├── app.js                 # Основной файл приложения
│   ├── controllers/
│   │   └── webhookController.js # Контроллер для обработки webhooks
│   ├── services/
│   │   ├── googleSheetsService.js # Сервис для работы с Google Sheets
│   │   └── validationService.js   # Сервис валидации данных
│   └── utils/
│       └── logger.js          # Утилиты для логирования
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## 🔍 Отладка

Для включения debug-логов установите:
```env
NODE_ENV=development
```

Это добавит дополнительную информацию о структуре входящих данных и процессе валидации.

## 📝 Лицензия

MIT License. См. файл LICENSE для подробностей.