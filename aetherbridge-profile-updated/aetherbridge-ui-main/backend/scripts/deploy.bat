@echo off
REM =============================================================================
REM AETHERBRIDGE BACKEND DEPLOYMENT SCRIPT (Windows)
REM =============================================================================

setlocal enabledelayedexpansion

REM Configuration
set ENVIRONMENT=%1
if "%ENVIRONMENT%"=="" set ENVIRONMENT=production

set DOCKER_REGISTRY=%DOCKER_REGISTRY%
if "%DOCKER_REGISTRY%"=="" set DOCKER_REGISTRY=your-registry.com

set IMAGE_NAME=%DOCKER_IMAGE_NAME%
if "%IMAGE_NAME%"=="" set IMAGE_NAME=aetherbridge-backend

set IMAGE_TAG=%DOCKER_IMAGE_TAG%
if "%IMAGE_TAG%"=="" set IMAGE_TAG=latest

set NAMESPACE=%K8S_NAMESPACE%
if "%NAMESPACE%"=="" set NAMESPACE=aetherbridge

echo 🚀 Starting AetherBridge Backend Deployment...
echo Environment: %ENVIRONMENT%
echo Image: %DOCKER_REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG%

REM Check prerequisites
echo 📋 Checking prerequisites...

where docker >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed
    exit /b 1
)

where kubectl >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ kubectl is not installed
    exit /b 1
)

where helm >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Helm is not installed
    exit /b 1
)

echo ✅ Prerequisites check passed

REM Build Docker image
echo 🔨 Building Docker image...
docker build -t %DOCKER_REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG% .
docker build -t %DOCKER_REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG%-%ENVIRONMENT% .

REM Push to registry
echo 📤 Pushing image to registry...
docker push %DOCKER_REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG%
docker push %DOCKER_REGISTRY%/%IMAGE_NAME%:%IMAGE_TAG%-%ENVIRONMENT%

REM Create namespace if it doesn't exist
echo 📁 Creating namespace...
kubectl create namespace %NAMESPACE% --dry-run=client -o yaml | kubectl apply -f -

REM Apply Kubernetes secrets
echo 🔐 Applying secrets...
kubectl apply -f k8s/secrets.yaml -n %NAMESPACE%

REM Apply Kubernetes configmaps
echo ⚙️ Applying configmaps...
kubectl apply -f k8s/configmaps.yaml -n %NAMESPACE%

REM Deploy using Helm
echo 📦 Deploying with Helm...
helm upgrade --install aetherbridge-backend ./helm --namespace %NAMESPACE% --set image.repository=%DOCKER_REGISTRY%/%IMAGE_NAME% --set image.tag=%IMAGE_TAG%-%ENVIRONMENT% --set environment=%ENVIRONMENT% --set replicas=%K8S_REPLICAS% --wait --timeout=10m

REM Wait for deployment to be ready
echo ⏳ Waiting for deployment to be ready...
kubectl rollout status deployment/aetherbridge-backend -n %NAMESPACE% --timeout=300s

REM Apply ingress
echo 🌐 Applying ingress...
kubectl apply -f k8s/ingress.yaml -n %NAMESPACE%

REM Health check
echo 🏥 Performing health check...
timeout /t 30 /nobreak >nul

set HEALTH_CHECK_URL=https://%LOAD_BALANCER_HOSTNAME%/health
if "%LOAD_BALANCER_HOSTNAME%"=="" set HEALTH_CHECK_URL=https://api.aetherbridge.com/health

for /l %%i in (1,1,10) do (
    curl -f -s %HEALTH_CHECK_URL% >nul 2>&1
    if !errorlevel! equ 0 (
        echo ✅ Health check passed
        goto :health_check_passed
    ) else (
        echo ⏳ Health check attempt %%i/10...
        timeout /t 10 /nobreak >nul
    )
)

:health_check_passed

REM Show deployment status
echo 📊 Deployment status:
kubectl get pods -n %NAMESPACE%
kubectl get services -n %NAMESPACE%
kubectl get ingress -n %NAMESPACE%

echo.
echo 🎉 Deployment completed successfully!
echo 🌐 API URL: https://%LOAD_BALANCER_HOSTNAME%
echo 📚 API Documentation: https://%LOAD_BALANCER_HOSTNAME%/api/docs

pause 