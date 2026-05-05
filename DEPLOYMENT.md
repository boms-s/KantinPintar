# KantinPintar - Deployment Guide

## Deployment Overview

This guide covers deploying KantinPintar to production on various platforms.

---

## Pre-Deployment Checklist

- [ ] All tests passing
- [ ] `.env` secrets configured properly
- [ ] Database backups configured
- [ ] JWT_SECRET is strong (min 32 characters)
- [ ] Database credentials secured
- [ ] CORS configured for frontend domain
- [ ] Rate limiting enabled
- [ ] Error logging configured
- [ ] Performance optimizations applied
- [ ] Database migrations up-to-date

---

## Deployment Platforms

## Option 1: Vercel (Recommended for Next.js)

### Prerequisites
- Vercel account (https://vercel.com)
- Git repository (GitHub, GitLab, Bitbucket)

### Step 1: Push Code to Repository
```bash
git add .
git commit -m "Deploy KantinPintar"
git push origin main
```

### Step 2: Create Vercel Project
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Select "Next.js" framework
4. Click "Deploy"

### Step 3: Configure Environment Variables
In Vercel Dashboard → Settings → Environment Variables:

```
DATABASE_URL = mysql://user:password@db-host:3306/kantinpintar
JWT_SECRET = your-production-secret-key-32-chars-minimum
NODE_ENV = production
JWT_EXPIRATION = 7d
```

### Step 4: Production Database Setup
Use managed MariaDB:
- **Planetscale** (MySQL-compatible): https://planetscale.com
- **AWS RDS for MariaDB**: https://aws.amazon.com/rds/
- **DigitalOcean Managed Databases**: https://www.digitalocean.com/products/managed-databases
- **Azure Database for MySQL**: https://azure.microsoft.com/en-us/services/mysql/

Example PlanetScale setup:
```
DATABASE_URL="mysql://root:pscale_password@aws.connect.psdb.cloud/kantinpintar?sslaccept=strict"
```

### Step 5: Deployment
- Vercel automatically deploys on git push
- Runs `npm run build` and `npm start`
- Database migrations run before deployment

---

## Option 2: Docker Container Deployment

### Step 1: Create Dockerfile

Create `Dockerfile` in project root:
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Production stage
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Build Next.js
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Step 2: Create docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: mysql://root:password@mariadb:3306/kantinpintar
      JWT_SECRET: your-secret-key
      NODE_ENV: production
    depends_on:
      - mariadb
    networks:
      - kantinpintar-network

  mariadb:
    image: mariadb:latest
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: password
      MYSQL_DATABASE: kantinpintar
    volumes:
      - mariadb_data:/var/lib/mysql
    networks:
      - kantinpintar-network

volumes:
  mariadb_data:

networks:
  kantinpintar-network:
    driver: bridge
```

### Step 3: Build & Run Docker
```bash
# Build image
docker build -t kantinpintar:latest .

# Run container
docker-compose up -d

# Check logs
docker-compose logs -f app
```

---

## Option 3: Traditional VPS (AWS EC2, DigitalOcean, Linode)

### Prerequisites
- Ubuntu 20.04 LTS or similar
- SSH access to server
- Domain name (optional)

### Step 1: Initial Server Setup
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -sL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MariaDB
sudo apt install -y mariadb-server
sudo mysql_secure_installation

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 2: Clone Repository
```bash
cd /var/www
sudo git clone <your-repo-url> kantinpintar
cd kantinpintar
sudo chown -R $USER:$USER .
```

### Step 3: Setup Application
```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with production values
nano .env

# Build Next.js
npm run build

# Setup database
mysql -u root -p < init-db.sql
npm run db:migrate
```

### Step 4: Configure PM2
Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'kantinpintar',
    script: './node_modules/.bin/next',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    instances: 'max',
    exec_mode: 'cluster',
    error_file: './logs/err.log',
    out_file: './logs/out.log',
  }],
};
```

```bash
# Start with PM2
pm2 start ecosystem.config.js

# Setup auto-restart on reboot
pm2 startup
pm2 save
```

### Step 5: Configure Nginx
Edit `/etc/nginx/sites-available/default`:
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API endpoints
    location /api {
        proxy_pass http://localhost:3000/api;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
    }
}
```

```bash
# Test and reload Nginx
sudo nginx -t
sudo systemctl reload nginx
```

### Step 6: SSL Certificate (Let's Encrypt)
```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## Option 4: AWS Lambda with API Gateway

### Prerequisites
- AWS Account
- AWS CLI configured
- SAM CLI installed

### Create SAM Template
Create `template.yaml`:
```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31

Globals:
  Function:
    Timeout: 30
    MemorySize: 512
    Environment:
      Variables:
        DATABASE_URL: !Sub '{{resolve:secretsmanager:KantinPintar:SecretString:DATABASE_URL}}'
        JWT_SECRET: !Sub '{{resolve:secretsmanager:KantinPintar:SecretString:JWT_SECRET}}'

Resources:
  KantinPinjarFunction:
    Type: AWS::Serverless::Function
    Properties:
      Handler: dist/index.handler
      Runtime: nodejs18.x
      CodeUri: .
      Events:
        ApiEvent:
          Type: Api
          Properties:
            RestApiId: !Ref KantinPinjarApi
            Path: /{proxy+}
            Method: ANY

  KantinPinjarApi:
    Type: AWS::ApiGateway::RestApi
    Properties:
      Name: KantinPinjar-API

Outputs:
  ApiEndpoint:
    Value: !Sub 'https://${KantinPinjarApi}.execute-api.${AWS::Region}.amazonaws.com/Prod'
```

### Deploy
```bash
sam build
sam deploy --guided
```

---

## Environment Variables (Production)

Create separate `.env.production` file:

```env
# Database - Use production-grade managed database
DATABASE_URL="mysql://prod_user:strong_password@prod.db.host:3306/kantinpintar"

# JWT Configuration
JWT_SECRET="generate-strong-random-key-min-32-chars-jWr9kL2mN5pQxZ"
JWT_EXPIRATION="7d"

# Application
NODE_ENV="production"
PORT="3000"
NEXT_PUBLIC_API_URL="https://api.your-domain.com"

# Disable Prisma logging in production
DATABASE_URL_PRODUCTION="mysql://..."

# Optional: Error tracking
SENTRY_DSN="https://your-sentry-key@sentry.io/project-id"

# Optional: Analytics
GOOGLE_ANALYTICS_ID="UA-XXXXXXXXX-X"
```

---

## Database Management (Production)

### Regular Backups
```bash
# Backup database daily
0 2 * * * mysqldump -u root -p'password' kantinpintar | gzip > /backups/db-$(date +\%Y\%m\%d).sql.gz

# Backup weekly to S3
0 3 0 * * * aws s3 cp /backups/db-$(date +\%Y\%m\%d).sql.gz s3://my-backup-bucket/

# Keep only last 30 days
find /backups -name "db-*.sql.gz" -mtime +30 -delete
```

### Connection Pooling
For high traffic, add connection pooling:
```env
DATABASE_URL="mysql://user:password@host:3306/kantinpintar?connectionLimit=10&max=20"
```

### Monitoring Queries
```bash
# Enable slow query log in MariaDB
[mysqld]
slow_query_log = 1
slow_query_log_file = /var/log/mysql/slow.log
long_query_time = 2
```

---

## Monitoring & Logging

### Application Logs
```bash
# View PM2 logs
pm2 logs kantinpintar

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Set Up Error Tracking
```bash
# Install Sentry
npm install @sentry/nextjs

# Configure in next.config.ts
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0,
});
```

### Health Check Endpoint
Add to `app/api/health/route.ts`:
```typescript
export async function GET() {
  return NextResponse.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime(),
  });
}
```

Monitor with: `curl https://api.your-domain.com/api/health`

---

## Performance Optimization

### Enable Compression
```typescript
// next.config.ts
export default {
  compress: true,
};
```

### Cache Headers
```typescript
// app/api/public/menus/route.ts
response.headers.set('Cache-Control', 'public, max-age=300'); // 5 minutes
```

### CDN Integration
Use Cloudflare or AWS CloudFront:
```
DNS: your-domain.com → Cloudflare → API
Static assets cached globally
API responses cached per cache headers
```

---

## Post-Deployment

1. **Verify API**: `curl https://api.your-domain.com/api/health`
2. **Run Migrations**: `npm run db:migrate` (on first deploy)
3. **Seed Data**: `npm run db:seed` (optional, for testing)
4. **Test Endpoints**: Use Postman to test all endpoints
5. **Monitor Logs**: Watch application and database logs
6. **Setup Monitoring**: Configure alerts for errors/downtime

---

## Scaling Strategy

### Horizontal Scaling
```
Load Balancer (Nginx/HAProxy)
    ├── App Server 1 (PM2 cluster mode)
    ├── App Server 2 (PM2 cluster mode)
    └── App Server 3 (PM2 cluster mode)
         ↓
    MariaDB Primary (master)
    MariaDB Replica (read-only)
    Cache Layer (Redis)
```

### Configuration
```nginx
upstream backend {
    server app1:3000;
    server app2:3000;
    server app3:3000;
}

server {
    listen 80;
    server_name api.your-domain.com;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## Troubleshooting Deployment

### Application not starting
```bash
pm2 logs kantinpintar
npm run build  # Check for build errors
node -e "console.log(process.version)"  # Check Node version
```

### Database connection failing
```bash
# Test connection
mysql -h prod.db.host -u prod_user -p kantinpintar -e "SELECT 1;"

# Check security groups / firewall
telnet prod.db.host 3306
```

### High CPU/Memory usage
```bash
# Monitor with PM2
pm2 monit

# Check database queries
mysql> SHOW PROCESSLIST;

# Scale horizontally with load balancer
```

---

## Security Checklist

- [ ] JWT_SECRET is strong (32+ characters)
- [ ] Database password is secure
- [ ] HTTPS/SSL configured
- [ ] CORS whitelist configured
- [ ] Rate limiting enabled
- [ ] SQL injection protection (Prisma handles)
- [ ] CSRF tokens if needed
- [ ] Regular security patches
- [ ] Database backups encrypted
- [ ] Access logs monitored
- [ ] No sensitive data in logs

---

## Further Reading

- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Vercel Docs**: https://vercel.com/docs
- **MariaDB Replication**: https://mariadb.com/docs/
- **Nginx Load Balancing**: https://nginx.org/en/docs/
- **AWS Deployment**: https://docs.aws.amazon.com/
