# ✅ Verification Checklist - Post-Recovery

**Use this checklist after backend is restored to verify everything is working correctly.**

---

## 🏥 Backend Recovery Verification

### Health Endpoint ⚕️
- [ ] `/api/v1/health` returns 200 OK
- [ ] Response includes `"status": "healthy"`
- [ ] Response includes `"database": "connected"`
- [ ] Uptime value is reasonable (>0)

```bash
curl -i https://www.softwarevala.net/api/v1/health
# Should show: HTTP/2 200
# Body: {"status": "healthy", "database": "connected", ...}
```

### Readiness Endpoint 🟢
- [ ] `/api/v1/ready` returns 200 OK
- [ ] Response includes `"ready": true`

```bash
curl -i https://www.softwarevala.net/api/v1/ready
# Should show: HTTP/2 200
# Body: {"ready": true}
```

---

## 🛒 Core Functionality Tests

### Cart Operations
- [ ] Can add product to cart without errors
- [ ] Cart count updates immediately
- [ ] Can view cart items
- [ ] Can remove items from cart
- [ ] Checkout process starts

```bash
# From browser console
fetch('/api/v1/cart', {
  method: 'GET',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
})
.then(r => r.json())
.then(d => console.log(d))
```

### Product Functionality
- [ ] Product page loads correctly
- [ ] Product images display
- [ ] Product information shows
- [ ] "Add to cart" button works
- [ ] Wishlist button works

### Wishlist Management
- [ ] Wishlist counter shows correct count
- [ ] Can add items to wishlist
- [ ] Can remove items from wishlist
- [ ] Wishlist page loads

```bash
curl -i https://www.softwarevala.net/api/v1/wishlist/count
# Should return: HTTP/2 200
```

---

## 👥 Reseller Module Tests

### Reseller Routes (All Should Load ✅)
- [ ] /reseller/apply - Public page
- [ ] /reseller/dashboard - Protected
- [ ] /reseller/leads - Protected
- [ ] /reseller/referrals - Protected
- [ ] /reseller/pipeline - Protected
- [ ] /reseller/contacts - Protected
- [ ] /reseller/users - Protected
- [ ] /reseller/subscriptions - Protected
- [ ] /reseller/products - Protected
- [ ] /reseller/earnings - Protected
- [ ] /reseller/commissions - Protected
- [ ] /reseller/payouts-history - Protected
- [ ] /reseller/marketing - Protected
- [ ] /reseller/reports - Protected
- [ ] /reseller/settings - Protected
- [ ] /reseller/chat - Protected

**Test:** Navigate to each URL in browser. Should load without errors.

### Reseller API Endpoints
- [ ] GET `/api/v1/reseller/products` - Returns array
- [ ] GET `/api/v1/reseller/users` - Returns array
- [ ] GET `/api/v1/reseller/subscriptions` - Returns array
- [ ] GET `/api/v1/reseller/dashboard` - Returns data
- [ ] GET `/api/v1/reseller/leads` - Returns array
- [ ] GET `/api/v1/reseller/referrals` - Returns array

```bash
# Test endpoint
curl -H "Authorization: Bearer TOKEN" \
  https://www.softwarevala.net/api/v1/reseller/products
# Should return: HTTP/2 200 with product array
```

### Error Handling
- [ ] ResellerProductsPage shows data without errors
- [ ] No red error banner in UI
- [ ] Loading spinners disappear after data loads
- [ ] Empty states display correctly if no data

---

## 📱 Admin Panel Tests

### Admin Functionality
- [ ] Admin dashboard loads
- [ ] KPI metrics show
- [ ] Categories load
- [ ] Gamification library loads
- [ ] Email templates load

```bash
# Test admin endpoints
curl -H "Authorization: Bearer ADMIN_TOKEN" \
  https://www.softwarevala.net/api/v1/overview/kpi
# Should return: HTTP/2 200
```

---

## 💬 Chat & Notifications

### Chat System
- [ ] Chat page loads
- [ ] Unread count shows correctly

```bash
curl https://www.softwarevala.net/api/v1/chat/unread-count
# Should return: HTTP/2 200
```

### Notifications
- [ ] Notification counter shows
- [ ] Notification page loads

```bash
curl https://www.softwarevala.net/api/v1/notifications/unread-count
# Should return: HTTP/2 200
```

---

## 🖼️ Static Assets

### Images Loading
- [ ] Logo on landing page displays
- [ ] Product images load
- [ ] Admin icons show
- [ ] No 404 errors in console

**Test:** Open DevTools → Network tab. All images should show status 200.

---

## 📊 Frontend Monitoring

### API Status Banner
- [ ] Banner is NOT visible (because API is healthy)
- [ ] Check console for health checks
- [ ] Health checks run every 30 seconds

```bash
# In browser console
# Should see: Multiple "Health check passed" messages
```

### Error Handling
- [ ] If API goes down again, banner appears
- [ ] Banner shows error message
- [ ] Retry button works
- [ ] Close button hides banner

---

## 🔍 Performance Tests

### Page Load Times
- [ ] Homepage loads in < 3 seconds
- [ ] Product pages load in < 3 seconds
- [ ] Admin pages load in < 2 seconds
- [ ] Dashboard loads in < 5 seconds

**Tool:** DevTools → Network tab → Timeline

### API Response Times
- [ ] Health check < 100ms
- [ ] Product list < 500ms
- [ ] Cart operations < 300ms
- [ ] Dashboard data < 1000ms

---

## 🧪 Stress Tests (Optional)

### Load Test with Apache Bench
```bash
# Install
apt-get install apache2-utils

# Test 100 requests, 10 concurrent
ab -n 100 -c 10 https://www.softwarevala.net/api/v1/health

# Should show: 0 failed requests
```

### Check for Memory Leaks
- [ ] Memory usage stable over 10 minutes
- [ ] No memory growth with repeated requests
- [ ] Backend process responsive

---

## 🚨 Error Scenarios

### Simulate Backend Outage (For Testing)
- [ ] Close backend process
- [ ] Verify banner appears in UI
- [ ] Verify error message shows
- [ ] Restart backend
- [ ] Verify banner disappears after health check

### Test Database Disconnect
- [ ] Stop database
- [ ] Verify health check shows "unhealthy"
- [ ] Verify health endpoint returns 503
- [ ] Restart database
- [ ] Verify health check shows "healthy"

---

## 📋 Post-Recovery Checklist

**Complete all items before declaring incident resolved:**

### Infrastructure
- [ ] Backend process running
- [ ] Database connected
- [ ] Health endpoints responding
- [ ] All API endpoints returning 200 OK
- [ ] Static assets serving
- [ ] Vercel proxy working

### Frontend
- [ ] All pages load without errors
- [ ] No console errors
- [ ] Error banner not showing
- [ ] Reseller module fully functional
- [ ] Cart operations working
- [ ] Admin pages accessible

### Monitoring
- [ ] Health checks active and passing
- [ ] Alerts configured and working
- [ ] Logs clean and readable
- [ ] No spike in error rates

### Communication
- [ ] Status page updated
- [ ] Team notified of recovery
- [ ] Users informed of restoration
- [ ] Customer support notified

### Documentation
- [ ] Incident logged
- [ ] Root cause documented
- [ ] Timeline recorded
- [ ] Lessons learned captured

---

## ⏱️ Timeline Template

Use this to record when each verification was completed:

```
🔴 Incident Started: 2026-06-11 13:43 UTC
⏳ Investigation Started: 2026-06-11 13:50 UTC
🟠 Fix Deployed: 2026-06-11 [TIME] UTC
🟡 Health Checks Passing: 2026-06-11 [TIME] UTC
✅ All Tests Passing: 2026-06-11 [TIME] UTC
✅ Incident Resolved: 2026-06-11 [TIME] UTC

Recovery Time: [X minutes]
Downtime: [X minutes]
```

---

## 📞 If Issues Persist

**Chart showing what to do if tests fail:**

| Test Failed | Most Likely Cause | Action |
|-------------|-------------------|--------|
| Health endpoint | Backend not running | Restart service |
| API endpoints 404 | Routes not registered | Check server.ts |
| Database error | DB connection failed | Verify credentials |
| Images 404 | Assets not deployed | Check CDN/storage |
| Admin pages 404 | Admin routes down | Check auth middleware |
| Chart/analytics 404 | Service specific issue | Check that service |

---

## ✨ Success Indicators

**All of these should be true after recovery:**

✅ Health check returns 200 OK  
✅ Health check shows "database": "connected"  
✅ API banner is NOT visible in UI  
✅ All reseller pages load  
✅ Cart operations work  
✅ Admin pages load  
✅ No console errors  
✅ No 404 errors  
✅ All images load  
✅ Chat/notifications work  

---

## 📝 Final Sign-Off

```
Team Lead Verification:
Name: ___________________
Date: ___________________
Time: ___________________

All checks passed: ☐ Yes ☐ No

Incident Status: ☐ RESOLVED ☐ ONGOING

Comments: _______________________________________________
```

---

## 🎯 Quick Commands Reference

```bash
# Check health
curl -i https://www.softwarevala.net/api/v1/health

# Check specific endpoint
curl -i https://www.softwarevala.net/api/v1/[endpoint]

# Check backend logs
pm2 logs backend
docker logs backend
journalctl -u fastify-backend -f

# Check database
mysql -h $DB_HOST -u $DB_USER -p$DB_PASS -e "SELECT 1"

# Restart backend
pm2 restart backend
docker-compose restart backend

# Load test
ab -n 100 -c 10 https://www.softwarevala.net/api/v1/health
```

---

**Checklist Created:** 2026-06-11  
**Last Updated:** 2026-06-11 13:50 UTC  
**Use This For:** Post-recovery verification  
**Expected Duration:** 15-30 minutes to complete all checks
