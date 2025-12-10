@echo off
echo Starting MiFID II Client Profiling System...
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js 16+ first.
    echo Visit: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js found
echo.

REM Backend setup
echo Setting up backend...
cd backend

if not exist "node_modules\" (
    echo Installing backend dependencies...
    call npm install
)

echo Starting backend server on port 5000...
start "Backend Server" cmd /k npm start

timeout /t 3 /nobreak >nul

REM Frontend setup
echo.
echo Setting up frontend...
cd ..\frontend

if not exist "node_modules\" (
    echo Installing frontend dependencies...
    call npm install
)

echo Starting frontend on port 3000...
start "Frontend Server" cmd /k npm start

echo.
echo Both servers are starting...
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5001
echo.
echo Press any key to exit (servers will keep running in separate windows)
pause >nul
