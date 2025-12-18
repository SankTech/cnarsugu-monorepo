#!/bin/bash

# Quick Fix for Dokploy Port Conflicts

set -e

echo "🚨 Quick Fix for Dokploy Port Conflicts"
echo "======================================"

# Stop all Docker containers to free up ports
echo "🛑 Stopping all Docker containers..."
docker stop $(docker ps -q) 2>/dev/null || echo "No containers to stop"

# Remove any containers using our ports
echo "🧹 Removing containers using conflicting ports..."
docker ps -a --format "table {{.Names}}\t{{.Ports}}" | grep -E "(3000|3001|3002)" | awk '{print $1}' | while read container; do
    if [ ! -z "$container" ] && [ "$container" != "NAMES" ]; then
        echo "Removing container: $container"
        docker rm -f "$container" 2>/dev/null || true
    fi
done

# Clean up Docker networks
echo "🌐 Cleaning up Docker networks..."
docker network prune -f

# Clean up unused volumes
echo "💾 Cleaning up unused volumes..."
docker volume prune -f

# Verify ports are free
echo "🔍 Verifying ports are now free..."
for port in 3000 3001 3002 5432 6379; do
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "⚠️  Port $port is still in use"
        lsof -i :$port 2>/dev/null || echo "Could not identify process"
    else
        echo "✅ Port $port is now free"
    fi
done

echo ""
echo "✅ Quick fix completed!"
echo "💡 You can now deploy using:"
echo "   docker-compose -f docker-compose.dokploy.yml up --build -d"
echo ""
echo "🔗 For Dokploy deployment:"
echo "   1. Use docker-compose.dokploy.yml as your compose file"
echo "   2. Set environment variables from .env.dokploy"
echo "   3. Configure your domain in Dokploy dashboard"