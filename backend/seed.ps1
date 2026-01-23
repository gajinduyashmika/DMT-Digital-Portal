# PowerShell script to seed vehicle makes database
# Run this after starting the backend server

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "Vehicle Makes Database Seeder" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

Write-Host "⏳ Waiting for backend server to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

try {
    Write-Host "🌱 Seeding vehicle makes database..." -ForegroundColor Green
    
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/vehicle-makes/seed" `
        -Method POST `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $content = $response.Content | ConvertFrom-Json
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ SUCCESS: Database seeded successfully!" -ForegroundColor Green
        Write-Host "📊 Message: $($content.message)" -ForegroundColor Green
        if ($content.count) {
            Write-Host "📈 Vehicles Added: $($content.count) makes" -ForegroundColor Green
        }
    } elseif ($response.StatusCode -eq 400) {
        Write-Host "ℹ️  INFO: $($content.message)" -ForegroundColor Cyan
        Write-Host "   (Database was already seeded)" -ForegroundColor Cyan
    }
} catch [System.Net.WebException] {
    if ($_.Exception.Response.StatusCode -eq 400) {
        Write-Host "ℹ️  INFO: Database already seeded" -ForegroundColor Cyan
    } else {
        Write-Host "❌ ERROR: Failed to connect to backend server" -ForegroundColor Red
        Write-Host "   Make sure the backend is running on http://localhost:5000" -ForegroundColor Yellow
        Write-Host "   Command: cd backend && npm run dev" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ ERROR: $_" -ForegroundColor Red
    Write-Host "   Make sure the backend is running on http://localhost:5000" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "✨ Vehicle Database Ready!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
