#!/bin/bash

# Docker Registry Management Script

set -e

REGISTRY_URL=${REGISTRY_URL:-"localhost:5000"}
PROJECT_NAME="cnarsugu"

# Function to show usage
show_usage() {
    echo "Usage: $0 [COMMAND] [OPTIONS]"
    echo ""
    echo "Commands:"
    echo "  list                List all images in registry"
    echo "  tags <image>        List tags for specific image"
    echo "  delete <image:tag>  Delete specific image tag"
    echo "  cleanup             Remove old image versions (keep last 5)"
    echo "  status              Show registry status"
    echo "  login               Login to registry"
    echo "  pull <image:tag>    Pull image from registry"
    echo ""
    echo "Examples:"
    echo "  $0 list"
    echo "  $0 tags cnarsugu-web"
    echo "  $0 delete cnarsugu-web:v1.0.0"
    echo "  $0 pull cnarsugu-web:latest"
}

# Function to list all images
list_images() {
    echo "📋 Images in registry ($REGISTRY_URL):"
    curl -s -X GET "http://$REGISTRY_URL/v2/_catalog" | jq -r '.repositories[]' 2>/dev/null || {
        echo "❌ Failed to connect to registry or jq not installed"
        echo "Raw response:"
        curl -s -X GET "http://$REGISTRY_URL/v2/_catalog"
    }
}

# Function to list tags for an image
list_tags() {
    local image=$1
    if [ -z "$image" ]; then
        echo "❌ Please specify an image name"
        exit 1
    fi
    
    echo "🏷️  Tags for $image:"
    curl -s -X GET "http://$REGISTRY_URL/v2/$image/tags/list" | jq -r '.tags[]?' 2>/dev/null || {
        echo "❌ Failed to get tags for $image"
        echo "Raw response:"
        curl -s -X GET "http://$REGISTRY_URL/v2/$image/tags/list"
    }
}

# Function to delete an image tag
delete_image() {
    local image_tag=$1
    if [ -z "$image_tag" ]; then
        echo "❌ Please specify image:tag to delete"
        exit 1
    fi
    
    local image=$(echo "$image_tag" | cut -d':' -f1)
    local tag=$(echo "$image_tag" | cut -d':' -f2)
    
    echo "🗑️  Deleting $image:$tag..."
    
    # Get manifest digest
    local digest=$(curl -s -H "Accept: application/vnd.docker.distribution.manifest.v2+json" \
        -X GET "http://$REGISTRY_URL/v2/$image/manifests/$tag" \
        -I | grep -i docker-content-digest | cut -d' ' -f2 | tr -d '\r')
    
    if [ -n "$digest" ]; then
        curl -X DELETE "http://$REGISTRY_URL/v2/$image/manifests/$digest"
        echo "✅ Deleted $image:$tag"
    else
        echo "❌ Failed to get digest for $image:$tag"
    fi
}

# Function to cleanup old images
cleanup_images() {
    echo "🧹 Cleaning up old image versions..."
    echo "This will keep the last 5 versions of each image"
    read -p "Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Cleanup cancelled"
        exit 0
    fi
    
    # Get all repositories
    local repos=$(curl -s -X GET "http://$REGISTRY_URL/v2/_catalog" | jq -r '.repositories[]?' 2>/dev/null)
    
    for repo in $repos; do
        echo "Processing $repo..."
        local tags=$(curl -s -X GET "http://$REGISTRY_URL/v2/$repo/tags/list" | jq -r '.tags[]?' 2>/dev/null | sort -V)
        local tag_count=$(echo "$tags" | wc -l)
        
        if [ "$tag_count" -gt 5 ]; then
            local tags_to_delete=$(echo "$tags" | head -n $((tag_count - 5)))
            for tag in $tags_to_delete; do
                if [ "$tag" != "latest" ]; then
                    echo "Deleting old tag: $repo:$tag"
                    delete_image "$repo:$tag"
                fi
            done
        fi
    done
    
    echo "✅ Cleanup completed"
}

# Function to show registry status
show_status() {
    echo "📊 Registry Status:"
    echo "URL: $REGISTRY_URL"
    
    if curl -s "http://$REGISTRY_URL/v2/" > /dev/null; then
        echo "Status: ✅ Online"
        
        local image_count=$(curl -s -X GET "http://$REGISTRY_URL/v2/_catalog" | jq -r '.repositories | length' 2>/dev/null || echo "Unknown")
        echo "Images: $image_count"
        
        # Check disk usage if running locally
        if [ "$REGISTRY_URL" = "localhost:5000" ]; then
            local disk_usage=$(docker system df --format "table {{.Type}}\t{{.Size}}" | grep Images | awk '{print $2}' || echo "Unknown")
            echo "Disk Usage: $disk_usage"
        fi
    else
        echo "Status: ❌ Offline"
    fi
}

# Function to login to registry
login_registry() {
    echo "🔐 Logging into registry..."
    read -p "Username: " username
    read -s -p "Password: " password
    echo
    
    echo "$password" | docker login "$REGISTRY_URL" -u "$username" --password-stdin
    echo "✅ Logged in successfully"
}

# Function to pull image
pull_image() {
    local image_tag=$1
    if [ -z "$image_tag" ]; then
        echo "❌ Please specify image:tag to pull"
        exit 1
    fi
    
    echo "📥 Pulling $REGISTRY_URL/$image_tag..."
    docker pull "$REGISTRY_URL/$image_tag"
    echo "✅ Pulled successfully"
}

# Main script logic
case "$1" in
    "list")
        list_images
        ;;
    "tags")
        list_tags "$2"
        ;;
    "delete")
        delete_image "$2"
        ;;
    "cleanup")
        cleanup_images
        ;;
    "status")
        show_status
        ;;
    "login")
        login_registry
        ;;
    "pull")
        pull_image "$2"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac