@echo off
echo Installing Titan ESG Backend Dependencies...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

REM Check if npm is installed
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: npm is not installed. Please install npm first.
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo npm version:
npm --version
echo.

REM Install dependencies
echo Installing npm dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install npm dependencies.
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Next steps:
echo 1. Copy env.sample to .env and configure your environment variables
echo 2. Ensure MongoDB is running
echo 3. Run 'npm run start:dev' to start the development server
echo.
pause
