# Quick Start Script - Runs both backend and frontend
# Opens two PowerShell windows

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Squid Game - Quick Start" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

$scriptDir = $PSScriptRoot

Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptDir\build-backend.ps1"

Start-Sleep -Seconds 2

Write-Host "Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-File", "$scriptDir\start-frontend.ps1"

Write-Host ""
Write-Host "✓ Both servers are starting in separate windows" -ForegroundColor Green
Write-Host ""
Write-Host "Once both servers are running:" -ForegroundColor Yellow
Write-Host "  1. Backend: http://localhost:8080" -ForegroundColor White
Write-Host "  2. Frontend: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Open your browser to: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
