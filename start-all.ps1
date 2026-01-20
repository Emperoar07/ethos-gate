$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Ethos Gate API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\\packages\\api`"; deno task dev"

Write-Host "Starting Ethos Gate Demo..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\\packages\\demo`"; npm run dev"

Write-Host "Done. API: http://localhost:8000 | Demo: http://localhost:5173" -ForegroundColor Green
