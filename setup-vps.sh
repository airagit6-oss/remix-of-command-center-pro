#!/bin/bash

# Initial VPS Setup Script for technologywala.com
# VPS: 72.61.236.249
# Path: /root/apps/remix-of-command-center-pro

set -e

echo "=========================================="
echo "VPS Initial Setup Script"
echo "=========================================="

# Configuration
PROJECT_PATH="/root/apps/remix-of-command-center-pro"
DOMAIN="technologywala.com"
REPO="https://github.com/airagit6-oss/remix-of-command-center-pro"
GITHUB_TOKEN="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"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    print_error "Please run as root"
    exit 1
fi

print_success "Running as root"

# Update system
print_warning "Updating system packages..."
apt update && apt upgrade -y
print_success "System updated"

# Install essential packages
print_warning "Installing essential packages..."
apt install -y curl wget git nginx nodejs npm redis-server postgresql-client docker.io docker-compose ufw fail2ban
print_success "Essential packages installed"

# Install PM2 globally
print_warning "Installing PM2..."
npm install -g pm2
print_success "PM2 installed"

# Install PM2 startup script
print_warning "Setting up PM2 startup..."
pm2 startup systemd -u root --hp /root
print_success "PM2 startup configured"

# Configure firewall
print_warning "Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 3000/tcp
ufw allow 3001/tcp
ufw allow 6379/tcp
ufw --force enable
print_success "Firewall configured"

# Create project directory
print_warning "Creating project directory..."
mkdir -p $PROJECT_PATH
mkdir -p $PROJECT_PATH/logs
mkdir -p $PROJECT_PATH/ssl
print_success "Project directory created"

# Clone repository
print_warning "Cloning repository..."
if [ -d "$PROJECT_PATH/.git" ]; then
    cd $PROJECT_PATH
    git pull origin main
else
    git clone https://$GITHUB_TOKEN@github.com/airagit6-oss/remix-of-command-center-pro.git $PROJECT_PATH
    cd $PROJECT_PATH
fi
print_success "Repository cloned/updated"

# Configure Git credentials
print_warning "Configuring Git credentials..."
git config --global user.name "airagit6-oss"
git config --global user.email "airagit6@gmail.com"
print_success "Git credentials configured"

# Install dependencies
print_warning "Installing dependencies..."
npm ci
cd backend
npm ci
cd ..
print_success "Dependencies installed"

# Build application
print_warning "Building application..."
npm run build
cd backend
npm run build
cd ..
print_success "Application built"

# Setup Nginx
print_warning "Setting up Nginx..."
cp nginx.production.conf /etc/nginx/sites-available/$DOMAIN
ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl restart nginx
systemctl enable nginx
print_success "Nginx configured"

# Setup Redis
print_warning "Setting up Redis..."
systemctl start redis-server
systemctl enable redis-server
print_success "Redis configured"

# Setup Docker
print_warning "Setting up Docker..."
systemctl start docker
systemctl enable docker
print_success "Docker configured"

# Start PM2
print_warning "Starting PM2 processes..."
pm2 start ecosystem.config.json
pm2 save
print_success "PM2 processes started"

# Setup log rotation
print_warning "Setting up log rotation..."
cat > /etc/logrotate.d/remix-of-command-center-pro << EOF
/root/apps/remix-of-command-center-pro/logs/*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
print_success "Log rotation configured"

# Setup SSL certificates directory
print_warning "Setting up SSL directory..."
mkdir -p /var/www/certbot
print_success "SSL directory created"

print_success "VPS setup completed successfully!"
echo "=========================================="
echo "Next steps:"
echo "1. Configure SSL certificates with Cloudflare"
echo "2. Run deploy-vps.sh for deployments"
echo "3. Monitor with PM2: pm2 monit"
echo "=========================================="
