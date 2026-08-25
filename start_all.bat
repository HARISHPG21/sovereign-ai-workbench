@echo off
title SovereignAI Workbench (SIH 26117)
echo ======================================================================
echo  Starting SovereignAI Workbench (MRPL - PS 26117)
echo ======================================================================

start "SovereignAI Backend (Port 8000)" cmd /k "cd backend && pip install -r requirements.txt && python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
timeout /t 3 /nobreak > nul
start "SovereignAI Frontend (Port 3000)" cmd /k "cd frontend && npm install && npm run dev"

echo.
echo Servers launched!
echo Open http://localhost:3000 in your browser.
pause
