$ErrorActionPreference = "Stop"

$titles = @("Ethos Gate API", "Ethos Gate Demo")

foreach ($title in $titles) {
  Write-Host "Closing $title..." -ForegroundColor Yellow
  Get-Process -Name powershell -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -like "*$title*" } |
    ForEach-Object { $_.CloseMainWindow() | Out-Null }
}

Start-Sleep -Milliseconds 600

foreach ($title in $titles) {
  Get-Process -Name powershell -ErrorAction SilentlyContinue |
    Where-Object { $_.MainWindowTitle -like "*$title*" } |
    Stop-Process -Force -ErrorAction SilentlyContinue
}

Write-Host "Stop complete." -ForegroundColor Green
