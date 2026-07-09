@echo off
setlocal

cd /d "%~dp0"

where node >nul 2>&1
if errorlevel 1 (
  echo Node.js is required. Install it from https://nodejs.org/
  pause
  exit /b 1
)

where python >nul 2>&1
if errorlevel 1 (
  echo Python is required. Install it from https://www.python.org/
  pause
  exit /b 1
)

if not exist node_modules\concurrently (
  echo Installing root dependencies...
  call npm install
)

if not exist frontend\.next\BUILD_ID (
  echo Building frontend...
  call npm run frontend:build
)

echo.
echo Starting PharmaScope...
echo Open: http://127.0.0.1:3000
echo Login: admin / admin123
echo.

start "" http://127.0.0.1:3000
call npm run serve

endlocal