# 🚨 PRODUCTION INCIDENT - ACTION PLAN

**Status:** 🔴 CRITICAL  
**Date:** 2026-06-11 @ 13:43 UTC  
**Reported By:** User (Software Vala Support)  
**Incident Type:** Backend Service Unavailability  

---

## What's Wrong ❌

The backend API is completely unreachable on production. All `/api/v1/*` endpoints return **404 NOT_FOUND**. This affects:

- ❌ Cart operations (cannot add to cart)
- ❌ Admin dashboard (gamification, categories, email templates)
- ❌ Chat/Messaging
- ❌ Notifications
- ❌ Wishlist management
- ❌ Static assets loading

**Production URL:** https://www.softwarevala.net

---

## What We Can Do (Frontend Team) ✅

We've implemented frontend-side monitoring and graceful error handling:

### 1. Enhanced Health Check Endpoint ✅
**Location:** `backend/src/server.ts` lines 79-102

Added comprehensive health check that returns:
```json
{
  "status": "healthy|unhealthy",
  "database": "connected|disconnected",
  "uptime": 12345,
  "timestamp": "2026-06-11T13:43:00Z"
}
```

**Endpoints:**
- `GET /health` - Detailed health check with database status
- `GET /ready` - Simple readiness probe

### 2. API Status Banner Component ✅
**Location:** `src/contexts/ApiStatusContext.tsx`

Creates a sticky banner at the top of the page when API is down:
- Shows offline notification
- Displays last check time
- Provides retry button
- Auto-checks every 30 seconds
- Listens for online/offline events

### 3. API Status Provider Integration ✅
**Location:** `src/App.tsx`

Wrapped entire app with ApiStatusProvider:
- Monitors backend availability
- Shows/hides banner based on connection status
- Non-intrusive (doesn't block page navigation)

### 4. Frontend Resilience ✅
Already implemented:
- Error boundaries in ResellerProductsPage
- Error messages for failed API calls
- Loading states for async operations
- Fallback UI when data unavailable

---

## What the Infrastructure Team Must Do 🏗️

### IMMEDIATE (Next 15 minutes)

**1. Verify Backend is Running**
```bash
# SSH to backend server
ssh backend-user@backend-host

# Check if process is running
ps aux | grep node
ps aux | grep fastify

# Check logs
tail -100f /var/log/backend.log
pm2 logs
docker logs backend-container

# Test locally
curl http://localhost:3001/health
curl http://localhost:3001/api/v1/health
```

**2. Check Vercel Configuration**
```bash
# View deployment logs
vercel logs https://www.softwarevala.net

# Check vercel.json file
cat vercel.json

# Verify environment variables in Vercel dashboard
# Dashboard → Settings → Environment Variables
```

**3. Verify Networking**
```bash
# Test backend connectivity
ping backend.softwarevala.net
telnet backend.softwarevala.net 3001

# Check DNS
nslookup api.softwarevala.net

# Trace route
tracert api.softwarevala.net
```

---

### SHORT TERM (15-60 minutes)

**4. Restart Services**
```bash
# If using PM2
pm2 restart all
pm2 status
pm2 logs

# If using systemd
sudo systemctl restart fastify-backend
sudo systemctl status fastify-backend
sudo journalctl -u fastify-backend -n 100

# If using Docker
docker-compose restart backend
docker-compose logs -f backend
```

**5. Check Database Connection**
```bash
# Test database connectivity
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"
psql -h $DB_HOST -U $DB_USER -c "SELECT 1"

# Check connection pool status
# Review application logs for connection errors
```

**6. Verify Deployment**
```bash
# Check recent deployments
git log --oneline -10

# Revert if necessary
git revert <bad-commit>

# Or redeploy
npm run deploy:production
```

---

### LONG TERM (Post-Incident)

**7. Add Monitoring & Alerts**
```
- Set up health check monitoring
- Configure alerts for status codes
- Add logging/tracing
- Set up auto-recovery
```

**8. Implement Redundancy**
```
- Database connection pooling
- Load balancing
- Failover mechanism
- Auto-scaling
```

---

## Testing the Fix 🧪

### Test Health Endpoint
```bash
# Should return 200 OK
curl -i https://www.softwarevala.net/api/v1/health

# Should see:
# "status": "healthy"
# "database": "connected"
```

### Test API Endpoints
```bash
# Cart endpoint
curl -i -H "Authorization: Bearer TOKEN" https://www.softwarevala.net/api/v1/cart

# Wishlist endpoint
curl -i https://www.softwarevala.net/api/v1/wishlist/count

# Should all return 200 OK (not 404)
```

### Browser Testing
1. Visit https://www.softwarevala.net
2. Wait for page to load
3. Verify API banner is NOT shown (if backend is up)
4. Add product to cart
5. Verify cart works
6. Navigate to admin dashboard
7. Verify pages load correctly

---

## Rollback Plan 🔄

If new deployment causes more issues:

```bash
# Revert to previous stable version
git revert <commit>
npm run deploy:production

# Or restore from backup
docker-compose down
docker volume restore backup-db
docker-compose up
```

---

## Communication Template 📢

**To Users (If prolonged outage):**
```
Dear Users,

We're experiencing technical difficulties with our backend services. 
We're actively investigating and working on a fix.

Status: Investigating
Last Update: 2026-06-11 14:00 UTC

We'll provide updates every 15 minutes.

Thank you for your patience.
- Support Team
```

**To Team (Slack):**
```
🔴 CRITICAL: Backend API is down on production
- All /api/v1/* endpoints returning 404
- Started: ~13:43 UTC
- Impact: Cart, admin, chat, notifications
- Status: @DevOps investigating
- ETA: TBD

Please avoid deploying until resolved.
```

---

## Follow-Up Actions 📋

After the incident is resolved:

1. **Root Cause Analysis**
   - What actually happened?
   - Why did it happen?
   - How did it go unnoticed?

2. **Improvements**
   - Add automated health checks
   - Set up production monitoring
   - Create runbooks for common issues
   - Add better error handling

3. **Documentation**
   - Update deployment guide
   - Document backup/restore procedure
   - Create troubleshooting guide
   - Add incident response playbook

---

## Useful Links & Contacts 

**Production URLs:**
- Frontend: https://www.softwarevala.net
- API: https://api.softvalavala.net (if separate)
- Backend Health: https://www.softwarevala.net/api/v1/health

**Infrastructure Access:**
- Vercel Dashboard: https://vercel.com/dashboard
- Backend Server: `backend-user@backend-host`
- Database: `mysql-host:3306`
- Monitoring: https://monitoring.softwalevala.net (if available)

**Team Contacts:**
- DevOps Lead: @devops-lead
- Backend Team: @backend-team
- Frontend Team: @frontend-team

---

## Summary

**Frontend:** ✅ Ready (monitoring added, error handling in place)  
**Backend:** ❌ Down (needs infrastructure team investigation)  
**Infrastructure:** ⏳ Action Required (check deployment, verify health, restart services)

**Cannot proceed with further frontend work until backend is restored.**

---

**Generated:** 2026-06-11 13:45 UTC  
**Priority:** P1 - CRITICAL  
**Affected Users:** All  
**Business Impact:** Complete service outage
