@echo off
REM Quick Start Script for Ascent to PMP
REM Double-click this file to start the local server

echo.
echo ========================================
echo   Ascent to PMP: The Summit Quest
echo   Starting Local Server...
echo ========================================
echo.

cd /d "%~dp0"

REM Try Python 3 first
python --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Python server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto :end
)

REM Try Python 2
python -m SimpleHTTPServer --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Python 2 server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    start http://localhost:8000
    python -m SimpleHTTPServer 8000
    goto :end
)

REM Try Node.js
npx --version >nul 2>&1
if %errorlevel% equ 0 (
    echo Starting Node.js server on http://localhost:8000
    echo.
    echo Press Ctrl+C to stop the server
    echo.
    start http://localhost:8000
    npx http-server -p 8000
    goto :end
)

REM No server found
echo ERROR: No web server found!
echo.
echo Please install one of the following:
echo   - Python: https://www.python.org/downloads/
echo   - Node.js: https://nodejs.org/
echo.
echo Or see HOW-TO-RUN-LOCALHOST.md for more options
echo.
pause
goto :end

:end
