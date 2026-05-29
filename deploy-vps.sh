#!/bin/bash

# Production Deployment Script for technologywala.com
# VPS: 72.61.236.249
# Path: /root/apps/remix-of-command-center-pro

set -e

echo "=========================================="
echo "Production Deployment Script"
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

# Function to print colored output
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

# Navigate to project directory
cd $PROJECT_PATH || { print_error "Failed to navigate to project directory"; exit 1; }
print_success "Navigated to $PROJECT_PATH"

# Pull latest changes from GitHub
print_warning "Pulling latest changes from GitHub..."
git fetch origin main
git reset --hard origin/main
print_success "Repository updated"

# Install dependencies
print_warning "Installing dependencies..."
npm ci --production
cd backend
npm ci --production
cd ..
print_success "Dependencies installed"

# Build frontend
print_warning "Building frontend..."
npm run build
print_success "Frontend built"

# Build backend
print_warning "Building backend..."
cd backend
npm run build
cd ..
print_success "Backend built"

# Restart PM2 processes
print_warning "Restarting PM2 processes..."
pm2 restart ecosystem.config.json
print_success "PM2 processes restarted"

# Reload Nginx
print_warning "Reloading Nginx..."
nginx -t && nginx -s reload
print_success "Nginx reloaded"

# Restart Docker containers (if using Docker)
if [ -f "docker-compose.yml" ]; then
    print_warning "Restarting Docker containers..."
    docker-compose down
    docker-compose up -d
    print_success "Docker containers restarted"
fi

# Run database migrations (if using Prisma)
if [ -f "backend/prisma/schema.prisma" ]; then
    print_warning "Running database migrations..."
    cd backend
    npx prisma migrate deploy
    cd ..
    print_success "Database migrations completed"
fi

# Clear cache
print_warning "Clearing cache..."
rm -rf node_modules/.cache
rm -rf backend/node_modules/.cache
print_success "Cache cleared"

# Check PM2 status
print_warning "PM2 Status:"
pm2 status

# Check Nginx status
print_warning "Nginx Status:"
systemctl status nginx --no-pager

# Check Docker status (if using Docker)
if command -v docker &> /dev/null; then
    print_warning "Docker Status:"
    docker ps
fi

print_success "Deployment completed successfully!"
echo "=========================================="
echo "Application is live at: https://$DOMAIN"
echo "=========================================="
