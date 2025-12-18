# Windows PowerShell script for building web frontend

Write-Host "🚀 Building CNAR Sugu Web Frontend (Windows)" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Configuration
$ErrorActionPreference = "Stop"

# Check if running as administrator (needed for symlinks)
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")

if (-not $isAdmin) {
    Write-Host "⚠️  Warning: Not running as administrator" -ForegroundColor Yellow
    Write-Host "   Symlink creation may fail. Consider running as admin or using alternative build." -ForegroundColor Yellow
}

# Navigate to web directory
Set-Location "apps/web"

Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
pnpm install --frozen-lockfile

Write-Host "🔍 Running type checks..." -ForegroundColor Cyan
pnpm run type-check

Write-Host "🧹 Running linter..." -ForegroundColor Cyan
pnpm run lint

Write-Host "🏗️  Building application..." -ForegroundColor Cyan

try {
    # Try Windows-compatible build first
    pnpm run build:windows
    Write-Host "✅ Build completed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Windows build failed, trying cross-platform approach..." -ForegroundColor Red
    
    # Try build without standalone output
    Write-Host "🔄 Attempting build without standalone output..." -ForegroundColor Yellow
    
    # Temporarily modify next.config.ts to disable standalone
    $configContent = Get-Content "next.config.ts" -Raw
    $modifiedConfig = $configContent -replace "output: 'standalone',", "// output: 'standalone',"
    Set-Content "next.config.ts" -Value $modifiedConfig
    
    try {
        pnpm run build:cross-platform
        Write-Host "✅ Cross-platform build completed!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Cross-platform build also failed" -ForegroundColor Red
        throw
    } finally {
        # Restore original config
        Set-Content "next.config.ts" -Value $configContent
    }
}

# Return to root directory
Set-Location "../.."

Write-Host "🎉 Web frontend build process completed!" -ForegroundColor Green