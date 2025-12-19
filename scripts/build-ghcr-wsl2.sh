#!/bin/bash

# Build script for GHCR using WSL2 with proper platform targeting
# This ensures compatibility between local builds and production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
REGISTRY="ghcr.io"
NAMESPACE="louguiman"  # Replace with your GitHub username/org
IMAGE_TAG=${1:-latest}
PLATFORM="linux/amd64"

echo -e "${GREEN}🚀 Building GHCR images using WSL2 with platform targeting${NC}"
echo -e "${YELLOW}Registry: ${REGISTRY}${NC}"
echo -e "${YELLOW}Platform: ${PLATFORM}${NC}"
echo -e "${YELLOW}Tag: ${IMAGE_TAG}${NC}"

# Ensure we're in WSL2
if ! grep -q microsoft /proc/version; then
    echo -e "${RED}❌ This script should be run in WSL2 for best compatibility${NC}"
    echo -e "${YELLOW}💡 Please run this script from WSL2 terminal${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running or not accessible${NC}"
    echo -e "${YELLOW}💡 Make sure Docker Desktop is running with WSL2 integration enabled${NC}"
    exit 1
fi

# Enable Docker buildx for multi-platform builds
echo -e "${GREEN}🔧 Setting up Docker buildx...${NC}"
docker buildx create --name multiarch --driver docker-container --use 2>/dev/null || true
docker buildx inspect --bootstrap

# Build and push web frontend (Expo)
echo -e "${GREEN}🏗️  Building web frontend...${NC}"
docker buildx build \
    --platform ${PLATFORM} \
    --file cnarsugu-front/Dockerfile \
    --tag ${REGISTRY}/${NAMESPACE}/cnarsugu-web:${IMAGE_TAG} \
    --push \
    .

# Build and push API backend
echo -e "${GREEN}🏗️  Building API backend...${NC}"
docker buildx build \
    --platform ${PLATFORM} \
    --file cnarSuguApi/Dockerfile \
    --tag ${REGISTRY}/${NAMESPACE}/cnarsugu-api:${IMAGE_TAG} \
    --push \
    .

echo -e "${GREEN}✅ Successfully built and pushed images to GHCR!${NC}"
echo -e "${YELLOW}📝 Images built:${NC}"
echo -e "   • ${REGISTRY}/${NAMESPACE}/cnarsugu-web:${IMAGE_TAG}"
echo -e "   • ${REGISTRY}/${NAMESPACE}/cnarsugu-api:${IMAGE_TAG}"

echo -e "${GREEN}🔄 To deploy, update your production environment variables:${NC}"
echo -e "   export REGISTRY_URL=${REGISTRY}/${NAMESPACE}"
echo -e "   export IMAGE_TAG=${IMAGE_TAG}"