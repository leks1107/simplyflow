# Node.js Installation and Application Setup

## Node.js Installation

### Windows:

1. **Download Node.js:**
   - Go to https://nodejs.org/
   - Download the LTS version (recommended)
   - Run the installer and follow the instructions

2. **Verify installation:**
   ```powershell
   node --version
   npm --version
   ```

### Alternative method using Chocolatey:
```powershell
# Install Chocolatey (if not installed)
Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))

# Install Node.js
choco install nodejs
```

## Running the Application

After installing Node.js:

```powershell
# Navigate to the project folder
cd c:\Users\alexe\typeform-sheets-integrator

# Install dependencies
npm install

# Create .env file (copy from .env.example and fill in)
copy .env.example .env

# Run the application
npm start
```

## Testing

### Server health check:
```powershell
# In a new PowerShell window
Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
```

### Webhook test:
```powershell
# Example POST request for testing
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
