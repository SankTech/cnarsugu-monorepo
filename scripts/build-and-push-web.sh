#!/bin/bash

# Build and Push Web Frontend to GitHub Container Registry
# This solves the Dokploy monorepo build issues

set -e

echo "🚀 Building and Pushing CNAR Sugu Web Frontend"
echo "=============================================="

# Configuration
GITHUB_USERNAME=${GITHUB_USERNAME:-"louguiman"}
IMAGE_NAME="cnarsugu-web"
VERSION=${VERSION:-"latest"}
FULL_IMAGE_NAME="ghcr.io/$GITHUB_USERNAME/$IMAGE_NAME:$VERSION"

echo "📋 Build Configuration:"
echo "   GitHub Username: $GITHUB_USERNAME"
echo "   Image: $IMAGE_NAME"
echo "   Version: $VERSION"
echo "   Full name: $FULL_IMAGE_NAME"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Load environment variables
if [ -f "apps/web/.env.web-only" ]; then
    echo "📋 Loading web-only environment configuration..."
    export $(cat apps/web/.env.web-only | grep -v '^#' | xargs)
fi

# Build locally to bake in environment variables
echo "🏗️  Building application locally..."

# Verify pnpm is available
if ! command -v pnpm &> /dev/null; then
    echo "❌ Error: pnpm is not installed or not in PATH"
    exit 1
fi

cd apps/web

echo "📦 Installing dependencies..."
pnpm install

echo "🔨 Running Next.js build..."
pnpm run build

cd ../..

# Build the Docker image (Runtime only)
echo "📦 Packaging Docker image..."
docker build \
    --no-cache \
    --file apps/web/Dockerfile.runtime \
    --tag "$FULL_IMAGE_NAME" \
    --tag "ghcr.io/$GITHUB_USERNAME/$IMAGE_NAME:latest" \
    --build-arg NEXT_PUBLIC_API_URL="$NEXT_PUBLIC_API_URL" \
    --build-arg NEXT_PUBLIC_API_VERSION="$NEXT_PUBLIC_API_VERSION" \
    --build-arg NEXT_PUBLIC_APP_NAME="$NEXT_PUBLIC_APP_NAME" \
    --build-arg NEXT_PUBLIC_APP_VERSION="$NEXT_PUBLIC_APP_VERSION" \
    --build-arg NEXT_PUBLIC_PAYMENT_CALLBACK_URL="$NEXT_PUBLIC_PAYMENT_CALLBACK_URL" \
    --build-arg NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS="$NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS" \
    --build-arg NEXT_PUBLIC_ENABLE_DEBUG_MODE="$NEXT_PUBLIC_ENABLE_DEBUG_MODE" \
    .

echo "✅ Build completed successfully!"

# Get image size
IMAGE_SIZE=$(docker images "$FULL_IMAGE_NAME" --format "table {{.Size}}" | tail -n 1)
echo "📊 Image size: $IMAGE_SIZE"

# Login to GitHub Container Registry
echo "🔐 Logging in to GitHub Container Registry..."
echo "Please make sure you have a GitHub Personal Access Token with 'write:packages' permission"
echo "You can create one at: https://github.com/settings/tokens"

# Check if already logged in
if ! docker info | grep -q "ghcr.io"; then
    echo "Please login to GitHub Container Registry:"
    echo "docker login ghcr.io -u $GITHUB_USERNAME"
    read -p "Press Enter after you've logged in..."
fi

# Push to registry
echo "📤 Pushing image to GitHub Container Registry..."

# Push versioned tag
docker push "$FULL_IMAGE_NAME"

# Push latest tag
docker push "ghcr.io/$GITHUB_USERNAME/$IMAGE_NAME:latest"

echo "✅ Push completed successfully!"

# Create Dokploy compose content
echo ""
echo "🎉 Image pushed successfully!"
echo "📋 Use this in Dokploy:"
echo ""
echo "=== DOKPLOY COMPOSE CONTENT ==="
cat << EOF
version: '3.8'

services:
  cnarsugu-web:
    image: $FULL_IMAGE_NAME
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_URL=\${NEXT_PUBLIC_API_URL:-https://cnarsugu.cloud}
      - NEXT_PUBLIC_API_VERSION=\${NEXT_PUBLIC_API_VERSION:-v2}
      - NEXT_PUBLIC_APP_NAME=\${NEXT_PUBLIC_APP_NAME:-CNAR Sugu}
      - NEXT_PUBLIC_APP_VERSION=\${NEXT_PUBLIC_APP_VERSION:-2.0.0}
      - NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS=\${NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS:-true}
      - NEXT_PUBLIC_ENABLE_DEBUG_MODE=\${NEXT_PUBLIC_ENABLE_DEBUG_MODE:-false}
      - NEXT_PUBLIC_PAYMENT_CALLBACK_URL=\${NEXT_PUBLIC_PAYMENT_CALLBACK_URL}
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1", "--spider", "http://localhost:3000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.web.rule=Host(\`\${DOMAIN}\`)"
      - "traefik.http.routers.web.entrypoints=websecure"
      - "traefik.http.routers.web.tls.certresolver=letsencrypt"
      - "traefik.http.services.web.loadbalancer.server.port=3000"

networks:
  default:
    external: true
    name: traefik
EOF
echo "==============================="
echo ""
echo "📋 Environment variables to set in Dokploy:"
echo "   DOMAIN=your-domain.com"
echo "   NEXT_PUBLIC_API_URL=https://cnarsugu.cloud/api"
echo "   NEXT_PUBLIC_PAYMENT_CALLBACK_URL=https://your-domain.com/payment/callback"
echo ""
echo "🚀 Ready to deploy in Dokploy!"