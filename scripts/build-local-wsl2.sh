#!/bin/bash

# Local build script for testing in WSL2 before pushing to GHCR

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🏗️  Building images locally in WSL2...${NC}"

# Build web frontend
echo -e "${YELLOW}Building web frontend...${NC}"
docker build \
    --platform linux/amd64 \
    --file cnarsugu-front/Dockerfile \
    --tag cnarsugu-web:local \
    .

# Build API backend
echo -e "${YELLOW}Building API backend...${NC}"
docker build \
    --platform linux/amd64 \
    --file cnarSuguApi/Dockerfile \
    --tag cnarsugu-api:local \
    .

echo -e "${GREEN}✅ Local build complete!${NC}"
echo -e "${YELLOW}To test locally, run:${NC}"
echo -e "   docker-compose up"