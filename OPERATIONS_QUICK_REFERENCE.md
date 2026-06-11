# 🚀 Quick Reference - Production Incident & Backend Health Check

## Current Status (2026-06-11)

```
❌ Backend API: DOWN - All /api/v1/* endpoints returning 404
❌ Static Assets: DOWN - Asset CDN not responding
✅ Frontend: WORKING - With error handling & monitoring
✅ Monitoring: ACTIVE - Health checks every 30 seconds
```

---

## Health Check Endpoints (Available When Backend is UP)

### Detailed Health Check
```bash
curl -i https://www.softwarevala.net/api/v1/health

# Expected Response (200 OK):
{
  "status": "healthy",
  "database": "connected",
  "uptime": 345600,
  "timestamp": "2026-06-11T14:00:00Z",
  "version": "1.0.0"
}

# Error Response (503 Service Unavailable):
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Connection timeout",
  "uptime": 123
}
```

### Readiness Check
```bash
curl -i https://www.softwarevala.net/api/v1/ready

# Response:
{ "ready": true }    # or 503 if not ready
```

---

## Quick Diagnostics Checklist

**☐ Step 1: Backend Process Status**
```bash
ps aux | grep node
ps aux | grep fastify
pm2 status
systemctl status fastify-backend
docker ps | grep backend
```

**☐ Step 2: Port Connectivity**
```bash
curl http://localhost:3001/health
netstat -tulpn | grep 3001
lsof -i :3001
```

**☐ Step 3: Database Connection**
```bash
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"
psql -h $DB_HOST -U $DB_USER -c "SELECT 1"
```

**☐ Step 4: Logs Review**
```bash
# PM2 logs
pm2 logs backend

# Systemd logs
journalctl -u fastify-backend -n 50 -f

# Docker logs
docker logs -f backend-container

# Application logs
tail -100f /var/log/app/backend.log
```

**☐ Step 5: API Endpoint Test**
```bash
curl -i https://www.softwarevala.net/api/v1/health
curl -i https://www.softwarevala.net/api/v1/cart
curl -i https://www.softwarevala.net/api/v1/products
```

---

## Common Issues & Fixes

### Issue: "Connection refused" or Port Not Open

**Cause:** Backend process not running or wrong port

```bash
# Fix 1: Start the service
pm2 start ecosystem.config.js
# or
systemctl start fastify-backend
# or
docker-compose up -d backend

# Verify:
curl http://localhost:3001/health
```

### Issue: "Connection timeout" to Database

**Cause:** Database unreachable, credentials wrong, or connection pool exhausted

```bash
# Fix 1: Check DB connectivity
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"

# Fix 2: Check DB_HOST environment variable
echo $DB_HOST

# Fix 3: Restart backend (clears connection pool)
pm2 restart backend
systemctl restart fastify-backend
```

### Issue: "404 Not Found" on API endpoints

**Cause:** Routes not registered or wrong prefix

```bash
# Verify routes are registered
curl http://localhost:3001/api/v1/health

# Check route prefix in server.ts
grep "register.*prefix" backend/src/server.ts

# Check if routes file exists
ls -la backend/src/routes/
```

### Issue: Vercel Proxy Not Working

**Cause:** vercel.json rewrites misconfigured or missing

```bash
# Check vercel.json
cat vercel.json

# Expected format:
{
  "rewrites": [
    {
      "source": "/api/v1/(.*)",
      "destination": "https://api.softwarevala.net/api/v1/$1"
    }
  ]
}

# Redeploy if changed
vercel deploy --prod
```

---

## Recovery Procedures

### Procedure 1: Restart Backend Service (2-3 minutes)

```bash
# Option A: PM2
pm2 restart backend
pm2 status
pm2 logs backend

# Option B: Systemd
sudo systemctl restart fastify-backend
sudo systemctl status fastify-backend
sudo journalctl -u fastify-backend -n 20

# Option C: Docker
docker-compose restart backend
docker-compose logs -f backend

# Verify:
curl -i https://www.softwarevala.net/api/v1/health
# Should return 200 OK
```

### Procedure 2: Redeploy Backend (5-10 minutes)

```bash
# Git deployment
cd /app
git pull origin main
npm run build
npm run start

# Or Docker
docker-compose down backend
docker-compose up -d backend

# Verify:
curl -i https://www.softwarevala.net/api/v1/health
```

### Procedure 3: Restart Everything (15 minutes)

```bash
# Full restart
docker-compose down
docker volume prune
docker-compose up -d

# Wait for services
sleep 30

# Verify all services
docker-compose ps
curl -i https://www.softwarevala.net/api/v1/health
curl -i https://www.softwarevala.net
```

### Procedure 4: Database Connection Issue (5 minutes)

```bash
# Test connection
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"

# Check connection pool
# (review app logs for pool exhaustion)

# Restart backend to clear pool
pm2 restart backend

# Verify:
curl -i https://www.softwarevala.net/api/v1/health
```

---

## Monitoring Commands

**Check All Endpoints**
```bash
endpoints=(
  "health"
  "cart"
  "products"
  "wishlist/count"
  "chat/unread-count"
  "notifications/unread-count"
  "overview/kpi"
)

for endpoint in "${endpoints[@]}"; do
  echo "Testing: $endpoint"
  curl -s -o /dev/null -w "%{http_code}\n" https://www.softwarevala.net/api/v1/$endpoint
done
```

**Real-Time Monitoring**
```bash
# Monitor backend logs continuously
watch -n 5 "curl -s -w '%{http_code}' https://www.softwarevala.net/api/v1/health"

# Monitor backend process
watch -n 5 "ps aux | grep node"

# Monitor disk space
watch -n 5 "df -h"

# Monitor memory
watch -n 5 "free -m"
```

**Load Testing (After Fix)**
```bash
# Install Apache Bench
apt-get install apache2-utils

# Simple load test
ab -n 1000 -c 10 https://www.softwarevala.net/api/v1/health

# Check response times
ab -n 100 -g results.tsv https://www.softwarevala.net/api/v1/health
```

---

## User Communication

**Status Page Message Template**
```
🔴 Incident Report
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Start Time: 2026-06-11 13:43 UTC
Expected Resolution: 2026-06-11 14:30 UTC

Issue: Backend API temporarily unavailable
Impact: Cart, admin, messaging not working

Status: 🟡 INVESTIGATING / 🟠 IN PROGRESS / ✅ RESOLVED

Updates:
- 13:43: Incident reported
- 13:50: Monitoring enabled, investigation started
- 14:00: Root cause identified
- 14:15: Fix deployed

Next Update: Within 15 minutes
```

---

## Escalation Contacts

| Role | Contact | Time |
|------|---------|------|
| On-Call DevOps | @devops-oncall | Immediate |
| Backend Lead | @backend-lead | 5 min |
| Infrastructure Lead | @infra-lead | 10 min |
| CTO | @cto | 15 min |

---

## Evidence Collection (For Analysis)

When incident is resolved, collect:

```bash
# Logs (last 1 hour before incident)
docker logs backend --since 1h > backend.log

# Database errors
grep ERROR /var/log/mysql.log > db-errors.log

# Deployment history
git log --oneline -20 > deployment-history.txt

# System stats at time of incident
vmstat 1 3600 > system-stats.txt

# Timeline
journalctl --since "2026-06-11 13:00" > system-timeline.log
```

---

## Prevention

**Add to Production Checklist:**

- [ ] Health check endpoint is responding
- [ ] Database connectivity verified
- [ ] All route prefixes correct in server.ts
- [ ] Environment variables set in Vercel
- [ ] Monitoring alerts configured
- [ ] Rollback plan tested
- [ ] Team notified of deployment

---

## Quick Links

- Backend Status: https://www.softwarevala.net/api/v1/health
- Vercel Dashboard: https://vercel.com/dashboard
- Database Admin: (Internal only)
- Monitoring: https://monitoring.softwarevala.net
- Documentation: `/app/docs/README.md`

---

**Last Updated:** 2026-06-11 13:50 UTC
**Procedure Difficulty:** Medium
**Estimated Recovery Time:** 5-30 minutes depending on root cause
