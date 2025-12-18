#!/bin/bash

# CNAR Sugu Web Frontend Build Script

set -e

echo "🏗️  Building CNAR Sugu Web Frontend..."

# Install dependencies
echo "📦 Installing dependencies..."
pnpm install --frozen-lockfile

# Type checking
echo "🔍 Running type checks..."
pnpm run type-check --filter=@cnarsugu/web

# Linting
echo "🧹 Running linter..."
pnpm run lint --filter=@cnarsugu/web

# Build shared packages first
echo "📦 Building shared packages..."
pnpm run build --filter=@cnarsugu/types
pnpm run build --filter=@cnarsugu/schemas
pnpm run build --filter=@cnarsugu/store
pnpm run build --filter=@cnarsugu/hooks
pnpm run build --filter=@cnarsugu/utils

# Build web app
echo "🏗️  Building web application..."
pnpm run build --filter=@cnarsugu/web

echo "✅ Build completed successfully!"
echo "📁 Build output is in apps/web/.next/"