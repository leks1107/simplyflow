# Установка Node.js и запуск приложения

## Установка Node.js

### Windows:

1. **Скачайте Node.js:**
   - Перейдите на https://nodejs.org/
   - Скачайте LTS версию (рекомендуемую)
   - Запустите установщик и следуйте инструкциям

2. **Проверьте установку:**
   ```powershell
   node --version
   npm --version
   ```

### Альтернативный способ через Chocolatey:
```powershell
# Установите Chocolatey (если не установлен)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Установите Node.js
choco install nodejs
```

## Запуск приложения

После установки Node.js:

```powershell
# Перейдите в папку проекта
cd c:\Users\alexe\typeform-sheets-integrator

# Установите зависимости
npm install

# Создайте .env файл (скопируйте из .env.example и заполните)
copy .env.example .env

# Запустите приложение
npm start
```

## Тестирование

### Проверка здоровья сервера:
```powershell
# В новом окне PowerShell
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

### Тест webhook:
```powershell
# Пример POST запроса для тестирования
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
            },
            @{
                field = @{ ref = "interest" }
                text = "Web Development"
            }
        )
    }
} | ConvertTo-Json -Depth 10

Invoke-RestMethod -Uri "http://localhost:3000/webhook" -Method POST -Body $body -ContentType "application/json"
```
