# Build and Run Script for Windows (PowerShell)
# This script compiles the C++ backend and starts the server

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Squid Game - Backend Build Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend directory
Set-Location "$PSScriptRoot\..\backend"

# Check if g++ is available
$gppExists = Get-Command g++ -ErrorAction SilentlyContinue
$clExists = Get-Command cl -ErrorAction SilentlyContinue

if ($gppExists) {
    Write-Host "Compiling backend.cpp with g++..." -ForegroundColor Yellow
    g++ backend.cpp -o backend.exe -lws2_32 -std=c++11
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Compilation successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting backend server..." -ForegroundColor Yellow
        Write-Host "Server will run on http://localhost:8080" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        .\backend.exe
    } else {
        Write-Host "✗ Compilation failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Red
        exit 1
    }
}
elseif ($clExists) {
    Write-Host "Compiling backend.cpp with MSVC (cl)..." -ForegroundColor Yellow
    cl backend.cpp ws2_32.lib /EHsc
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Compilation successful!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Starting backend server..." -ForegroundColor Yellow
        Write-Host "Server will run on http://localhost:8080" -ForegroundColor Green
        Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
        Write-Host ""
        .\backend.exe
    } else {
        Write-Host "✗ Compilation failed!" -ForegroundColor Red
        Write-Host "Please check the error messages above." -ForegroundColor Red
        exit 1
    }
}
else {
    Write-Host "✗ Error: No C++ compiler found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install one of the following:" -ForegroundColor Yellow
    Write-Host "  - MinGW (g++) - https://www.mingw-w64.org/" -ForegroundColor White
    Write-Host "  - Visual Studio with C++ tools (cl)" -ForegroundColor White
    Write-Host "  - LLVM/Clang - https://llvm.org/" -ForegroundColor White
    exit 1
}
