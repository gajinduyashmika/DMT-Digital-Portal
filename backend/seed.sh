# PowerShell script to seed vehicle makes database
Write-Host "Seeding vehicle makes database..." -ForegroundColor Green

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5000/api/vehicle-makes/seed" -Method POST -ContentType "application/json"
    
    if ($response.StatusCode -eq 200) {
        Write-Host "✓ Database seeded successfully!" -ForegroundColor Green
        Write-Host $response.Content
    } else {
        Write-Host "✗ Error seeding database" -ForegroundColor Red
        Write-Host $response.Content
    }
} catch {
    Write-Host "✗ Error: $_" -ForegroundColor Red
    Write-Host "Make sure the backend server is running on http://localhost:5000" -ForegroundColor Yellow
}
