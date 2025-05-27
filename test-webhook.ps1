# Test script for Typeform webhook
# This script tests the webhook endpoint with sample data

$testData = @{
    form_response = @{
        answers = @(
            @{
                field = @{ 
                    type = "email"
                    ref = "email"
                }
                email = "test@example.com"
            },
            @{
                field = @{ 
                    type = "short_text"
                    ref = "city"
                }
                text = "New York"
            },
            @{
                field = @{ 
                    type = "short_text"
                    ref = "interest"
                }
                text = "Web Development"
            }
        )
    }
}

$body = $testData | ConvertTo-Json -Depth 10
$uri = "http://localhost:3000/webhook"

Write-Host "Testing webhook endpoint: $uri" -ForegroundColor Yellow
Write-Host "Test data:" -ForegroundColor Green
Write-Host $body -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod -Uri $uri -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Success!" -ForegroundColor Green
    Write-Host ($response | ConvertTo-Json -Depth 10) -ForegroundColor Green
} catch {
    Write-Host "❌ Error:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response body:" -ForegroundColor Yellow
        Write-Host $responseBody -ForegroundColor Yellow
    }
}

# Test health endpoint
Write-Host "`nTesting health endpoint..." -ForegroundColor Yellow
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
    Write-Host "✅ Health check passed!" -ForegroundColor Green
    Write-Host ($healthResponse | ConvertTo-Json) -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}
