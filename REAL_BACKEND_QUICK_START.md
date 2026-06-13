# 🚀 Real Backend Setup - Quick Start Guide

## ✅ What You Got

You now have a **REAL PRODUCTION BACKEND** with MongoDB persistence:

✅ MongoDB database (no more mocks)  
✅ Express.js API server  
✅ 12 data models (APIs, Providers, Services, etc.)  
✅ Frontend API client  
✅ Docker setup for easy deployment  
✅ Complete audit logging  
✅ Usage tracking & billing  
✅ Health monitoring  

## 🎯 Quick Start (Choose One)

### Option 1: Using Docker (RECOMMENDED - Easiest)

```bash
# Start backend + MongoDB
docker-compose -f docker-compose.backend.yml up -d

# Verify it's running
curl http://localhost:3000/health

# Expected response:
# {
#   "status": "UP",
#   "database": "Connected",
#   "environment": "development"
# }
```

That's it! Backend is ready at `http://localhost:3000`

### Option 2: Local Setup (Manual)

**Step 1: Start MongoDB**
```bash
# Using Docker (easiest)
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7

# OR on Windows with installed MongoDB
mongod --dbpath "C:\data\db"
```

**Step 2: Install Backend Dependencies**
```bash
npm install express mongoose cors dotenv bcryptjs jsonwebtoken axios uuid
npm install --save-dev @types/express @types/node @types/mongoose typescript ts-node nodemon
```

**Step 3: Configure Environment**
```bash
# Copy example
cp .env.backend.example .env

# Edit .env (change MONGODB_URI if needed)
# MONGODB_URI=mongodb://admin:password@localhost:27017/software-vala-ai-api-manager
```

**Step 4: Start Backend**
```bash
npm run dev
```

Expected output:
```
🔌 Connecting to MongoDB...
✅ MongoDB connected successfully!
╔════════════════════════════════════════════════════════╗
║     🤖 AI API Manager Backend - Running                ║
╠════════════════════════════════════════════════════════╣
║  Server:     http://localhost:3000
║  Database:   Connected
╚════════════════════════════════════════════════════════╝
```

## 🧪 Test It Works

### Test 1: Health Check
```bash
curl http://localhost:3000/health
```

### Test 2: Create an API
```bash
curl -X POST http://localhost:3000/api/ai-api-manager/apis \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "OpenAI API",
    "provider": "OpenAI",
    "category": "ai_model",
    "owner": "user123",
    "purpose": "LLM inference",
    "status": "online",
    "environment": "production"
  }'
```

### Test 3: Get All APIs
```bash
curl http://localhost:3000/api/ai-api-manager/apis \
  -H "x-user-id: user123"
```

### Test 4: Record Usage
```bash
curl -X POST http://localhost:3000/api/ai-api-manager/usage \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "apiId": "INSERT_ID_FROM_STEP_2",
    "requestCount": 100,
    "cost": 2.50
  }'
```

## 🔌 Connect Frontend

Your frontend is already configured! The API client in `src/lib/apiClient.ts` now:
- ✅ Connects to real backend
- ✅ Sends `x-user-id` header
- ✅ Uses MongoDB data

**No more mocks!** All data persists.

### In React Components:

```typescript
import { apiManagerClient } from '@/lib/apiClient';

async function loadAPIs() {
  const apis = await apiManagerClient.getAllAPIs();
  return apis; // Real data from database!
}
```

## 📊 Database Structure

### 12 Main Collections

1. **apiregistries** - Your API catalog
2. **aiproviders** - OpenAI, Claude, Gemini, etc.
3. **providers** - Third-party services
4. **services** - Your internal services
5. **webhooks** - Event handlers
6. **connectors** - API syncing
7. **integrations** - Multi-API workflows
8. **usagemetrics** - Request tracking
9. **alerts** - System alerts
10. **auditlogs** - Complete history
11. **apikeys** - API credentials
12. **billings** - Invoice records

### View Database

**Using MongoDB Compass (GUI):**
1. Download: https://www.mongodb.com/products/compass
2. Connect to: `mongodb://admin:password@localhost:27017`
3. Browse collections in real-time

**Using Command Line:**
```bash
docker exec -it software-vala-mongodb mongosh \
  -u admin -p password \
  --authenticationDatabase admin

# In mongosh shell:
use software-vala-ai-api-manager
db.apiregistries.find()
db.aiproviders.find()
```

## 📡 API Endpoints (Real Backend)

All endpoints now hit MongoDB:

```
GET    /api/ai-api-manager/apis                 ← List all APIs
POST   /api/ai-api-manager/apis                 ← Create API
GET    /api/ai-api-manager/apis/:id             ← Get one API
PUT    /api/ai-api-manager/apis/:id             ← Update API
DELETE /api/ai-api-manager/apis/:id             ← Delete API

GET    /api/ai-api-manager/ai-providers         ← List providers
POST   /api/ai-api-manager/ai-providers         ← Add provider

POST   /api/ai-api-manager/usage                ← Record usage
GET    /api/ai-api-manager/dashboard/metrics    ← Get metrics

POST   /api/ai-api-manager/alerts               ← Create alert
GET    /api/ai-api-manager/alerts               ← List alerts

GET    /api/ai-api-manager/audit                ← View history
GET    /api/ai-api-manager/wallet               ← Check wallet
```

## 🔄 Real Data Flow

**BEFORE (Mock):**
```
React Component
    ↓
apiManagerService (in-memory)
    ↓
JavaScript Map
    ↓
(Lost on page refresh!)
```

**AFTER (Real Backend):**
```
React Component
    ↓
apiManagerClient.ts (HTTP fetch)
    ↓
Express Server (Node.js)
    ↓
MongoDB Database
    ↓
Persistent Data ✅
```

## 🚀 Production Deployment

### Deploy to Heroku

```bash
# Add buildpacks
heroku buildpacks:add heroku/nodejs

# Set MongoDB Atlas connection
heroku config:set MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db

# Deploy
git push heroku main
```

### Deploy to AWS Lambda

```bash
npm run build
zip -r function.zip dist node_modules
aws lambda create-function --handler dist/src/server/index.handler ...
```

### Deploy to Docker Hub

```bash
docker build -f Dockerfile.backend -t yourusername/ai-api-manager .
docker push yourusername/ai-api-manager
```

## 📈 Monitor Your Backend

### View Logs
```bash
# Docker
docker logs -f software-vala-backend

# Local
npm run dev
```

### Database Stats
```bash
# Connect to MongoDB
mongo
db.stats()
db.apiregistries.stats()
```

### API Health
```bash
curl http://localhost:3000/health
```

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
```bash
# Check if MongoDB is running
docker ps | grep mongodb

# If not running, start it
docker run -d -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:7
```

### "Port 3000 already in use"
```bash
# Change PORT in .env
PORT=3001

# Or kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### "CORS error from frontend"
```bash
# Add your frontend URL to CORS in src/server/index.ts
origin: ['http://localhost:5173', 'http://localhost:3000']
```

### "API returns 401 Unauthorized"
```bash
# Make sure to send x-user-id header
curl -H "x-user-id: user123" http://localhost:3000/api/ai-api-manager/apis
```

## ✨ Next Steps

1. **Test all endpoints** - Use curl or Postman
2. **Connect frontend** - Update React components to use real backend
3. **Seed sample data** - Run `npm run seed`
4. **Setup monitoring** - Add logging/alerting
5. **Deploy to production** - Use Docker or cloud platform

## 📚 Full Documentation

See **BACKEND_IMPLEMENTATION_GUIDE.md** for:
- Complete API reference
- Database schema details
- Security configuration
- Performance optimization
- Migration strategies

## 🎉 You're Done!

Your AI API Manager now has:
- ✅ Real MongoDB database
- ✅ Persistent data storage
- ✅ Express.js backend
- ✅ Production-ready code
- ✅ Docker support
- ✅ Complete API endpoints
- ✅ Audit logging
- ✅ Usage tracking

**No more "mock" or "fake" data!** Everything is real and persisted. 🚀

---

Questions? See BACKEND_IMPLEMENTATION_GUIDE.md for detailed docs.
