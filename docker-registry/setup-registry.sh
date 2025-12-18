#!/bin/bash

# Docker Registry Setup Script for CNAR Sugu

set -e

echo "🐳 Setting up CNAR Sugu Docker Registry..."

# Create directories
mkdir -p docker-registry/{auth,certs,data}

# Generate self-signed certificate for registry
echo "🔐 Generating SSL certificate for registry..."
openssl req -newkey rsa:4096 -nodes -sha256 -keyout docker-registry/certs/registry.key \
  -x509 -days 365 -out docker-registry/certs/registry.crt \
  -subj "/C=US/ST=State/L=City/O=CNAR Sugu/CN=localhost"

# Create htpasswd file for authentication
echo "👤 Setting up registry authentication..."
read -p "Enter registry username: " REGISTRY_USER
read -s -p "Enter registry password: " REGISTRY_PASS
echo

# Install htpasswd if not available
if ! command -v htpasswd &> /dev/null; then
    echo "Installing apache2-utils for htpasswd..."
    if command -v apt-get &> /dev/null; then
        sudo apt-get update && sudo apt-get install -y apache2-utils
    elif command -v yum &> /dev/null; then
        sudo yum install -y httpd-tools
    elif command -v brew &> /dev/null; then
        brew install httpd
    else
        echo "❌ Please install htpasswd manually"
        exit 1
    fi
fi

# Generate htpasswd file
htpasswd -Bbn "$REGISTRY_USER" "$REGISTRY_PASS" > docker-registry/auth/htpasswd

# Start registry services
echo "🚀 Starting Docker Registry services..."
docker-compose -f docker-registry/docker-compose.registry.yml up -d

# Wait for services to start
echo "⏳ Waiting for services to start..."
sleep 10

# Test registry
echo "🧪 Testing registry connection..."
if curl -k https://localhost:5000/v2/ &> /dev/null; then
    echo "✅ Registry is running successfully!"
else
    echo "❌ Registry test failed"
    docker-compose -f docker-registry/docker-compose.registry.yml logs
    exit 1
fi

echo "📊 Registry services status:"
docker-compose -f docker-registry/docker-compose.registry.yml ps

echo ""
echo "✅ Docker Registry setup completed!"
echo "🌐 Registry URL: https://localhost:5000"
echo "🖥️  Registry UI: http://localhost:8080"
echo "👤 Username: $REGISTRY_USER"
echo ""
echo "📝 Next steps:"
echo "1. Configure Docker daemon to trust the registry"
echo "2. Update your deployment scripts to use the registry"
echo "3. Push your images to the registry"