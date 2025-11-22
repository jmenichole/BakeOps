# Setup and Deployment Guide

## Prerequisites

- Node.js 18.x or higher
- PostgreSQL 14.x or higher
- npm or yarn
- Git
- Stripe account
- AI image generation API key (Stable Diffusion, DALL-E, or similar)

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/jmenichole/bake-me-a-cake-bot-.git
cd bake-me-a-cake-bot-
```

### 2. Install Dependencies

#### Frontend (Next.js)

```bash
cd frontend
npm install
```

#### Backend (Express)

```bash
cd backend
npm install
```

### 3. Database Setup

#### Install PostgreSQL

**macOS (Homebrew)**:
```bash
brew install postgresql@14
brew services start postgresql@14
```

**Ubuntu/Debian**:
```bash
sudo apt-get update
sudo apt-get install postgresql-14
sudo systemctl start postgresql
```

**Windows**:
Download and install from [PostgreSQL Downloads](https://www.postgresql.org/download/windows/)

#### Create Database

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE bakemeacake;

# Create user
CREATE USER bakemeacake_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE bakemeacake TO bakemeacake_user;

# Exit
\q
```

#### Run Migrations

```bash
cd database
npm install
npm run migrate
```

### 4. Environment Variables

#### Frontend (.env.local)

Create `frontend/.env.local`:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Stripe Public Key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...

# AI Image Generation
NEXT_PUBLIC_IMAGE_CDN_URL=https://cdn.example.com
```

#### Backend (.env)

Create `backend/.env`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://bakemeacake_user:your_secure_password@localhost:5432/bakemeacake

# JWT Secret
JWT_SECRET=your_very_secure_random_string_here
JWT_EXPIRES_IN=7d

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# AI Image Generation
AI_IMAGE_API_KEY=your_ai_api_key
AI_IMAGE_API_URL=https://api.stability.ai/v1
AI_IMAGE_MODEL=stable-diffusion-xl-1024-v1-0

# Email Service
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your_sendgrid_api_key
EMAIL_FROM=noreply@bakemeacake.com

# Frontend URL
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_MAX_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp
```

### 5. Start Development Servers

#### Terminal 1: Database (if not running as service)

```bash
postgres -D /usr/local/var/postgres
```

#### Terminal 2: Backend

```bash
cd backend
npm run dev
```

Backend will start on `http://localhost:3001`

#### Terminal 3: Frontend

```bash
cd frontend
npm run dev
```

Frontend will start on `http://localhost:3000`

### 6. Seed Database (Optional)

```bash
cd database
npm run seed
```

This will create:
- Sample baker account (email: `baker@example.com`, password: `BakerTest123!`)
- Sample customer account (email: `customer@example.com`, password: `CustomerTest123!`)
- Default pricing rules
- Sample cake configurations

## Testing

### Frontend Tests

```bash
cd frontend
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:e2e      # End-to-end tests (Cypress)
```

### Backend Tests

```bash
cd backend
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:integration  # Integration tests
```

### Full Test Suite

```bash
npm run test:all      # Run all tests
```

## Production Deployment

### Option 1: Vercel (Recommended)

#### Prerequisites

- Vercel account
- Vercel Postgres database (or external PostgreSQL)
- Stripe account configured

#### Steps

1. **Install Vercel CLI**:
```bash
npm install -g vercel
```

2. **Login to Vercel**:
```bash
vercel login
```

3. **Deploy Frontend**:
```bash
cd frontend
vercel
```

Follow the prompts to configure your project.

4. **Configure Environment Variables** in Vercel Dashboard:
   - Navigate to your project settings
   - Add all environment variables from `.env.local`

5. **Deploy Backend** (as Vercel Serverless Functions or separate service):
```bash
cd backend
vercel
```

6. **Set up Database**:
   - Create Vercel Postgres database in dashboard
   - Run migrations:
```bash
DATABASE_URL=your_vercel_db_url npm run migrate
```

### Option 2: Railway

#### Steps

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **Create New Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository

3. **Add PostgreSQL Service**:
   - Click "New"
   - Select "Database" → "PostgreSQL"
   - Railway will provide `DATABASE_URL`

4. **Configure Environment Variables**:
   - Go to project settings
   - Add all required environment variables

5. **Deploy**:
   - Railway automatically deploys on git push
   - Access deployment URL in project dashboard

### Option 3: Traditional VPS (DigitalOcean, AWS, etc.)

#### Prerequisites

- Ubuntu 22.04 server
- Domain name configured
- SSL certificate (Let's Encrypt)

#### Steps

1. **Connect to Server**:
```bash
ssh user@your-server-ip
```

2. **Install Dependencies**:
```bash
# Update system
sudo apt-get update && sudo apt-get upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Install Nginx
sudo apt-get install nginx

# Install PM2
sudo npm install -g pm2
```

3. **Clone and Setup**:
```bash
git clone https://github.com/jmenichole/bake-me-a-cake-bot-.git
cd bake-me-a-cake-bot-
```

4. **Setup Database**:
```bash
sudo -u postgres psql
CREATE DATABASE bakemeacake;
CREATE USER bakemeacake_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE bakemeacake TO bakemeacake_user;
\q
```

5. **Install and Build**:
```bash
# Frontend
cd frontend
npm install
npm run build

# Backend
cd ../backend
npm install
npm run build
```

6. **Configure PM2**:
```bash
# Start backend
cd backend
pm2 start dist/index.js --name bakemeacake-api

# Start frontend
cd ../frontend
pm2 start npm --name bakemeacake-web -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

7. **Configure Nginx**:

Create `/etc/nginx/sites-available/bakemeacake`:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/bakemeacake /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

8. **SSL Certificate** (Let's Encrypt):
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Configuration

### Stripe Setup

1. **Create Stripe Account**: [stripe.com](https://stripe.com)

2. **Get API Keys**:
   - Dashboard → Developers → API keys
   - Copy Publishable key and Secret key

3. **Configure Webhooks**:
   - Dashboard → Developers → Webhooks
   - Add endpoint: `https://yourdomain.com/api/payments/webhook`
   - Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `charge.refunded`
   - Copy webhook secret

### AI Image Generation Setup

#### Option 1: Stability AI

1. Create account at [stability.ai](https://stability.ai)
2. Get API key from dashboard
3. Set `AI_IMAGE_API_KEY` and `AI_IMAGE_API_URL`

#### Option 2: OpenAI DALL-E

1. Create account at [openai.com](https://openai.com)
2. Get API key
3. Update backend to use OpenAI SDK

## Monitoring & Maintenance

### Logs

**PM2 Logs**:
```bash
pm2 logs bakemeacake-api
pm2 logs bakemeacake-web
```

**Vercel Logs**:
- View in Vercel dashboard under "Logs" tab

### Database Backups

**Automated Backups** (cron):
```bash
# Create backup script
cat > /home/user/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/user/backups"
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump bakemeacake > $BACKUP_DIR/bakemeacake_$DATE.sql
find $BACKUP_DIR -type f -name "*.sql" -mtime +7 -delete
EOF

chmod +x /home/user/backup-db.sh

# Add to crontab
crontab -e
# Add line: 0 2 * * * /home/user/backup-db.sh
```

### Performance Monitoring

- **Vercel Analytics**: Built-in for Vercel deployments
- **New Relic**: Application performance monitoring
- **Sentry**: Error tracking and monitoring

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Test connection
psql -h localhost -U bakemeacake_user -d bakemeacake
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>
```

### Build Failures

```bash
# Clear caches
rm -rf node_modules
rm -rf .next
npm install
npm run build
```

## Security Checklist

- [ ] Change default database passwords
- [ ] Use strong JWT secret (min 32 characters)
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Configure firewall rules
- [ ] Set secure cookie settings
- [ ] Validate all user inputs
- [ ] Keep dependencies updated
- [ ] Set up monitoring and alerts
- [ ] Configure CSP headers
- [ ] Enable audit logging

## Support

For issues or questions:
- GitHub Issues: [github.com/jmenichole/bake-me-a-cake-bot-/issues](https://github.com/jmenichole/bake-me-a-cake-bot-/issues)
- Email: support@bakemeacake.com
- Documentation: [docs.bakemeacake.com](https://docs.bakemeacake.com)
