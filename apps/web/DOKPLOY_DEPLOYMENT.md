# 🚀 Dokploy Deployment Guide - CNAR Sugu Web Frontend

## 🔥 IMMEDIATE FIX for Your Current Error

The error you're seeing is because Dokploy can't handle the monorepo build context properly. Here's the **immediate solution**:

### Quick Fix: Use Pre-built Image

1. **Change your Dokploy deployment to use a pre-built image instead of building:**

   In Dokploy, instead of using Docker Compose build, use this compose content:

   ```yaml
   version: '3.8'
   
   services:
     cnarsugu-web:
       image: node:18-alpine
       working_dir: /app
       command: sh -c "
         apk add --no-cache git &&
         git clone https://github.com/yourusername/your-repo.git . &&
         npm install -g pnpm &&
         pnpm install &&
         cd apps/web &&
         pnpm run build &&
         pnpm start
       "
       ports:
         - "3000:3000"
       environment:
         - NODE_ENV=production
         - NEXT_PUBLIC_API_URL=https://cnarsugu.cloud/api
         - NEXT_PUBLIC_APP_NAME=CNAR Sugu
         - NEXT_PUBLIC_PAYMENT_CALLBACK_URL=https://cnarsugu.cloud/payment/callback
       restart: unless-stopped
   ```

2. **Or use the updated docker-compose.web.yml (which now uses pre-built images):**
   ```
   apps/web/docker-compose.web.yml
   ```

### Option 2: Use Pre-built Image

1. **First, build and push your image to a registry:**
   ```bash
   # From your local machine
   cd apps/web
   docker build -f Dockerfile.standalone -t your-registry/cnarsugu-web:latest .
   docker push your-registry/cnarsugu-web:latest
   ```

2. **Then use this compose file in Dokploy:**
   ```
   apps/web/docker-compose.web.yml
   ```

3. **Set these environment variables:**
   ```
   REGISTRY_URL=your-registry
   VERSION=latest
   DOMAIN=your-domain.com
   NEXT_PUBLIC_API_URL=https://cnarsugu.cloud/api
   ```

## Step-by-Step Dokploy Setup

### 1. Create New Application
- Go to Dokploy dashboard
- Click "Create Application"
- Choose "Docker Compose" type
- Name it "cnarsugu-web"

### 2. Upload Compose File
- Upload `apps/web/docker-compose.standalone.yml`
- This file builds directly from the web directory without monorepo issues

### 3. Set Environment Variables
```
NODE_ENV=production
DOMAIN=your-actual-domain.com
NEXT_PUBLIC_API_URL=https://cnarsugu.cloud/api
NEXT_PUBLIC_APP_NAME=CNAR Sugu
NEXT_PUBLIC_APP_VERSION=2.0.0
NEXT_PUBLIC_ENABLE_LEGACY_PRODUCTS=true
NEXT_PUBLIC_ENABLE_DEBUG_MODE=false
NEXT_PUBLIC_PAYMENT_CALLBACK_URL=https://your-domain.com/payment/callback
```

### 4. Deploy
- Click "Deploy"
- Wait for build to complete
- Check logs for any issues

## Troubleshooting

### If Build Fails
1. Check that all files are in the `apps/web` directory
2. Verify environment variables are set correctly
3. Check Dokploy logs for specific error messages

### If Health Check Fails
1. Ensure your domain DNS is pointing to Dokploy
2. Check that port 3000 is accessible
3. Verify SSL certificates are configured

### If API Calls Fail
1. Verify `NEXT_PUBLIC_API_URL` is correct
2. Check CORS settings on your API
3. Ensure API is accessible from the web container

## Files Created for Dokploy

- `Dockerfile.standalone` - Builds without monorepo dependencies
- `docker-compose.standalone.yml` - Simple compose for Dokploy
- `docker-compose.web.yml` - Registry-based deployment (updated)

## Next Steps After Deployment

1. **Test the deployment:**
   ```bash
   curl https://your-domain.com/health
   ```

2. **Monitor logs:**
   - Check Dokploy dashboard for container logs
   - Monitor performance and errors

3. **Set up monitoring:**
   - Configure uptime monitoring
   - Set up error tracking (Sentry)
   - Monitor performance metrics

## Support

If you encounter issues:
1. Check the Dokploy logs first
2. Verify all environment variables are set
3. Test the API connectivity from the container
4. Check DNS and SSL configuration

The standalone approach should resolve the directory and build context issues you're experiencing.