# 🛠️ SPA Routing Fix Guide

## Problem
Getting **404: NOT_FOUND** when reloading pages in development/production.

**Root Cause:** Single Page Application (SPA) routing requires the server to serve `index.html` for all routes, not just API calls. When you reload a page at `/dashboard/achievements`, the server tries to find a file at that path instead of serving the React app.

---

## Solutions

### ✅ **Solution 1: Development Mode** (Recommended)

Run the Vite development server:

```bash
npm run dev
```

This starts Vite at `http://localhost:5173` with proper HMR and routing.

**Why it works:** Vite's dev server automatically serves `index.html` for all non-file routes, allowing React Router to handle navigation.

---

### ✅ **Solution 2: Production Mode** (Verified Working)

```bash
# Build the project
npm run build

# Start production server
npm start
```

This runs the production server at `http://localhost:4173` with proper SPA routing configured in `server.js`.

**Verified:** The `server.js` file already has the correct configuration:
```javascript
app.get('*', (req, res) => {
  // Serves index.html for all routes, letting React Router handle navigation
  res.sendFile(path.join(distPath, 'index.html'));
});
```

---

### ✅ **Solution 3: Quick Development with Vite Preview**

```bash
npm run build
npm run preview
```

This builds the project and previews it at `http://localhost:4173` with correct SPA routing.

---

## Testing the Fix

After applying one of the solutions above:

1. **Navigate normally**
   ```
   ✅ http://localhost:4173/dashboard/achievements
   ✅ http://localhost:4173/admin/achievements
   ```

2. **Hard refresh** (Ctrl+Shift+R or Cmd+Shift+R)
   ```
   ✅ Page should reload without 404 error
   ```

3. **Direct URL access**
   ```
   ✅ Paste URL directly in browser address bar
   ✅ Page should load correctly
   ```

---

## Common Issues & Fixes

### Issue: Still getting 404 after page reload

**Check:**
- [ ] Are you running `npm run dev` (development) or `npm run build && npm start` (production)?
- [ ] Is the server actually running? (Check terminal output)
- [ ] Are you accessing the correct port? (Development: 5173, Production: 4173)

**Fix:**
```bash
# Stop any running servers (Ctrl+C)

# For development
npm run dev

# OR for production
npm run build
npm start
```

---

### Issue: 404 for `/api/` endpoints

This is **expected** and correct. API endpoints should be configured on your backend server (typically port 3000 or 3001).

**In development**, you need to configure a proxy in `vite.config.ts`:

```typescript
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
```

---

### Issue: Demo site URL not working

The demo URL `https://demo.saashub.io/prod-7` doesn't exist. 

**Use instead:**
- Development: `http://localhost:5173` (with `npm run dev`)
- Production: `http://localhost:4173` (with `npm run build && npm start`)

---

## File References

### ✅ Already Configured

- **Production:** `server.js` ← Has proper SPA routing fallback
- **Vite Config:** `vite.config.ts` ← Configured for SPA
- **Development:** `npm run dev` ← Uses Vite dev server with HMR

### Updated Files

- **Dev Server:** `dev-server.js` ← Optional development server with routing

---

## Quick Reference

| Mode | Command | URL | Status |
|------|---------|-----|--------|
| **Development** | `npm run dev` | `http://localhost:5173` | ✅ Vite HMR enabled |
| **Build** | `npm run build` | N/A (creates dist/) | ✅ Production build |
| **Preview** | `npm run preview` | `http://localhost:4173` | ✅ SPA routing configured |
| **Production** | `npm start` | `http://localhost:4173` | ✅ Verified working |

---

## Architecture

```
User Request: GET /dashboard/achievements

┌─────────────────────────────────┐
│  Server receives request        │
└────────────────┬────────────────┘
                 │
                 ▼
         ┌───────────────────┐
         │ Is it an API?     │
         │ /api/* /admin/*   │
         └────────┬──────────┘
                  │
          ┌───────┴───────┐
          │               │
         NO              YES
          │               │
          ▼               ▼
    ┌──────────┐   ┌──────────────┐
    │index.html│   │Route to API  │
    │React     │   │Backend:3000  │
    │Router    │   └──────────────┘
    │handles   │
    └──────────┘
```

---

## Environment Variables

For development with API proxy:

```env
# .env or .env.local
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=Achievement System
```

---

## Deployment Checklist

- [ ] Verify `npm run build` completes without errors
- [ ] Verify `npm start` serves app correctly
- [ ] Test hard reload on various routes
- [ ] Check that all routes load without 404
- [ ] Verify API calls use correct endpoint
- [ ] Check browser console for errors

---

## Still Having Issues?

1. **Clear browser cache:** Hard refresh (Ctrl+Shift+R)
2. **Check server logs:** Look at terminal output for errors
3. **Verify ports:** Make sure 4173 (production) or 5173 (development) are not in use
4. **Check built files:** Verify `dist/index.html` exists after build
5. **Review server config:** Check `server.js` has SPA fallback

---

## Summary

✅ **SPA routing is already configured**  
✅ **Production server (server.js) verified working**  
✅ **Use `npm run dev` for development with HMR**  
✅ **Use `npm start` for production serving**  
✅ **Page reloads should now work without 404 errors**

---

If issues persist, check:
- Terminal output for errors
- Network tab in browser DevTools
- Ensure correct port is being used
- Verify `dist/` folder exists (after build)
