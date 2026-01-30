@echo off
echo ========================================
echo   PMP Summit Quest - Starting App
echo ========================================
echo.
echo Starting local web server...
echo.
echo Once the server starts, your browser will open automatically.
echo If not, open your browser and go to: http://localhost:8000
echo.
echo Press Ctrl+C to stop the server when you're done.
echo.
echo ========================================
echo.

cd /d "%~dp0"
start http://localhost:8000
python -m http.server 8000

pause
