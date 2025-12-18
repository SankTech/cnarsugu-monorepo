#!/bin/bash

# CNAR Sugu Web Frontend - Docker Registry Build & Push Script

set -e

echo "🚀 Building CNAR Sugu Web Frontend for Docker Registry"
echo "===================================================="

# Configuration
REGISTRY_URL=${REGISTRY_URL:-"localhost:5000"}
IMAGE_NAME="cnarsugu-web"
VERSION=${VERSION:-"latest"}
FULL_IMAGE_NAME="$REGISTRY_URL/$IMAGE_NAME:$VERSION"

# Load environment variables if available
if [ -f ".env.registry" ]; then
    echo "📋 Loading registry configuration..."
    export $(cat .env.registry | grep -v '^#' | xargs)
fi

echo "📋 Build Configuration:"
echo "   Registry: $REGISTRY_URL"
echo "   Image: $IMAGE_NAME"
echo "   Version: $VERSION"
echo "   Full name: $FULL_IMAGE_NAME"

# Pre-build checks
echo "🔍 Running pre-build checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Check if we can reach the registry
echo "🔍 Checking registry connectivity..."
if ! curl -f -s "$REGISTRY_URL/v2/" > /dev/null 2>&1; then
    echo "⚠️  Warning: Cannot reach registry at $REGISTRY_URL"
    echo "   Make sure your Docker registry is running"
    echo "   You can start it with: ./docker-registry/setup-registry.sh"
fi

# Build the web frontend
echo "🏗️  Building web frontend Docker image..."

# Build with build args for optimization
docker build \
    --file apps/web/Dockerfile \
    --target runner \
    --tag "$FULL_IMAGE_NAME" \
    --tag "$REGISTRY_URL/$IMAGE_NAME:latest" \
    --build-arg NODE_ENV=production \
    --build-arg NEXT_TELEMETRY_DISABLED=1 \
    .

echo "✅ Build completed successfully!"

# Get image size
IMAGE_SIZE=$(docker images "$FULL_IMAGE_NAME" --format "table {{.Size}}" | tail -n 1)
echo "📊 Image size: $IMAGE_SIZE"

# Push to registry
echo "📤 Pushing image to registry..."

# Push versioned tag
docker push "$FULL_IMAGE_NAME"

# Push latest tag
docker push "$REGISTRY_URL/$IMAGE_NAME:latest"

echo "✅ Push completed successfully!"

# Verify the push
echo "🔍 Verifying image in registry..."
if curl -f -s "$REGISTRY_URL/v2/$IMAGE_NAME/tags/list" | grep -q "$VERSION"; then
    echo "✅ Image verified in registry"
else
    echo "⚠️  Warning: Could not verify image in registry"
fi

# Clean up local images (optional)
read -p "🧹 Clean up local images? (y/N): " cleanup
if [[ $cleanup =~ ^[Yy]$ ]]; then
    docker rmi "$FULL_IMAGE_NAME" 2>/dev/null || true
    docker rmi "$REGISTRY_URL/$IMAGE_NAME:latest" 2>/dev/null || true
    echo "✅ Local images cleaned up"
fi

echo ""
echo "🎉 Web frontend build and push completed!"
echo "📋 Summary:"
echo "   Image: $FULL_IMAGE_NAME"
echo "   Registry: $REGISTRY_URL"
echo "   Size: $IMAGE_SIZE"
echo ""
echo "🚀 Deploy with:"
echo "   docker run -p 3000:3000 $FULL_IMAGE_NAME"
echo ""
echo "🔗 Or use in docker-compose:"
echo "   image: $FULL_IMAGE_NAME"