@echo off
echo Starting Code Snippet Manager...
echo.

echo Installing backend dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Installing frontend dependencies...
cd ..\frontend
call npm install
if %errorlevel% neq 0 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo Creating admin user...
cd ..\backend
call npm run create-admin

echo.
echo Setup complete!
echo.
echo To start the application:
echo 1. Open a terminal and run: cd backend && npm run dev
echo 2. Open another terminal and run: cd frontend && npm run dev
echo.
echo Admin credentials:
echo Email: admin@example.com
echo Password: admin123
echo.
pause