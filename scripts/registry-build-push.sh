#!/bin/bash

# Build and Push Images to Registry Script

set -e

# Configuration
REGISTRY_URL=${REGISTRY_URL:-"localhost:5000"}
PROJECT_NAME="cnarsugu"
VERSION=${VERSION:-$(git rev-parse --short HEAD)}
LATEST_TAG="latest"

echo "🏗️  Building and pushing CNAR Sugu images to registry..."
echo "📋 Registry: $REGISTRY_URL"
echo "📋 Version: $VERSION"

# Function to build and push image
build_and_push() {
    local service=$1
    local dockerfile_path=$2
    local context_path=${3:-"."}
    
    echo "🔨 Building $service..."
    
    # Build image with version tag
    docker build --no-cache -f "$dockerfile_path" -t "$REGISTRY_URL/$PROJECT_NAME-$service:$VERSION" "$context_path"
    
    # Tag as latest
    docker tag "$REGISTRY_URL/$PROJECT_NAME-$service:$VERSION" "$REGISTRY_URL/$PROJECT_NAME-$service:$LATEST_TAG"
    
    echo "📤 Pushing $service to registry..."
    
    # Push both tags
    docker push "$REGISTRY_URL/$PROJECT_NAME-$service:$VERSION"
    docker push "$REGISTRY_URL/$PROJECT_NAME-$service:$LATEST_TAG"
    
    echo "✅ $service pushed successfully!"
}

# Build shared packages first
echo "📦 Building shared packages..."
pnpm install --frozen-lockfile
pnpm run build --filter=@cnarsugu/types
pnpm run build --filter=@cnarsugu/schemas
pnpm run build --filter=@cnarsugu/store
pnpm run build --filter=@cnarsugu/hooks
pnpm run build --filter=@cnarsugu/utils

# Build and push web frontend
if [ -f "apps/web/Dockerfile" ]; then
    build_and_push "web" "apps/web/Dockerfile" "."
else
    echo "⚠️  Web Dockerfile not found, skipping..."
fi

# Build and push API backend
if [ -f "cnarSuguApi/Dockerfile" ]; then
    build_and_push "api" "cnarSuguApi/Dockerfile" "."
else
    echo "⚠️  API Dockerfile not found, skipping..."
fi

# Build and push mobile app (if Dockerfile exists)
if [ -f "cnarsugu-front/Dockerfile" ]; then
    build_and_push "mobile" "cnarsugu-front/Dockerfile" "."
else
    echo "⚠️  Mobile Dockerfile not found, skipping..."
fi

echo ""
echo "✅ All images built and pushed successfully!"
echo "🏷️  Images tagged with: $VERSION and $LATEST_TAG"
echo ""
echo "📋 Available images:"
echo "   - $REGISTRY_URL/$PROJECT_NAME-web:$VERSION"
echo "   - $REGISTRY_URL/$PROJECT_NAME-api:$VERSION"
echo ""
echo "🚀 Ready for deployment!"