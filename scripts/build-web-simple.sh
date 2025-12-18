#!/bin/bash

# Simple web build script for Windows/cross-platform

set -e

echo "🚀 Simple Web Build Script"
echo "=========================="

cd apps/web

echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

echo "🔍 Running type checks..."
pnpm run type-check

echo "🧹 Running linter..."
pnpm run lint

echo "🏗️  Building application..."

# Try different build approaches
if [ "$1" = "safe" ]; then
    echo "🛡️  Using safe build (no standalone)..."
    # Backup current config
    cp next.config.ts next.config.ts.backup
    # Use safe config
    cp next.config.safe.ts next.config.ts
    # Build
    pnpm run build
    # Restore config
    mv next.config.ts.backup next.config.ts
    echo "✅ Safe build completed!"
elif [ "$1" = "windows" ]; then
    echo "🪟 Using Windows-compatible build..."
    cp next.config.windows.ts next.config.ts.backup
    cp next.config.windows.ts next.config.ts
    pnpm run build
    mv next.config.ts.backup next.config.ts
    echo "✅ Windows build completed!"
else
    echo "🔄 Trying normal build..."
    if pnpm run build; then
        echo "✅ Normal build completed!"
    else
        echo "❌ Normal build failed, trying safe build..."
        cp next.config.ts next.config.ts.backup
        cp next.config.safe.ts next.config.ts
        pnpm run build
        mv next.config.ts.backup next.config.ts
        echo "✅ Safe build completed!"
    fi
fi

cd ../..

echo "🎉 Web build process completed!"
echo "💡 Usage:"
echo "   ./scripts/build-web-simple.sh        # Normal build with fallback"
echo "   ./scripts/build-web-simple.sh safe   # Safe build (no standalone)"
echo "   ./scripts/build-web-simple.sh windows # Windows-compatible build"