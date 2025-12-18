#!/bin/bash

# Fix Windows symlink build issues

set -e

echo "🔧 Fixing Windows Build Issues"
echo "=============================="

echo "The EPERM symlink error occurs on Windows when:"
echo "1. Running without administrator privileges"
echo "2. Windows symlink policies are restrictive"
echo "3. Next.js standalone output tries to create symlinks"
echo ""

echo "Choose a solution:"
echo "1) Use Windows-compatible Dockerfile (no standalone output)"
echo "2) Disable standalone output in next.config.ts"
echo "3) Build without Docker (local build)"
echo "4) Enable Windows Developer Mode (requires admin)"
echo "5) Use WSL2 for building"

read -p "Enter your choice (1-5): " choice

case $choice in
    1)
        echo "🔧 Using Windows-compatible Dockerfile..."
        echo "💡 Build with: docker build -f apps/web/Dockerfile.windows -t cnarsugu-web ."
        ;;
    2)
        echo "🔧 Disabling standalone output..."
        cd apps/web
        if [ -f "next.config.ts" ]; then
            # Comment out standalone output
            sed -i.bak "s/output: 'standalone',/\/\/ output: 'standalone',/" next.config.ts
            echo "✅ Standalone output disabled in next.config.ts"
            echo "💡 Build with: pnpm run build"
        else
            echo "❌ next.config.ts not found"
        fi
        cd ../..
        ;;
    3)
        echo "🔧 Building locally without Docker..."
        cd apps/web
        echo "📦 Installing dependencies..."
        pnpm install --frozen-lockfile
        echo "🏗️  Building application..."
        pnpm run build
        echo "✅ Local build completed"
        cd ../..
        ;;
    4)
        echo "🔧 Enable Windows Developer Mode:"
        echo "   1. Open Windows Settings"
        echo "   2. Go to Update & Security > For developers"
        echo "   3. Enable 'Developer Mode'"
        echo "   4. Restart your computer"
        echo "   5. Try building again"
        ;;
    5)
        echo "🔧 Using WSL2 for building:"
        echo "   1. Install WSL2 if not already installed"
        echo "   2. Open WSL2 terminal"
        echo "   3. Navigate to your project directory"
        echo "   4. Run: docker build -f apps/web/Dockerfile -t cnarsugu-web ."
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "💡 Alternative approaches:"
echo "   - Use GitHub Actions for building"
echo "   - Use Docker Desktop with WSL2 backend"
echo "   - Build on Linux/macOS system"
echo "   - Use cloud build services"