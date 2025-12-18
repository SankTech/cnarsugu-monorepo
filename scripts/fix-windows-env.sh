#!/bin/bash

# Fix Windows environment variable issues

set -e

echo "🔧 Fixing Windows Environment Variable Issues"
echo "============================================="

echo "The error 'NODE_ENV is not recognized' occurs because:"
echo "1. Windows Command Prompt doesn't understand Unix syntax"
echo "2. You need to use 'cross-env' or Windows-specific syntax"
echo ""

echo "Choose a solution:"
echo "1) Use cross-env (RECOMMENDED - already installed)"
echo "2) Use Windows batch script"
echo "3) Use PowerShell script"
echo "4) Use Node.js cross-platform script"
echo "5) Use Git Bash/WSL"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "✅ Using cross-env (recommended)..."
        cd apps/web
        echo "📋 Available cross-env commands:"
        echo "   pnpm run build:production  # Uses cross-env"
        echo "   pnpm run build:windows     # Uses cross-env"
        echo "   pnpm run build:cross-platform # Node.js script"
        echo ""
        echo "🚀 Running cross-env build..."
        pnpm run build:production
        cd ../..
        ;;
    2)
        echo "🪟 Using Windows batch script..."
        echo "💡 Run: scripts\\build-web-windows.bat"
        ;;
    3)
        echo "💙 Using PowerShell script..."
        echo "💡 Run: powershell -ExecutionPolicy Bypass -File scripts\\build-web-windows.ps1"
        ;;
    4)
        echo "🌐 Using Node.js cross-platform script..."
        node scripts/build-web-cross-platform.js
        ;;
    5)
        echo "🐧 Using Git Bash/WSL..."
        echo "💡 Open Git Bash or WSL and run:"
        echo "   cd apps/web"
        echo "   NODE_ENV=production pnpm run build"
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "💡 For future builds on Windows:"
echo "   - Use 'pnpm run build:production' (uses cross-env)"
echo "   - Use 'pnpm run build:cross-platform' (Node.js script)"
echo "   - Use Git Bash instead of Command Prompt"
echo "   - Use WSL2 for Linux-like environment"