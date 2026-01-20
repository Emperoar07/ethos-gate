$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Starting Ethos Gate API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\\packages\\api`"; deno task dev"

Write-Host "Starting Ethos Gate SDK watcher..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\\packages\\sdk`"; pnpm dev"

Write-Host "Starting Ethos Gate Demo..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd `"$root\\packages\\demo`"; pnpm dev"

Write-Host "Done. API: http://localhost:8000 | Demo: http://localhost:5173" -ForegroundColor Green
