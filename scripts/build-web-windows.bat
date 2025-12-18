@echo off
REM Windows batch script for building web frontend

echo 🚀 Building CNAR Sugu Web Frontend (Windows)
echo =============================================

cd apps\web

echo 📦 Installing dependencies...
pnpm install --frozen-lockfile
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo 🔍 Running type checks...
pnpm run type-check
if %errorlevel% neq 0 (
    echo ⚠️ Type check failed, but continuing...
)

echo 🧹 Running linter...
pnpm run lint
if %errorlevel% neq 0 (
    echo ⚠️ Linting failed, but continuing...
)

echo 🏗️ Building application...
pnpm run build:windows
if %errorlevel% neq 0 (
    echo ❌ Build failed, trying cross-platform build...
    pnpm run build:cross-platform
    if %errorlevel% neq 0 (
        echo ❌ All build attempts failed
        cd ..\..
        exit /b 1
    )
)

cd ..\..

echo ✅ Web frontend build completed successfully!
echo 💡 You can now run: cd apps\web && pnpm start