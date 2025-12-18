# CNAR Sugu Web Frontend Deployment Guide

This guide covers deploying the CNAR Sugu web frontend to production.

## Prerequisites

- Docker and Docker Compose installed
- Node.js 18+ and pnpm 8+ (for local builds)
- SSL certificates (for production)
- Domain name configured

## Quick Start

### Development Deployment

```bash
# Build and run in development mode
docker-compose up --build
```

### Production Deployment

1. **Configure Environment**
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your production values
   ```

2. **Set up SSL Certificates**
   ```bash
   mkdir ssl
   # Copy your SSL certificates to ssl/cert.pem and ssl/key.pem
   ```

3. **Deploy**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh production
   ```

## Manual Build Process

If you prefer to build manually:

```bash
# Install dependencies
pnpm install

# Build all packages
pnpm run build

# Build web app specifically
pnpm run build --filter=@cnarsugu/web

# Start production server
cd apps/web
pnpm start
```

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `https://api.yourdomain.com/api/v2` |
| `DB_PASSWORD` | Database password | `secure_password_123` |
| `DOMAIN` | Your domain name | `yourdomain.com` |

### Optional Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_GA_ID` | Google Analytics ID | - |
| `NEXT_PUBLIC_HOTJAR_ID` | Hotjar tracking ID | - |
| `SENTRY_DSN` | Sentry error tracking | - |

## Docker Services

The deployment includes:

- **web**: Next.js frontend application
- **api**: NestJS backend API
- **db**: PostgreSQL database
- **redis**: Redis cache
- **nginx**: Reverse proxy (production only)

## Health Checks

After deployment, verify services are running:

```bash
# Check web app
curl http://localhost:3000/health

# Check API
curl http://localhost:3001/health

# View service status
docker-compose ps
```

## SSL Configuration

For production with HTTPS:

1. Obtain SSL certificates from your provider
2. Place certificates in `ssl/` directory:
   - `ssl/cert.pem` - Certificate file
   - `ssl/key.pem` - Private key file
3. Update `nginx.conf` with your domain name

## Monitoring and Logs

### View Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs web
docker-compose logs api
```

### Monitor Resources
```bash
# View resource usage
docker stats

# View running containers
docker ps
```

## Backup and Recovery

### Database Backup
```bash
# Create backup
docker-compose exec db pg_dump -U postgres cnarsugu > backup.sql

# Restore backup
docker-compose exec -T db psql -U postgres cnarsugu < backup.sql
```

### Application Data
- Static files are stored in Docker volumes
- User uploads should be backed up separately
- Configuration files should be version controlled

## Troubleshooting

### Common Issues

1. **Port conflicts**
   - Check if ports 80, 443, 3000, 3001, 5432 are available
   - Modify port mappings in docker-compose files if needed

2. **SSL certificate errors**
   - Verify certificate files exist and are readable
   - Check certificate validity and domain matching

3. **Database connection issues**
   - Verify database credentials in environment variables
   - Check if database service is running: `docker-compose ps db`

4. **Build failures**
   - Clear Docker cache: `docker system prune -a`
   - Rebuild without cache: `docker-compose build --no-cache`

### Performance Optimization

1. **Enable caching**
   - Redis is configured for session and API caching
   - Static assets are cached by Nginx

2. **Database optimization**
   - Regular database maintenance
   - Monitor query performance
   - Consider read replicas for high traffic

3. **CDN integration**
   - Configure CDN for static assets
   - Update `next.config.ts` with CDN URLs

## Security Considerations

- SSL/TLS encryption enabled
- Security headers configured in Nginx
- Rate limiting implemented
- Environment variables for sensitive data
- Regular security updates for base images

## Scaling

For high-traffic scenarios:

1. **Horizontal scaling**
   - Run multiple web app instances
   - Use load balancer (Nginx or external)

2. **Database scaling**
   - Configure read replicas
   - Implement connection pooling

3. **Caching strategy**
   - Redis cluster for distributed caching
   - CDN for static content

## Support

For deployment issues:
1. Check logs: `docker-compose logs`
2. Verify environment configuration
3. Test individual services
4. Review this documentation

## Updates and Maintenance

### Updating the Application
```bash
# Pull latest code
git pull origin main

# Rebuild and deploy
./scripts/deploy.sh production
```

### Regular Maintenance
- Monitor disk space and logs
- Update SSL certificates before expiry
- Regular security updates
- Database maintenance and backups