@echo off
echo Starting Titan ESG Backend...
echo.

REM Check if .env file exists
if not exist ".env" (
    echo Warning: .env file not found. Please copy env.sample to .env and configure your environment variables.
    echo.
)

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing dependencies first...
    call install.bat
    if %errorlevel% neq 0 (
        echo Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting development server...
echo API will be available at: http://localhost:3001
echo Swagger documentation: http://localhost:3001/api
echo.
echo Press Ctrl+C to stop the server
echo.

npm run start:dev

pause
