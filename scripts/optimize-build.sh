#!/bin/bash

# CNAR Sugu Web Frontend Build Optimization Script

set -e

echo "⚡ Optimizing CNAR Sugu Web Frontend Build..."

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf apps/web/.next
rm -rf apps/web/out
rm -rf apps/web/dist

# Clean node_modules for fresh install
echo "📦 Cleaning and reinstalling dependencies..."
rm -rf node_modules
rm -rf apps/web/node_modules
rm -rf packages/*/node_modules

# Install dependencies with production optimizations
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile --production=false

# Build shared packages with optimizations
echo "🏗️  Building shared packages..."
pnpm run build --filter=@cnarsugu/types
pnpm run build --filter=@cnarsugu/schemas  
pnpm run build --filter=@cnarsugu/store
pnpm run build --filter=@cnarsugu/hooks
pnpm run build --filter=@cnarsugu/utils

# Type checking
echo "🔍 Running type checks..."
pnpm run type-check --filter=@cnarsugu/web

# Linting with auto-fix
echo "🧹 Running linter with auto-fix..."
pnpm run lint --filter=@cnarsugu/web --fix

# Build web app with production optimizations
echo "🏗️  Building web application with optimizations..."
NODE_ENV=production pnpm run build --filter=@cnarsugu/web

# Analyze bundle size
echo "📊 Analyzing bundle size..."
if command -v npx &> /dev/null; then
    cd apps/web
    npx @next/bundle-analyzer .next/static/chunks/
    cd ../..
fi

# Generate build report
echo "📋 Generating build report..."
BUILD_SIZE=$(du -sh apps/web/.next | cut -f1)
STATIC_SIZE=$(du -sh apps/web/.next/static | cut -f1)

echo "✅ Build optimization completed!"
echo "📊 Build Report:"
echo "   Total build size: $BUILD_SIZE"
echo "   Static assets size: $STATIC_SIZE"
echo "   Build location: apps/web/.next/"

# Check for large files
echo "🔍 Checking for large files..."
find apps/web/.next -name "*.js" -size +500k -exec ls -lh {} \; | head -5

echo "💡 Optimization tips:"
echo "   - Consider code splitting for large components"
echo "   - Optimize images and use Next.js Image component"
echo "   - Enable compression in production"
echo "   - Use CDN for static assets"