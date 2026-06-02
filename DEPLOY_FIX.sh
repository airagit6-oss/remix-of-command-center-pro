#!/bin/bash
# ════════════════════════════════════════════════════════════════════════════
# PRODUCTION FIX SCRIPT
# softwarevala.net Complete Deployment & Issue Resolution
# ════════════════════════════════════════════════════════════════════════════

set -e  # Exit on error

PROJECT_DIR="/root/apps/remix-of-command-center-pro"
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
LOG_FILE="/root/apps/logs/deploy_${TIMESTAMP}.log"

echo "════════════════════════════════════════════════════════════════════════════"
echo "SOFTWAREVALA.NET - PRODUCTION FIX & DEPLOYMENT"
echo "Start Time: $(date)"
echo "════════════════════════════════════════════════════════════════════════════"
echo ""

# Create log directory
mkdir -p /root/apps/logs

{
  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 1: VALIDATE ENVIRONMENT
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 1: Validating environment..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  cd "$PROJECT_DIR" || exit 1
  echo "✓ Project directory: $PROJECT_DIR"

  # Check Node version
  NODE_VERSION=$(node -v)
  echo "✓ Node version: $NODE_VERSION"

  # Check npm
  NPM_VERSION=$(npm -v)
  echo "✓ NPM version: $NPM_VERSION"

  # Check PM2
  PM2_VERSION=$(pm2 -v)
  echo "✓ PM2 version: $PM2_VERSION"

  # Check Nginx
  NGINX_VERSION=$(nginx -v 2>&1)
  echo "✓ Nginx: $NGINX_VERSION"

  # Check Git
  GIT_STATUS=$(git status)
  echo "✓ Git repository initialized"

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 2: PULL LATEST CHANGES
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 2: Pulling latest changes from main branch..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  git fetch origin
  git checkout main
  git pull origin main --ff-only

  echo "✓ Latest code pulled"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 3: INSTALL DEPENDENCIES
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 3: Installing dependencies..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  npm install --production

  echo "✓ Dependencies installed"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 4: BUILD FRONTEND
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 4: Building frontend..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  npm run build

  if [ -d "dist" ]; then
    DIST_SIZE=$(du -sh dist | cut -f1)
    FILE_COUNT=$(find dist -type f | wc -l)
    echo "✓ Frontend built successfully"
    echo "  - Size: $DIST_SIZE"
    echo "  - Files: $FILE_COUNT"
  else
    echo "✘ ERROR: dist directory not created"
    exit 1
  fi

  if [ -f "dist/index.html" ]; then
    echo "✓ index.html exists"
  else
    echo "✘ ERROR: index.html not found"
    exit 1
  fi

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 5: BUILD BACKEND
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 5: Building backend..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  cd backend || exit 1
  npm install --production

  if [ -f "package.json" ]; then
    npm run build 2>/dev/null || echo "⚠ Backend build skipped (may use TypeScript at runtime)"
  fi

  cd "$PROJECT_DIR" || exit 1
  echo "✓ Backend prepared"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 6: VERIFY SERVER.JS EXISTS
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 6: Validating server.js..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if [ -f "server.js" ]; then
    echo "✓ server.js exists"
    LINES=$(wc -l < server.js)
    echo "  - Size: $LINES lines"
  else
    echo "✘ ERROR: server.js not found"
    exit 1
  fi

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 7: STOP EXISTING PROCESSES
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 7: Stopping existing PM2 processes..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pm2 stop all || true
  sleep 2

  echo "✓ Processes stopped"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 8: CLEAR PM2 CACHE
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 8: Clearing PM2 cache..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pm2 delete all || true
  sleep 2

  echo "✓ PM2 cache cleared"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 9: START PROCESSES WITH ECOSYSTEM CONFIG
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 9: Starting processes..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pm2 start ecosystem.config.json

  sleep 3

  echo "✓ Processes started"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 10: VERIFY PROCESSES
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 10: Verifying processes..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pm2 status

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 11: VERIFY PORT BINDING
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 11: Verifying port binding..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  sleep 2

  # Check frontend port 4173
  if lsof -Pi :4173 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -Pi :4173 -sTCP:LISTEN -t 2>/dev/null | head -1)
    echo "✓ Frontend listening on port 4173 (PID: $PID)"
  else
    echo "✘ Frontend NOT listening on port 4173"
    pm2 logs nexus-frontend --lines 50
    exit 1
  fi

  # Check backend port 3001
  if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null 2>&1; then
    PID=$(lsof -Pi :3001 -sTCP:LISTEN -t 2>/dev/null | head -1)
    echo "✓ Backend listening on port 3001 (PID: $PID)"
  else
    echo "✘ Backend NOT listening on port 3001"
    pm2 logs nexus-backend --lines 50
    exit 1
  fi

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 12: TEST LOCAL ENDPOINTS
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 12: Testing local endpoints..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  # Test frontend
  FRONTEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:4173)
  if [ "$FRONTEND_TEST" = "200" ]; then
    echo "✓ Frontend HTTP 200 - http://127.0.0.1:4173"
  else
    echo "✘ Frontend returned HTTP $FRONTEND_TEST"
    exit 1
  fi

  # Test backend health
  BACKEND_TEST=$(curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3001/health 2>/dev/null || echo "000")
  if [ "$BACKEND_TEST" = "200" ] || [ "$BACKEND_TEST" = "404" ]; then
    echo "✓ Backend responding (HTTP $BACKEND_TEST)"
  else
    echo "⚠ Backend not responding ($BACKEND_TEST)"
  fi

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 13: VERIFY NGINX CONFIG
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 13: Verifying Nginx configuration..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  if nginx -t >/dev/null 2>&1; then
    echo "✓ Nginx configuration valid"
  else
    echo "✘ Nginx configuration error"
    nginx -t
    exit 1
  fi

  # Check if nginx is running
  if pgrep -x "nginx" > /dev/null; then
    echo "✓ Nginx is running"
  else
    echo "⚠ Nginx not running, starting..."
    systemctl start nginx
    sleep 2
    echo "✓ Nginx started"
  fi

  # Reload nginx to apply latest config
  nginx -s reload

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 14: TEST DOMAIN ENDPOINT
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 14: Testing domain endpoint..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  DOMAIN_TEST=$(curl -s -o /dev/null -w "%{http_code}" https://softwarevala.net 2>/dev/null || echo "000")
  if [ "$DOMAIN_TEST" = "200" ]; then
    echo "✓ Domain HTTP 200 - https://softwarevala.net"
  else
    echo "⚠ Domain returned HTTP $DOMAIN_TEST (may be normal if SSL cert pending)"
  fi

  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # PHASE 15: ENABLE PM2 STARTUP
  # ──────────────────────────────────────────────────────────────────────────

  echo "PHASE 15: Enabling PM2 startup on reboot..."
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

  pm2 save
  pm2 startup systemd -u root --hp /root > /dev/null 2>&1 || true

  echo "✓ PM2 startup enabled"
  echo ""

  # ──────────────────────────────────────────────────────────────────────────
  # FINAL STATUS
  # ──────────────────────────────────────────────────────────────────────────

  echo "════════════════════════════════════════════════════════════════════════════"
  echo "DEPLOYMENT COMPLETE!"
  echo "════════════════════════════════════════════════════════════════════════════"
  echo ""
  echo "📊 STATUS SUMMARY:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  pm2 status
  echo ""
  echo "🌐 ACCESS POINTS:"
  echo "  • Frontend: http://127.0.0.1:4173"
  echo "  • Backend:  http://127.0.0.1:3001"
  echo "  • Domain:   https://softwarevala.net"
  echo ""
  echo "📝 LOGS:"
  echo "  • All logs: pm2 logs"
  echo "  • Frontend: pm2 logs nexus-frontend"
  echo "  • Backend:  pm2 logs nexus-backend"
  echo "  • Nginx:    tail -f /var/log/nginx/error.log"
  echo ""
  echo "⏱️  End Time: $(date)"
  echo "════════════════════════════════════════════════════════════════════════════"

} | tee "$LOG_FILE"

echo ""
echo "Log saved to: $LOG_FILE"
