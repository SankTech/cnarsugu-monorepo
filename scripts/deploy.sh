#!/bin/bash

# CNAR Sugu Web Frontend Deployment Script

set -e

echo "🚀 Starting CNAR Sugu Web Frontend Deployment..."

# Configuration
ENVIRONMENT=${1:-production}
COMPOSE_FILE="docker-compose.yml"
USE_REGISTRY=${USE_REGISTRY:-false}
REGISTRY_URL=${REGISTRY_URL:-"localhost:5000"}
IMAGE_TAG=${IMAGE_TAG:-"latest"}

if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
    USE_REGISTRY=true
fi

echo "📋 Environment: $ENVIRONMENT"
echo "📋 Compose file: $COMPOSE_FILE"

# Check if required files exist
if [ ! -f "$COMPOSE_FILE" ]; then
    echo "❌ Error: $COMPOSE_FILE not found!"
    exit 1
fi

# Load environment variables for production
if [ "$ENVIRONMENT" = "production" ]; then
    if [ ! -f ".env.production" ]; then
        echo "❌ Error: .env.production file not found!"
        echo "Please create .env.production with your production configuration."
        exit 1
    fi
    export $(cat .env.production | grep -v '^#' | xargs)
fi

# Pre-deployment checks
echo "🔍 Running pre-deployment checks..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Check for port conflicts
echo "🔍 Checking for port conflicts..."
if [ -f "scripts/fix-port-conflicts.sh" ]; then
    chmod +x scripts/fix-port-conflicts.sh
    if ! ./scripts/fix-port-conflicts.sh; then
        echo "❌ Port conflicts detected. Please resolve them first."
        exit 1
    fi
fi

# Check if required environment variables are set for production
if [ "$ENVIRONMENT" = "production" ]; then
    if [ -z "$DB_PASSWORD" ]; then
        echo "❌ Error: DB_PASSWORD environment variable is not set!"
        exit 1
    fi
fi

# Build and deploy
echo "🏗️  Building and deploying services..."

if [ "$USE_REGISTRY" = "true" ]; then
    echo "📦 Using registry deployment mode"
    echo "Registry: $REGISTRY_URL"
    echo "Image tag: $IMAGE_TAG"
    
    # Export environment variables for docker-compose
    export REGISTRY_URL
    export IMAGE_TAG
    
    # Pull images from registry
    docker-compose -f $COMPOSE_FILE pull
else
    echo "🔨 Using local build mode"
    
    # Pull base images
    docker-compose -f $COMPOSE_FILE pull
    
    # Build services locally
    docker-compose -f $COMPOSE_FILE build --no-cache
fi

# Stop existing services
echo "🛑 Stopping existing services..."
docker-compose -f $COMPOSE_FILE down

# Start services
echo "🚀 Starting services..."
docker-compose -f $COMPOSE_FILE up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 30

# Health checks
echo "🏥 Running health checks..."

# Check web service
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ Web service is healthy"
else
    echo "❌ Web service health check failed"
    docker-compose -f $COMPOSE_FILE logs web
    exit 1
fi

# Check API service
if curl -f http://localhost:3001/health > /dev/null 2>&1; then
    echo "✅ API service is healthy"
else
    echo "❌ API service health check failed"
    docker-compose -f $COMPOSE_FILE logs api
    exit 1
fi

# Show running services
echo "📊 Deployment Status:"
docker-compose -f $COMPOSE_FILE ps

echo "✅ Deployment completed successfully!"
echo "🌐 Web app is available at: http://localhost:3000"
echo "🔗 API is available at: http://localhost:3001"

if [ "$ENVIRONMENT" = "production" ]; then
    echo "🔒 Production deployment completed with SSL and reverse proxy"
    echo "🌐 Access your app at: https://your-domain.com"
fi