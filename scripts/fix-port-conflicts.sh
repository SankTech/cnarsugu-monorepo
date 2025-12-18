#!/bin/bash

# Port Conflict Resolution Script for CNAR Sugu

set -e

echo "🔍 Checking for port conflicts..."

# Function to check if port is in use
check_port() {
    local port=$1
    local service=$2
    
    if netstat -tuln 2>/dev/null | grep -q ":$port "; then
        echo "⚠️  Port $port is already in use (needed for $service)"
        return 1
    else
        echo "✅ Port $port is available for $service"
        return 0
    fi
}

# Function to find alternative port
find_alternative_port() {
    local base_port=$1
    local service=$2
    local port=$base_port
    
    while netstat -tuln 2>/dev/null | grep -q ":$port "; do
        port=$((port + 1))
    done
    
    echo "💡 Alternative port for $service: $port"
    return $port
}

# Function to stop conflicting services
stop_conflicting_services() {
    echo "🛑 Stopping potentially conflicting Docker services..."
    
    # Stop any running containers using our ports
    docker ps --format "table {{.Names}}\t{{.Ports}}" | grep -E "(3000|3001|3002|5432|6379)" | awk '{print $1}' | while read container; do
        if [ ! -z "$container" ] && [ "$container" != "NAMES" ]; then
            echo "Stopping container: $container"
            docker stop "$container" 2>/dev/null || true
        fi
    done
    
    # Stop any docker-compose services
    if [ -f "docker-compose.yml" ]; then
        docker-compose down 2>/dev/null || true
    fi
    
    if [ -f "docker-compose.prod.yml" ]; then
        docker-compose -f docker-compose.prod.yml down 2>/dev/null || true
    fi
    
    if [ -f "cnarSuguApi/docker-compose.monitoring.yml" ]; then
        docker-compose -f cnarSuguApi/docker-compose.monitoring.yml down 2>/dev/null || true
    fi
}

# Check required ports
echo "📋 Checking required ports..."

PORTS_OK=true

# Web frontend (port 3000)
if ! check_port 3000 "Web Frontend"; then
    PORTS_OK=false
fi

# API backend (port 3001)
if ! check_port 3001 "API Backend"; then
    PORTS_OK=false
fi

# Grafana (port 3002)
if ! check_port 3002 "Grafana"; then
    PORTS_OK=false
fi

# PostgreSQL (port 5432)
if ! check_port 5432 "PostgreSQL"; then
    PORTS_OK=false
fi

# Redis (port 6379)
if ! check_port 6379 "Redis"; then
    PORTS_OK=false
fi

if [ "$PORTS_OK" = true ]; then
    echo "✅ All ports are available!"
    exit 0
fi

echo ""
echo "❌ Port conflicts detected!"
echo ""
echo "Options to resolve:"
echo "1) Stop conflicting services automatically"
echo "2) Use alternative ports"
echo "3) Show conflicting processes"
echo "4) Exit and resolve manually"

read -p "Choose option (1-4): " choice

case $choice in
    1)
        stop_conflicting_services
        echo "✅ Conflicting services stopped. You can now deploy."
        ;;
    2)
        echo "💡 Alternative port suggestions:"
        find_alternative_port 3000 "Web Frontend"
        find_alternative_port 3001 "API Backend" 
        find_alternative_port 3002 "Grafana"
        find_alternative_port 5432 "PostgreSQL"
        find_alternative_port 6379 "Redis"
        echo ""
        echo "Update your docker-compose files with these ports."
        ;;
    3)
        echo "🔍 Processes using conflicting ports:"
        for port in 3000 3001 3002 5432 6379; do
            echo "Port $port:"
            netstat -tuln 2>/dev/null | grep ":$port " || echo "  No processes found"
            lsof -i :$port 2>/dev/null || echo "  No processes found"
            echo ""
        done
        ;;
    4)
        echo "👋 Exiting. Please resolve port conflicts manually."
        exit 1
        ;;
    *)
        echo "❌ Invalid choice. Exiting."
        exit 1
        ;;
esac