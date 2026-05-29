#!/bin/bash

# Enterprise deployment script for VPS
set -e

echo "🚀 Starting enterprise deployment to VPS..."

# VPS Configuration
VPS_HOST="root@72.61.236.249"
VPS_DIR="/var/www/nexus"
DOMAIN="technologywala.com"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📦 Building Docker images...${NC}"
docker-compose -f docker-compose.enterprise.yml build

echo -e "${YELLOW}📤 Copying files to VPS...${NC}"
# Create directory structure on VPS
ssh $VPS_HOST "mkdir -p $VPS_DIR/{logs,backups}"

# Copy files
scp docker-compose.enterprise.yml $VPS_HOST:$VPS_DIR/docker-compose.yml
scp .env.production $VPS_HOST:$VPS_DIR/.env
scp prometheus.yml $VPS_HOST:$VPS_DIR/
scp nginx.conf $VPS_HOST:$VPS_DIR/
scp Dockerfile.frontend $VPS_HOST:$VPS_DIR/

# Copy entire project structure
ssh $VPS_HOST "rm -rf $VPS_DIR/apps $VPS_DIR/packages $VPS_DIR/src"
scp -r apps $VPS_HOST:$VPS_DIR/
scp -r packages $VPS_HOST:$VPS_DIR/
scp -r src $VPS_HOST:$VPS_DIR/
scp package.json $VPS_HOST:$VPS_DIR/
scp bun.lock $VPS_HOST:$VPS_DIR/

echo -e "${YELLOW}🔧 Setting up environment on VPS...${NC}"
ssh $VPS_HOST << EOF
  cd $VPS_DIR
  
  # Install Docker if not present
  if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sh get-docker.sh
    systemctl start docker
    systemctl enable docker
  fi
  
  # Install Docker Compose if not present
  if ! command -v docker-compose &> /dev/null; then
    curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-\$(uname -s)-\$(uname -m)" -o /usr/local/bin/docker-compose
    chmod +x /usr/local/bin/docker-compose
  fi
  
  # Stop existing containers
  docker-compose down || true
  
  # Pull latest images
  docker-compose pull || true
  
  # Start containers
  docker-compose up -d
  
  # Wait for services to be healthy
  echo "⏳ Waiting for services to be healthy..."
  sleep 45
  
  # Check container status
  docker-compose ps
  
  # Setup firewall
  ufw allow 80/tcp
  ufw allow 443/tcp
  ufw allow 22/tcp
  ufw --force enable
  
  # Setup log rotation
  cat > /etc/logrotate.d/nexus << 'LOGEOF'
  $VPS_DIR/logs/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 root root
    sharedscripts
  }
  LOGEOF
EOF

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Application should be available at: https://$DOMAIN${NC}"
echo -e "${YELLOW}📋 Check logs with: ssh $VPS_HOST 'cd $VPS_DIR && docker-compose logs -f'${NC}"
echo -e "${YELLOW}📊 Monitoring: Grafana at http://$DOMAIN:3003 (admin/nexus_grafana_secure_2024)${NC}"
echo -e "${YELLOW}📈 Prometheus at http://$DOMAIN:9090${NC}"
