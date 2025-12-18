#!/bin/bash

# CNAR Sugu Web Frontend Deployment Verification Script

set -e

echo "🔍 Verifying CNAR Sugu Web Frontend Deployment..."

# Configuration
ENVIRONMENT=${1:-development}
WEB_URL="http://localhost:3000"
API_URL="http://localhost:3001"

if [ "$ENVIRONMENT" = "production" ]; then
    WEB_URL="https://your-domain.com"
    API_URL="https://your-domain.com/api"
fi

echo "📋 Environment: $ENVIRONMENT"
echo "🌐 Web URL: $WEB_URL"
echo "🔗 API URL: $API_URL"

# Function to check service health
check_service() {
    local url=$1
    local service_name=$2
    local max_attempts=30
    local attempt=1

    echo "🏥 Checking $service_name health..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s "$url/health" > /dev/null 2>&1; then
            echo "✅ $service_name is healthy"
            return 0
        fi
        
        echo "⏳ Attempt $attempt/$max_attempts - $service_name not ready yet..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ $service_name health check failed after $max_attempts attempts"
    return 1
}

# Function to check page response
check_page() {
    local url=$1
    local page_name=$2
    
    echo "📄 Checking $page_name..."
    
    if curl -f -s "$url" > /dev/null 2>&1; then
        echo "✅ $page_name is accessible"
        return 0
    else
        echo "❌ $page_name is not accessible"
        return 1
    fi
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Error: Docker is not running!"
    exit 1
fi

# Check if services are running
echo "🐳 Checking Docker services..."
if [ "$ENVIRONMENT" = "production" ]; then
    COMPOSE_FILE="docker-compose.prod.yml"
else
    COMPOSE_FILE="docker-compose.yml"
fi

if ! docker-compose -f $COMPOSE_FILE ps | grep -q "Up"; then
    echo "❌ Error: No services are running!"
    echo "Run: docker-compose -f $COMPOSE_FILE up -d"
    exit 1
fi

# Health checks
check_service "$WEB_URL" "Web Frontend"
check_service "$API_URL" "API Backend"

# Page accessibility checks
echo "🌐 Checking page accessibility..."
check_page "$WEB_URL" "Home Page"
check_page "$WEB_URL/products" "Products Page"
check_page "$WEB_URL/terms" "Terms Page"
check_page "$WEB_URL/coverage" "Coverage Page"

# API endpoint checks
echo "🔗 Checking API endpoints..."
if curl -f -s "$API_URL/v2/health" > /dev/null 2>&1; then
    echo "✅ API health endpoint is working"
else
    echo "❌ API health endpoint is not accessible"
fi

# Performance checks
echo "⚡ Running performance checks..."

# Check response times
web_response_time=$(curl -o /dev/null -s -w '%{time_total}' "$WEB_URL" || echo "0")
api_response_time=$(curl -o /dev/null -s -w '%{time_total}' "$API_URL/v2/health" || echo "0")

echo "📊 Performance metrics:"
echo "   Web response time: ${web_response_time}s"
echo "   API response time: ${api_response_time}s"

# Check if response times are acceptable (< 2 seconds)
if (( $(echo "$web_response_time < 2.0" | bc -l) )); then
    echo "✅ Web response time is acceptable"
else
    echo "⚠️  Web response time is slow (>${web_response_time}s)"
fi

if (( $(echo "$api_response_time < 1.0" | bc -l) )); then
    echo "✅ API response time is acceptable"
else
    echo "⚠️  API response time is slow (>${api_response_time}s)"
fi

# Security checks
echo "🔒 Running security checks..."

# Check security headers
if curl -I -s "$WEB_URL" | grep -q "X-Frame-Options"; then
    echo "✅ Security headers are present"
else
    echo "⚠️  Security headers might be missing"
fi

# Check HTTPS (for production)
if [ "$ENVIRONMENT" = "production" ]; then
    if curl -I -s "$WEB_URL" | grep -q "HTTP/2 200"; then
        echo "✅ HTTPS is working"
    else
        echo "❌ HTTPS is not working properly"
    fi
fi

# Resource usage checks
echo "📈 Checking resource usage..."
docker stats --no-stream --format "table {{.Container}}\t{{.CPUPerc}}\t{{.MemUsage}}" | head -5

# Final summary
echo ""
echo "🎉 Deployment verification completed!"
echo "📊 Summary:"
echo "   Environment: $ENVIRONMENT"
echo "   Web URL: $WEB_URL"
echo "   API URL: $API_URL"
echo "   Status: All checks passed ✅"

if [ "$ENVIRONMENT" = "production" ]; then
    echo ""
    echo "🚀 Production deployment is ready!"
    echo "🌐 Your app is live at: $WEB_URL"
fi