# 🚀 CNAR Sugu Dokploy Deployment Guide

This guide covers deploying CNAR Sugu to Dokploy with proper port management and configuration.

## 🔧 Pre-Deployment Setup

### 1. Fix Port Conflicts

The error you encountered is due to Grafana using port 3000, which conflicts with the web frontend.

```bash
# Run the port conflict resolution script
chmod +x scripts/fix-port-conflicts.sh
./scripts/fix-port-conflicts.sh
```

### 2. Configure Environment

```bash
# Copy Dokploy environment template
cp .env.dokploy .env

# Edit with your actual values
nano .env
```

Required environment variables:
- `DOMAIN` - Your domain name
- `DB_PASSWORD` - Secure database password
- `JWT_SECRET` - JWT signing secret
- `ENCRYPTION_KEY` - Data encryption key

## 📦 Dokploy Project Setup

### 1. Create New Project in Dokploy

1. Login to your Dokploy dashboard
2. Click "Create Project"
3. Choose "Docker Compose" deployment type
4. Set project name: `cnarsugu`

### 2. Upload Docker Compose Configuration

Use the Dokploy-specific compose file:

```yaml
# Use docker-compose.dokploy.yml content
```

### 3. Configure Environment Variables

In Dokploy dashboard, add these environment variables:

```env
DOMAIN=your-domain.com
DB_PASSWORD=your_secure_password
JWT_SECRET=your_jwt_secret
ENCRYPTION_KEY=your_encryption_key
NEXT_PUBLIC_API_URL=https://your-domain.com/api/v2
```

## 🔄 Port Configuration

### Current Port Allocation

| Service | Internal Port | External Port | Purpose |
|---------|---------------|---------------|---------|
| Web Frontend | 3000 | 80/443 | Main web app |
| API Backend | 3001 | - | Internal API |
| PostgreSQL | 5432 | - | Database |
| Redis | 6379 | - | Cache |
| Grafana | 3000 | 3002 | Monitoring (if enabled) |

### Traefik Labels

The Dokploy compose file includes Traefik labels for automatic SSL and routing:

```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.web.rule=Host(`your-domain.com`)"
  - "traefik.http.routers.web.entrypoints=websecure"
  - "traefik.http.routers.web.tls.certresolver=letsencrypt"
```

## 🚀 Deployment Steps

### 1. Prepare Repository

```bash
# Ensure all files are committed
git add .
git commit -m "Prepare for Dokploy deployment"
git push origin main
```

### 2. Deploy via Dokploy

1. **Create Application**:
   - Type: Docker Compose
   - Repository: Your Git repository
   - Branch: main
   - Compose file: `docker-compose.dokploy.yml`

2. **Configure Environment**:
   - Add all required environment variables
   - Enable automatic SSL (Let's Encrypt)
   - Set custom domain

3. **Deploy**:
   - Click "Deploy"
   - Monitor build logs
   - Wait for deployment completion

### 3. Verify Deployment

```bash
# Check if services are running
curl https://your-domain.com/health

# Check API
curl https://your-domain.com/api/v2/health
```

## 🔧 Troubleshooting

### Port Conflict Issues

If you get port allocation errors:

1. **Check running containers**:
   ```bash
   docker ps
   ```

2. **Stop conflicting services**:
   ```bash
   docker stop $(docker ps -q)
   ```

3. **Use the fix script**:
   ```bash
   ./scripts/fix-port-conflicts.sh
   ```

### Common Issues

#### 1. Grafana Port Conflict
**Error**: `Bind for :::3000 failed: port is already allocated`

**Solution**: Grafana port changed to 3002 in monitoring config.

#### 2. Database Connection Issues
**Error**: Database connection refused

**Solution**: 
- Check `DB_PASSWORD` environment variable
- Verify database service is running
- Check network connectivity

#### 3. Build Failures
**Error**: Docker build fails

**Solution**:
```bash
# Clear Docker cache
docker system prune -a

# Rebuild without cache
docker-compose build --no-cache
```

### Monitoring Access

If you enable monitoring:
- **Grafana**: `https://your-domain.com:3002`
- **Prometheus**: `https://your-domain.com:9090`

Default Grafana credentials:
- Username: `admin`
- Password: `admin` (change after first login)

## 📊 Health Checks

The deployment includes health checks for all services:

```bash
# Web app health
curl https://your-domain.com/health

# API health  
curl https://your-domain.com/api/v2/health

# Database health (internal)
docker exec <db-container> pg_isready -U postgres

# Redis health (internal)
docker exec <redis-container> redis-cli ping
```

## 🔒 Security Considerations

### SSL/TLS
- Automatic SSL via Let's Encrypt
- HTTPS redirects enabled
- Security headers configured

### Environment Variables
- Never commit `.env` files
- Use Dokploy's environment variable management
- Rotate secrets regularly

### Database Security
- Strong passwords required
- Network isolation via Docker networks
- Regular backups recommended

## 📈 Performance Optimization

### Caching
- Redis configured for session caching
- Static asset caching via Traefik
- Database query optimization

### Scaling
- Horizontal scaling via Dokploy
- Load balancing with Traefik
- Database read replicas (manual setup)

## 🔄 Updates and Maintenance

### Updating the Application
1. Push changes to Git repository
2. Trigger redeploy in Dokploy dashboard
3. Monitor deployment logs
4. Verify functionality

### Backup Strategy
```bash
# Database backup
docker exec <db-container> pg_dump -U postgres cnarsugu > backup.sql

# Environment backup
cp .env .env.backup
```

### Log Management
```bash
# View application logs
docker logs <container-name>

# View all service logs
docker-compose logs -f
```

## 🆘 Support

### Getting Help
1. Check Dokploy documentation
2. Review deployment logs
3. Use health check endpoints
4. Check this troubleshooting guide

### Emergency Procedures
1. **Rollback**: Use Dokploy's rollback feature
2. **Scale down**: Reduce resource usage
3. **Emergency stop**: Stop all services via Dokploy

---

## ✅ Deployment Checklist

- [ ] Port conflicts resolved
- [ ] Environment variables configured
- [ ] Domain DNS configured
- [ ] SSL certificates working
- [ ] All services healthy
- [ ] Health checks passing
- [ ] Monitoring configured (optional)
- [ ] Backup strategy in place

Your CNAR Sugu application should now be successfully deployed on Dokploy! 🎉