# Start Frontend Server Script for Windows (PowerShell)
# This script starts a simple HTTP server to serve the frontend

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Squid Game - Frontend Server" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to frontend directory
Set-Location "$PSScriptRoot\..\frontend"

# Check for Python
$pythonExists = Get-Command python -ErrorAction SilentlyContinue

if ($pythonExists) {
    $pythonVersion = python --version 2>&1
    Write-Host "Found: $pythonVersion" -ForegroundColor Green
    Write-Host ""
    Write-Host "Starting HTTP server on port 3000..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🎮 Open your browser and navigate to:" -ForegroundColor Green
    Write-Host "   http://localhost:3000" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Make sure the backend server is also running!" -ForegroundColor Yellow
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    Write-Host ""
    
    # Start Python HTTP server
    python -m http.server 3000
}
else {
    Write-Host "✗ Python not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Alternative: Open index.html directly in your browser" -ForegroundColor Yellow
    Write-Host "Note: Backend communication may not work with file:// protocol" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To install Python:" -ForegroundColor Yellow
    Write-Host "  Download from https://www.python.org/" -ForegroundColor White
    Write-Host "  Or use Microsoft Store (search for Python)" -ForegroundColor White
    Write-Host ""
    
    # Ask if user wants to open index.html directly
    $response = Read-Host "Do you want to open index.html in your default browser? (y/n)"
    if ($response -eq 'y' -or $response -eq 'Y') {
        Start-Process "index.html"
    }
}
