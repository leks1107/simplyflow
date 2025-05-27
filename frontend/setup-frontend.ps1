# SimpFlow Frontend Setup Script
# Run this script after installing Node.js

Write-Host "SimpFlow Frontend Setup" -ForegroundColor Green
Write-Host "======================" -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
try {
    $npmVersion = npm --version
    Write-Host "npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "ERROR: npm is not available" -ForegroundColor Red
    exit 1
}

# Navigate to frontend directory
Set-Location -Path "c:\simplyflow\frontend"

# Install dependencies
Write-Host "`nInstalling dependencies..." -ForegroundColor Yellow
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "Failed to install dependencies" -ForegroundColor Red
    exit 1
}

# Check if backend is running
Write-Host "`nChecking backend connection..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 5
    Write-Host "Backend is running and accessible" -ForegroundColor Green
} catch {
    Write-Host "WARNING: Backend is not running or not accessible" -ForegroundColor Yellow
    Write-Host "Make sure to start the backend server before running the frontend" -ForegroundColor Yellow
}

Write-Host "`nSetup complete!" -ForegroundColor Green
Write-Host "To start the development server, run:" -ForegroundColor Yellow
Write-Host "npm run dev" -ForegroundColor Cyan
Write-Host "`nThe frontend will be available at http://localhost:3001" -ForegroundColor Yellow
