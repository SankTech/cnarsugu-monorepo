#!/bin/bash

# CNAR Sugu Quick Start Script

set -e

echo "🚀 CNAR Sugu Quick Start"
echo "========================"

# Check prerequisites
echo "🔍 Checking prerequisites..."

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check Docker Compose
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites check passed"

# Ask user for deployment type
echo ""
echo "Select deployment type:"
echo "1) Development (with hot reload)"
echo "2) Production (optimized build)"
echo "3) Production with monitoring"

read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔧 Starting development environment..."
        docker-compose up --build -d
        ENVIRONMENT="development"
        WEB_URL="http://localhost:3000"
        ;;
    2)
        echo "🏭 Starting production environment..."
        docker-compose -f docker-compose.prod.yml up --build -d
        ENVIRONMENT="production"
        WEB_URL="http://localhost"
        ;;
    3)
        echo "📊 Starting production with monitoring..."
        docker-compose -f docker-compose.prod.yml -f docker-compose.monitoring.yml up --build -d
        ENVIRONMENT="production"
        WEB_URL="http://localhost"
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 30

# Run verification
echo "🔍 Verifying deployment..."
if [ -f "scripts/verify-deployment.sh" ]; then
    chmod +x scripts/verify-deployment.sh
    ./scripts/verify-deployment.sh $ENVIRONMENT
else
    echo "⚠️  Verification script not found, checking manually..."
    
    # Basic health check
    if curl -f -s "$WEB_URL/health" > /dev/null 2>&1; then
        echo "✅ Web app is running"
    else
        echo "❌ Web app is not responding"
    fi
fi

echo ""
echo "🎉 Quick start completed!"
echo "🌐 Web app: $WEB_URL"
echo "🔗 API: http://localhost:3001"

if [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    echo "💡 Development tips:"
    echo "   - Code changes will auto-reload"
    echo "   - Check logs: docker-compose logs -f web"
    echo "   - Stop services: docker-compose down"
fi

if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🚀 Production deployment ready!"
    echo "   - Configure SSL certificates in ssl/ directory"
    echo "   - Update domain in nginx.conf"
    echo "   - Set up monitoring and backups"
fi

echo ""
echo "📚 Next steps:"
echo "   - Read DEPLOYMENT.md for detailed instructions"
echo "   - Configure environment variables"
echo "   - Set up monitoring and alerts"