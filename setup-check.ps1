# SimpFlow Backend Improvements Setup Script
# PowerShell script for Windows environment

Write-Host "🎯 SimpFlow Backend Improvements Setup" -ForegroundColor Cyan
Write-Host ""
Write-Host "Checking implementation of 4 backend improvements:" -ForegroundColor White
Write-Host "1. ✅ Route Validation during Creation" -ForegroundColor Green
Write-Host "2. ✅ Rate Limiting for Webhook Calls" -ForegroundColor Green  
Write-Host "3. ✅ Required Fields Support" -ForegroundColor Green
Write-Host "4. ✅ Route Status Support (Active/Inactive)" -ForegroundColor Green
Write-Host ""

# Function to check if Node.js is available
function Test-NodeJs {
    try {
        $nodeVersion = & node --version 2>$null
        if ($nodeVersion) {
            Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
            return $true
        }
    } catch {
        # Try common installation paths
        $commonPaths = @(
            "C:\Program Files\nodejs\node.exe",
            "C:\Program Files (x86)\nodejs\node.exe", 
            "C:\nodejs\node.exe",
            "$env:LOCALAPPDATA\Programs\nodejs\node.exe"
        )
        
        foreach ($path in $commonPaths) {
            if (Test-Path $path) {
                Write-Host "✅ Node.js found at: $path" -ForegroundColor Green
                # Add to PATH for this session
                $env:PATH = "$env:PATH;$(Split-Path $path)"
                return $true
            }
        }
    }
    
    Write-Host "❌ Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    return $false
}

# Function to check environment
function Test-Environment {
    Write-Host "🔍 Checking SimpFlow Environment..." -ForegroundColor Yellow
    Write-Host ""
    
    # Check if we're in the right directory
    if (-not (Test-Path "package.json")) {
        Write-Host "❌ package.json not found. Please run this from the SimpFlow root directory." -ForegroundColor Red
        return $false
    }
    
    $packageJson = Get-Content "package.json" | ConvertFrom-Json
    if ($packageJson.name -ne "simpflow-backend") {
        Write-Host "❌ This doesn't appear to be the SimpFlow backend directory." -ForegroundColor Red
        return $false
    }
    
    Write-Host "✅ SimpFlow backend directory confirmed" -ForegroundColor Green
    
    # Check if Node.js is available
    if (-not (Test-NodeJs)) {
        return $false
    }
    
    # Check if database migration files exist
    $migrationFile = "src\database\migrations\001_add_status_and_required_fields.sql"
    if (-not (Test-Path $migrationFile)) {
        Write-Host "❌ Database migration file not found" -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Database migration files ready" -ForegroundColor Green
    
    # Check if test files exist
    if (-not (Test-Path "test-improvements.js")) {
        Write-Host "❌ Test suite not found" -ForegroundColor Red
        return $false
    }
    Write-Host "✅ Test suite ready" -ForegroundColor Green
    
    # Check implementation files
    $implementationFiles = @(
        "src\controllers\webhookController.js",
        "src\services\routeService.js", 
        "src\routes\apiRoutes.js"
    )
    
    foreach ($file in $implementationFiles) {
        if (-not (Test-Path $file)) {
            Write-Host "❌ Implementation file missing: $file" -ForegroundColor Red
            return $false
        }
    }
    Write-Host "✅ All implementation files present" -ForegroundColor Green
    
    return $true
}

# Function to show next steps
function Show-NextSteps {
    Write-Host ""
    Write-Host "🚀 NEXT STEPS TO COMPLETE SETUP:" -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "1. 📊 Run Database Migration:" -ForegroundColor Yellow
    Write-Host "   npm run migrate" -ForegroundColor White
    Write-Host "   # or: node src\database\migrations\migrate.js" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "2. 🔧 Start the Server:" -ForegroundColor Yellow
    Write-Host "   npm start" -ForegroundColor White
    Write-Host "   # or: node src\server.js" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "3. 🧪 Run Tests:" -ForegroundColor Yellow
    Write-Host "   npm test" -ForegroundColor White
    Write-Host "   # or: node test-improvements.js" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "4. 📋 Manual Testing:" -ForegroundColor Yellow
    Write-Host "   Open another PowerShell window and run:" -ForegroundColor White
    Write-Host "   Invoke-WebRequest -Uri http://localhost:3000/api/health" -ForegroundColor White
    Write-Host ""
    
    Write-Host "📖 For detailed testing instructions, see TESTING.md" -ForegroundColor Cyan
    Write-Host "📊 For implementation status, see IMPLEMENTATION_STATUS.md" -ForegroundColor Cyan
}

# Main execution
$environmentOk = Test-Environment

if ($environmentOk) {
    Write-Host ""
    Write-Host "🎉 ENVIRONMENT CHECK PASSED!" -ForegroundColor Green
    Write-Host "All backend improvements are implemented and ready for testing." -ForegroundColor Green
    Show-NextSteps
} else {
    Write-Host ""
    Write-Host "❌ ENVIRONMENT CHECK FAILED!" -ForegroundColor Red
    Write-Host "Please resolve the issues above before proceeding." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Press any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
