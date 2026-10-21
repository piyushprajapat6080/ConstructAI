@echo off
title CONSTRUCTAI Backend Server
echo Starting CONSTRUCTAI FastAPI Backend Server...
cd /d "%~dp0"
if exist "backend\venv\Scripts\activate.bat" (
    call backend\venv\Scripts\activate.bat
)
set PYTHONPATH=%~dp0
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
pause
