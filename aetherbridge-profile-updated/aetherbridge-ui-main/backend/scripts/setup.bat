@echo off
REM =============================================================================
REM AETHERBRIDGE BACKEND SETUP SCRIPT (Windows)
REM =============================================================================

echo 🚀 AetherBridge Backend Setup
echo ============================

REM Check prerequisites
echo 📋 Checking prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ npm is not installed
    exit /b 1
)

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ⚠️ Docker is not installed. Some features may not work
)

echo ✅ Prerequisites check passed

REM Install dependencies
echo 📦 Installing dependencies...
call npm install

REM Create necessary directories
echo 📁 Creating directories...
if not exist "logs" mkdir logs
if not exist "wallet" mkdir wallet
if not exist "config" mkdir config
if not exist "contracts" mkdir contracts

REM Copy environment template
if not exist ".env" (
    echo ⚙️ Setting up environment configuration...
    copy config.env.example .env
    
    echo Please edit the .env file with your actual configuration values.
    echo Key values to configure:
    echo - MONGODB_URI
    echo - REDIS_URL
    echo - ETHEREUM_PROVIDER_URL
    echo - OPENAI_API_KEY
    echo - SMTP credentials
    echo - AWS credentials
) else (
    echo ✅ Environment file already exists
)

REM Generate JWT secret
echo 🔐 Generating JWT secret...
for /f "tokens=*" %%i in ('openssl rand -hex 32 2^>nul') do set JWT_SECRET=%%i
if "%JWT_SECRET%"=="" (
    echo ⚠️ Could not generate JWT secret. Please set it manually in .env file
) else (
    echo ✅ JWT secret generated
)

REM Create database initialization scripts
echo 📝 Creating database initialization scripts...

echo // MongoDB initialization script > scripts\mongo-init.js
echo db = db.getSiblingDB('aetherbridge'); >> scripts\mongo-init.js
echo. >> scripts\mongo-init.js
echo // Create collections >> scripts\mongo-init.js
echo db.createCollection('users'); >> scripts\mongo-init.js
echo db.createCollection('credentials'); >> scripts\mongo-init.js
echo db.createCollection('courses'); >> scripts\mongo-init.js
echo db.createCollection('applications'); >> scripts\mongo-init.js
echo db.createCollection('events'); >> scripts\mongo-init.js
echo. >> scripts\mongo-init.js
echo // Create indexes >> scripts\mongo-init.js
echo db.users.createIndex({ "email": 1 }, { unique: true }); >> scripts\mongo-init.js
echo db.users.createIndex({ "walletAddress": 1 }, { unique: true }); >> scripts\mongo-init.js
echo db.credentials.createIndex({ "credentialId": 1 }, { unique: true }); >> scripts\mongo-init.js
echo db.credentials.createIndex({ "userId": 1 }); >> scripts\mongo-init.js
echo db.credentials.createIndex({ "blockchainHash": 1 }, { unique: true }); >> scripts\mongo-init.js
echo. >> scripts\mongo-init.js
echo print('MongoDB initialized successfully'); >> scripts\mongo-init.js

echo ✅ Database initialization scripts created

REM Create .gitignore
if not exist ".gitignore" (
    echo 📝 Creating .gitignore...
    echo # Dependencies > .gitignore
    echo node_modules/ >> .gitignore
    echo npm-debug.log* >> .gitignore
    echo yarn-debug.log* >> .gitignore
    echo yarn-error.log* >> .gitignore
    echo. >> .gitignore
    echo # Environment variables >> .gitignore
    echo .env >> .gitignore
    echo .env.local >> .gitignore
    echo .env.development.local >> .gitignore
    echo .env.test.local >> .gitignore
    echo .env.production.local >> .gitignore
    echo. >> .gitignore
    echo # Logs >> .gitignore
    echo logs/ >> .gitignore
    echo *.log >> .gitignore
    echo. >> .gitignore
    echo # Blockchain wallet and keys >> .gitignore
    echo wallet/ >> .gitignore
    echo *.key >> .gitignore
    echo *.pem >> .gitignore
    echo *.crt >> .gitignore
    echo. >> .gitignore
    echo # Contract artifacts >> .gitignore
    echo contracts/artifacts/ >> .gitignore
    echo contracts/cache/ >> .gitignore
    echo. >> .gitignore
    echo # Database files >> .gitignore
    echo *.db >> .gitignore
    echo *.sqlite >> .gitignore
    echo. >> .gitignore
    echo # Kubernetes secrets >> .gitignore
    echo k8s/secrets.yaml >> .gitignore
    echo ✅ .gitignore created
)

REM Final setup instructions
echo.
echo 🎉 Setup completed successfully!
echo ================================
echo.
echo Next steps:
echo 1. Review and update .env file with your actual values
echo 2. Start the development environment:
echo    docker-compose up -d
echo 3. Or start manually:
echo    npm run dev
echo 4. Access the API at: http://localhost:8000
echo 5. Check health endpoint: http://localhost:8000/health
echo.
echo For production deployment:
echo 1. Review DEPLOYMENT.md for detailed instructions
echo 2. Update Kubernetes configurations in k8s/ directory
echo 3. Run deployment script: scripts\deploy.bat production
echo.
echo Documentation:
echo - API Documentation: http://localhost:8000/api/docs
echo - Deployment Guide: DEPLOYMENT.md
echo - Environment Config: config.env.example
echo.
pause 