# SimpFlow Complete System Status Check
# This script checks the status of both backend and frontend components

Write-Host "SimpFlow System Status Check" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green

$ErrorActionPreference = "SilentlyContinue"

# Check Prerequisites
Write-Host "`n1. Prerequisites Check" -ForegroundColor Yellow
Write-Host "-----------------------" -ForegroundColor Yellow

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "✓ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Node.js: Not installed" -ForegroundColor Red
    $nodeInstalled = $false
}

# Check npm
try {
    $npmVersion = npm --version
    Write-Host "✓ npm: $npmVersion" -ForegroundColor Green
    $npmInstalled = $true
} catch {
    Write-Host "✗ npm: Not available" -ForegroundColor Red
    $npmInstalled = $false
}

# Check Backend
Write-Host "`n2. Backend Status" -ForegroundColor Yellow
Write-Host "------------------" -ForegroundColor Yellow

$backendPath = "c:\simplyflow\backend"
if (Test-Path $backendPath) {
    Write-Host "✓ Backend directory exists" -ForegroundColor Green
    
    # Check package.json
    $backendPackage = Join-Path $backendPath "package.json"
    if (Test-Path $backendPackage) {
        Write-Host "✓ Backend package.json exists" -ForegroundColor Green
        
        # Check node_modules
        $backendModules = Join-Path $backendPath "node_modules"
        if (Test-Path $backendModules) {
            Write-Host "✓ Backend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "⚠ Backend dependencies not installed" -ForegroundColor Yellow
            Write-Host "  Run: cd $backendPath; npm install" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ Backend package.json missing" -ForegroundColor Red
    }
    
    # Check if backend is running
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/api/health" -Method GET -TimeoutSec 3
        Write-Host "✓ Backend server is running and responding" -ForegroundColor Green
        Write-Host "  Health check: $($response.status)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠ Backend server is not running" -ForegroundColor Yellow
        Write-Host "  Start with: cd $backendPath; npm start" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ Backend directory missing" -ForegroundColor Red
}

# Check Frontend
Write-Host "`n3. Frontend Status" -ForegroundColor Yellow
Write-Host "-------------------" -ForegroundColor Yellow

$frontendPath = "c:\simplyflow\frontend"
if (Test-Path $frontendPath) {
    Write-Host "✓ Frontend directory exists" -ForegroundColor Green
    
    # Check package.json
    $frontendPackage = Join-Path $frontendPath "package.json"
    if (Test-Path $frontendPackage) {
        Write-Host "✓ Frontend package.json exists" -ForegroundColor Green
        
        # Check node_modules
        $frontendModules = Join-Path $frontendPath "node_modules"
        if (Test-Path $frontendModules) {
            Write-Host "✓ Frontend dependencies installed" -ForegroundColor Green
        } else {
            Write-Host "⚠ Frontend dependencies not installed" -ForegroundColor Yellow
            Write-Host "  Run: cd $frontendPath; npm install" -ForegroundColor Cyan
        }
    } else {
        Write-Host "✗ Frontend package.json missing" -ForegroundColor Red
    }
    
    # Check TypeScript config
    $tsConfig = Join-Path $frontendPath "tsconfig.json"
    if (Test-Path $tsConfig) {
        Write-Host "✓ TypeScript configuration exists" -ForegroundColor Green
    } else {
        Write-Host "⚠ TypeScript configuration missing" -ForegroundColor Yellow
    }
    
    # Check if frontend is running
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3001" -Method GET -TimeoutSec 3
        Write-Host "✓ Frontend server is running" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Frontend server is not running" -ForegroundColor Yellow
        Write-Host "  Start with: cd $frontendPath; npm run dev" -ForegroundColor Cyan
    }
} else {
    Write-Host "✗ Frontend directory missing" -ForegroundColor Red
}

# Check Project Files
Write-Host "`n4. Project Structure" -ForegroundColor Yellow
Write-Host "---------------------" -ForegroundColor Yellow

$projectFiles = @(
    "c:\simplyflow\README.md",
    "c:\simplyflow\backend\src\app.js",
    "c:\simplyflow\backend\src\server.js",
    "c:\simplyflow\frontend\src\app\page.tsx",
    "c:\simplyflow\frontend\src\components\ui\Button.tsx",
    "c:\simplyflow\frontend\src\utils\api.ts"
)

foreach ($file in $projectFiles) {
    if (Test-Path $file) {
        $relativePath = $file -replace "c:\\simplyflow\\", ""
        Write-Host "✓ $relativePath" -ForegroundColor Green
    } else {
        $relativePath = $file -replace "c:\\simplyflow\\", ""
        Write-Host "✗ $relativePath" -ForegroundColor Red
    }
}

# Summary and Next Steps
Write-Host "`n5. Summary & Next Steps" -ForegroundColor Yellow
Write-Host "------------------------" -ForegroundColor Yellow

if ($npmInstalled) {
    Write-Host "`nTo start the complete system:" -ForegroundColor Cyan
    Write-Host "1. Start Backend:" -ForegroundColor White
    Write-Host "   cd c:\simplyflow\backend" -ForegroundColor Gray
    Write-Host "   npm install  # if dependencies not installed" -ForegroundColor Gray
    Write-Host "   npm start" -ForegroundColor Gray
    
    Write-Host "`n2. Start Frontend (in new terminal):" -ForegroundColor White
    Write-Host "   cd c:\simplyflow\frontend" -ForegroundColor Gray
    Write-Host "   npm install  # if dependencies not installed" -ForegroundColor Gray
    Write-Host "   npm run dev" -ForegroundColor Gray
    
    Write-Host "`n3. Access the application:" -ForegroundColor White
    Write-Host "   Frontend: http://localhost:3001" -ForegroundColor Gray
    Write-Host "   Backend API: http://localhost:3000/api" -ForegroundColor Gray
} else {
    Write-Host "`nFirst install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Then run this script again." -ForegroundColor Red
}

Write-Host "`n✨ SimpFlow Status Check Complete!" -ForegroundColor Green
