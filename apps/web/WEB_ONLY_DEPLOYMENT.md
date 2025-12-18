# 🌐 CNAR Sugu Web Frontend - Standalone Deployment

This guide covers deploying only the web frontend as a separate service using Docker registry.

## 🎯 Overview

The web frontend is deployed as a standalone service that connects to an external API. This approach allows:

- ✅ Independent scaling of frontend and backend
- ✅ Separate deployment cycles
- ✅ Different hosting providers for each service
- ✅ Simplified CI/CD for frontend-only changes

## 🏗️ Architecture

```
┌─────────────────┐    HTTPS    ┌─────────────────┐
│   Web Frontend  │────────────▶│   External API  │
│   (This Deploy) │             │   (Separate)    │
└─────────────────┘             └─────────────────┘
         │
         ▼
┌─────────────────┐
│  Docker Registry│
│  (Image Store)  │
└─────────────────┘
```

## 🚀 Quick Deployment

### 1. Configure Environment
```bash
# Copy web-only environment template
cp apps/web/.env.web-only apps/web/.env.production

# Edit with your values
nano apps/web/.env.production
```

### 2. Build and Deploy
```bash
# Build and push to registry
./scripts/build-web-registry.sh

# Deploy locally
./scripts/deploy-web-only.sh local

# Or deploy to Dokploy
./scripts/deploy-web-only.sh dokploy
```

## 📋 Required Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | External API endpoint | `https://api.cnarsugu.com/api/v2` |
| `DOMAIN` | Your web domain | `cnarsugu.com` |
| `NEXT_PUBLIC_PAYMENT_CALLBACK_URL` | Payment callback URL | `https://cnarsugu.com/payment/callback` |
| `REGISTRY_URL` | Docker registry URL | `localhost:5000` |

### API Requirements

Your external API must:
- ✅ Support CORS for your domain
- ✅ Have health check endpoint at `/health`
- ✅ Use HTTPS in production
- ✅ Handle authentication properly

## 🐳 Docker Registry Setup

### Local Registry
```bash
# Start local registry
./docker-registry/setup-registry.sh

# Build and push
./scripts/build-web-registry.sh
```

### External Registry
```bash
# Configure registry URL
export REGISTRY_URL=your-registry.com

# Login to registry
docker login $REGISTRY_URL

# Build and push
./scripts/build-web-registry.sh
```

## 🔧 Dokploy Deployment

### 1. Prepare Image
```bash
# Build and push to your registry
REGISTRY_URL=your-registry.com ./scripts/build-web-registry.sh
```

### 2. Create Dokploy Application
1. **Application Type**: Docker Compose
2. **Compose File**: Upload `apps/web/docker-compose.dokploy.yml`
3. **Environment Variables**:
   ```env
   REGISTRY_URL=your-registry.com
   VERSION=latest
   DOMAIN=your-domain.com
   NEXT_PUBLIC_API_URL=https://your-api.com/api/v2
   NEXT_PUBLIC_PAYMENT_CALLBACK_URL=https://your-domain.com/payment/callback
   ```

### 3. Deploy
- Click "Deploy" in Dokploy dashboard
- Monitor build logs
- Verify deployment at your domain

## 📊 Monitoring & Health Checks

### Health Endpoints
- **Web Health**: `https://your-domain.com/health`
- **API Health**: `https://your-api.com/api/v2/health`

### Monitoring Commands
```bash
# Check container status
docker ps | grep cnarsugu-web

# View logs
docker logs cnarsugu-web

# Check resource usage
docker stats cnarsugu-web
```

## 🔄 Updates & Maintenance

### Update Deployment
```bash
# Build new version
VERSION=v1.1.0 ./scripts/build-web-registry.sh

# Update Dokploy environment variable
# VERSION=v1.1.0

# Redeploy in Dokploy dashboard
```

### Rollback
```bash
# Rollback to previous version
VERSION=v1.0.0 ./scripts/deploy-web-only.sh dokploy
```

## 🛠️ Development Workflow

### Local Development
```bash
# Start development server
pnpm run dev --filter=@cnarsugu/web

# Build for testing
pnpm run build --filter=@cnarsugu/web
```

### CI/CD Pipeline
The GitHub Actions workflow automatically:
1. ✅ Tests code on PR/push
2. ✅ Builds Docker image
3. ✅ Pushes to registry
4. ✅ Creates deployment-ready tags

## 🔒 Security Considerations

### Environment Variables
- Never commit `.env` files
- Use Dokploy's environment management
- Rotate secrets regularly

### API Security
- Ensure API uses HTTPS
- Configure proper CORS headers
- Implement rate limiting
- Use secure authentication

### Image Security
- Regular base image updates
- Scan images for vulnerabilities
- Use minimal Alpine images
- Remove development dependencies

## 📈 Performance Optimization

### Build Optimization
- Multi-stage Docker builds
- Dependency caching
- Static asset optimization
- Bundle size analysis

### Runtime Optimization
- Next.js standalone output
- Image optimization enabled
- Compression enabled
- CDN integration ready

## 🆘 Troubleshooting

### Common Issues

#### 1. API Connection Errors
```bash
# Check API URL configuration
echo $NEXT_PUBLIC_API_URL

# Test API connectivity
curl -f $NEXT_PUBLIC_API_URL/health
```

#### 2. Registry Push Failures
```bash
# Check registry connectivity
curl -f $REGISTRY_URL/v2/

# Login to registry
docker login $REGISTRY_URL
```

#### 3. Deployment Failures
```bash
# Check container logs
docker logs cnarsugu-web

# Check health endpoint
curl -f https://your-domain.com/health
```

### Debug Commands
```bash
# Run container interactively
docker run -it --rm $REGISTRY_URL/cnarsugu-web:latest sh

# Check environment variables
docker exec cnarsugu-web env | grep NEXT_PUBLIC

# Test local build
docker run -p 3000:3000 $REGISTRY_URL/cnarsugu-web:latest
```

## 📚 File Structure

```
apps/web/
├── Dockerfile                    # Multi-stage build
├── docker-compose.web.yml       # Local deployment
├── docker-compose.dokploy.yml   # Dokploy deployment
├── .env.web-only                # Environment template
└── WEB_ONLY_DEPLOYMENT.md       # This guide

scripts/
├── build-web-registry.sh        # Build & push script
└── deploy-web-only.sh           # Deployment script

.github/workflows/
└── build-web-registry.yml       # CI/CD pipeline
```

## ✅ Deployment Checklist

- [ ] External API is running and accessible
- [ ] Environment variables configured
- [ ] Docker registry accessible
- [ ] Domain DNS configured
- [ ] SSL certificates configured (Dokploy handles this)
- [ ] Image built and pushed to registry
- [ ] Health checks passing
- [ ] Monitoring configured

Your web frontend is now ready for standalone deployment! 🚀