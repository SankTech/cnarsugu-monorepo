@echo off
REM Build and Push Web Frontend to GitHub Container Registry
REM This solves the Dokploy monorepo build issues

echo 🚀 Building and Pushing CNAR Sugu Web Frontend
echo ==============================================

REM Configuration
set GITHUB_USERNAME=louguiman
set IMAGE_NAME=cnarsugu-web
set VERSION=latest
set FULL_IMAGE_NAME=ghcr.io/%GITHUB_USERNAME%/%IMAGE_NAME%:%VERSION%

echo 📋 Build Configuration:
echo    GitHub Username: %GITHUB_USERNAME%
echo    Image: %IMAGE_NAME%
echo    Version: %VERSION%
echo    Full name: %FULL_IMAGE_NAME%

REM Check if Docker is running
docker info >nul 2>&1
if errorlevel 1 (
    echo ❌ Error: Docker is not running!
    exit /b 1
)

REM Load environment variables
if exist apps\web\.env.web-only (
    echo 📋 Loading web-only environment configuration...
    for /f "tokens=*" %%i in ('type apps\web\.env.web-only ^| findstr /v "^#"') do set %%i
)

REM Build locally to bake in environment variables
echo 🏗️  Building application locally...
cd apps\web

REM Ensure dependencies are installed
call pnpm install
if errorlevel 1 (
    echo ❌ Dependency install failed!
    cd ..\..
    exit /b 1
)

REM Build Next.js app
echo 🔨 Running Next.js build...
call pnpm run build
if errorlevel 1 (
    echo ❌ Local build failed!
    cd ..\..
    exit /b 1
)

cd ..\..

REM Build the Docker image (Runtime only)
echo 📦 Packaging Docker image...
docker build ^
    --file apps/web/Dockerfile.runtime ^
    --tag "%FULL_IMAGE_NAME%" ^
    --tag "ghcr.io/%GITHUB_USERNAME%/%IMAGE_NAME%:latest" ^
    --build-arg NEXT_PUBLIC_API_URL="%NEXT_PUBLIC_API_URL%" ^
    --build-arg NEXT_PUBLIC_API_VERSION="%NEXT_PUBLIC_API_VERSION%" ^
    --build-arg NEXT_PUBLIC_APP_NAME="%NEXT_PUBLIC_APP_NAME%" ^
    --build-arg NEXT_PUBLIC_APP_VERSION="%NEXT_PUBLIC_APP_VERSION%" ^
    --build-arg NEXT_PUBLIC_PAYMENT_CALLBACK_URL="%NEXT_PUBLIC_PAYMENT_CALLBACK_URL%" ^
    --build-arg NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS="%NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS%" ^
    --build-arg NEXT_PUBLIC_ENABLE_DEBUG_MODE="%NEXT_PUBLIC_ENABLE_DEBUG_MODE%" ^
    .

if errorlevel 1 (
    echo ❌ Build failed!
    exit /b 1
)

echo ✅ Build completed successfully!

REM Login prompt
echo 🔐 Logging in to GitHub Container Registry...
echo Please make sure you have a GitHub Personal Access Token with 'write:packages' permission
echo You can create one at: https://github.com/settings/tokens
echo.
echo Please run this command to login:
echo docker login ghcr.io -u %GITHUB_USERNAME%
pause

REM Push to registry
echo 📤 Pushing image to GitHub Container Registry...
docker push "%FULL_IMAGE_NAME%"
docker push "ghcr.io/%GITHUB_USERNAME%/%IMAGE_NAME%:latest"

if errorlevel 1 (
    echo ❌ Push failed! Make sure you're logged in to ghcr.io
    exit /b 1
)

echo ✅ Push completed successfully!
echo.
echo 🎉 Image pushed successfully!
echo 📋 Use this image in Dokploy: %FULL_IMAGE_NAME%
echo.
echo 🚀 Ready to deploy in Dokploy!