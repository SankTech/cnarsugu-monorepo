#!/bin/bash

# CNAR Sugu Web Frontend - Standalone Deployment Script

set -e

echo "🚀 Deploying CNAR Sugu Web Frontend (Standalone)"
echo "==============================================="

# Configuration
ENVIRONMENT=${1:-production}
REGISTRY_URL=${REGISTRY_URL:-"localhost:5000"}
VERSION=${VERSION:-"latest"}

echo "📋 Deployment Configuration:"
echo "   Environment: $ENVIRONMENT"
echo "   Registry: $REGISTRY_URL"
echo "   Version: $VERSION"

# Load environment variables
if [ -f "apps/web/.env.web-only" ]; then
    echo "📋 Loading web-only environment configuration..."
    export $(cat apps/web/.env.web-only | grep -v '^#' | xargs)
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Check required environment variables
if [ -z "$NEXT_PUBLIC_API_URL" ]; then
    echo "❌ Error: NEXT_PUBLIC_API_URL is not set!"
    echo "Please configure your external API URL in apps/web/.env.web-only"
    exit 1
fi

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: DOMAIN is not set!"
    echo "Please configure your domain in apps/web/.env.web-only"
    exit 1
fi

# Build and push to registry
echo "🏗️  Building and pushing to registry..."
chmod +x scripts/build-web-registry.sh
./scripts/build-web-registry.sh

# Deploy based on environment
if [ "$ENVIRONMENT" = "dokploy" ]; then
    echo "🚀 Deploying to Dokploy..."
    echo "Use the following compose file in Dokploy:"
    echo "   apps/web/docker-compose.dokploy.yml"
    echo ""
    echo "Environment variables to set in Dokploy:"
    echo "   REGISTRY_URL=$REGISTRY_URL"
    echo "   VERSION=$VERSION"
    echo "   DOMAIN=$DOMAIN"
    echo "   NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL"
    echo "   NEXT_PUBLIC_PAYMENT_CALLBACK_URL=$NEXT_PUBLIC_PAYMENT_CALLBACK_URL"
    
elif [ "$ENVIRONMENT" = "local" ]; then
    echo "🚀 Deploying locally..."
    cd apps/web
    docker-compose -f docker-compose.web.yml up -d
    cd ../..
    
else
    echo "🚀 Deploying to production..."
    cd apps/web
    docker-compose -f docker-compose.web.yml up -d
    cd ../..
fi

# Wait for service to be ready
echo "⏳ Waiting for web service to be ready..."
sleep 15

# Health check
echo "🏥 Running health check..."
if [ "$ENVIRONMENT" = "dokploy" ]; then
    HEALTH_URL="https://$DOMAIN/health"
else
    HEALTH_URL="http://localhost:3000/health"
fi

if curl -f -s "$HEALTH_URL" > /dev/null 2>&1; then
    echo "✅ Web service is healthy"
else
    echo "❌ Web service health check failed"
    echo "Check logs with: docker logs cnarsugu-web"
    exit 1
fi

# Show deployment info
echo ""
echo "🎉 Web frontend deployment completed!"
echo "📊 Deployment Summary:"
echo "   Environment: $ENVIRONMENT"
echo "   Image: $REGISTRY_URL/cnarsugu-web:$VERSION"
echo "   Health URL: $HEALTH_URL"

if [ "$ENVIRONMENT" = "dokploy" ]; then
    echo "   Web URL: https://$DOMAIN"
    echo ""
    echo "📋 Next steps for Dokploy:"
    echo "   1. Create new application in Dokploy"
    echo "   2. Use Docker Compose deployment type"
    echo "   3. Upload apps/web/docker-compose.dokploy.yml"
    echo "   4. Set environment variables in Dokploy dashboard"
    echo "   5. Deploy!"
else
    echo "   Web URL: http://localhost:3000"
    echo ""
    echo "📋 Management commands:"
    echo "   View logs: docker logs cnarsugu-web"
    echo "   Stop service: docker stop cnarsugu-web"
    echo "   Update: ./scripts/deploy-web-only.sh"
fi