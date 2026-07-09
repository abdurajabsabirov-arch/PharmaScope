@echo off
setlocal

cd /d "%~dp0"

where python >nul 2>&1
if errorlevel 1 (
  echo Python is required. Install it from https://www.python.org/
  pause
  exit /b 1
)

if not exist venv\Scripts\python.exe (
  echo Creating virtual environment...
  python -m venv venv
)

echo Installing backend dependencies...
call venv\Scripts\pip.exe install -r requirements.txt

echo Starting PharmaScope API at http://127.0.0.1:8000
call venv\Scripts\python.exe -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload

endlocal