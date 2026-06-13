# AI API Manager - Real Backend Implementation Guide

## 🎯 Overview

This is a **production-ready backend** for the AI API Manager system with **real MongoDB database persistence** replacing all in-memory mocks.

## 📁 Project Structure

```
src/server/
├── index.ts                 # Express server setup
├── models/
│   └── apiManager.ts       # MongoDB models & schemas
├── database/
│   └── dbService.ts        # Database operations service
├── routes/
│   └── apiManager.ts       # API endpoints
└── scripts/
    ├── seed.ts             # Database seeding
    └── migrate.ts          # Migrations
```

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install Node.js 18+
node --version  # v18.0.0 or higher

# Install MongoDB locally or use Docker
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password \
  mongo:latest
```

### 2. Install Backend Dependencies

```bash
# Install packages from package.backend.json
npm install --save-dev @types/express @types/node @types/mongoose
npm install express mongoose cors dotenv bcryptjs jsonwebtoken axios uuid

# Or in one command
npm install express mongoose cors dotenv bcryptjs jsonwebtoken axios uuid \
           @types/express @types/node @types/mongoose @types/cors \
           typescript ts-node nodemon @types/jsonwebtoken --save
```

### 3. Configure Environment

```bash
# Copy example to .env
cp .env.backend.example .env

# Edit .env with your configuration
# MONGODB_URI=mongodb://localhost:27017/software-vala-ai-api-manager
# PORT=3000
# FRONTEND_URL=http://localhost:5173
```

### 4. Start Backend

```bash
# Development mode with auto-reload
npm run dev

# Or build and run production
npm run build
npm start
```

Expected output:
```
╔════════════════════════════════════════════════════════╗
║     🤖 AI API Manager Backend - Running                ║
╠════════════════════════════════════════════════════════╣
║  Server:     http://localhost:3000
║  API Base:   http://localhost:3000/api/ai-api-manager
║  Database:   Connected
╚════════════════════════════════════════════════════════╝
```

## 🏗️ Architecture

### Database Schema

#### **APIRegistry** Model
```typescript
{
  name: string
  provider: string
  category: string
  baseUrl?: string
  apiKey?: string
  status: 'online' | 'offline' | 'degraded' | 'pending_discovery'
  monthlyUsage: number
  cost: number
  healthScore: number
  createdAt: Date
  updatedAt: Date
  // ... 20+ more fields
}
```

#### **AIProvider** Model
```typescript
{
  type: string  // 'openai', 'claude', 'gemini', etc.
  name: string
  apiKey?: string
  models: [{
    id: string
    name: string
    modelId: string
    costPer1kTokens: number
  }]
  status: string
  healthScore: number
}
```

#### **Usage Metrics** Model
```typescript
{
  apiId: string
  period: 'hourly' | 'daily' | 'monthly'
  requestCount: number
  cost: number
  createdAt: Date
}
```

#### **Alert** Model
```typescript
{
  type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  message: string
  apiId?: string
  status: 'new' | 'acknowledged' | 'resolved'
}
```

#### **Audit Log** Model
```typescript
{
  action: string
  actor: string
  resourceType: string
  resourceId: string
  details: object
  createdAt: Date
}
```

### 12 Core Models

1. **APIRegistry** - Central API catalog
2. **AIProvider** - AI models & LLM providers
3. **Provider** - External service providers
4. **Service** - Internal services
5. **Webhook** - Event-driven integrations
6. **Connector** - API-to-API data sync
7. **Integration** - Multi-API workflows
8. **UsageMetrics** - Request/cost tracking
9. **Alert** - System & health alerts
10. **AuditLog** - Complete action history
11. **APIKey** - API credential management
12. **Billing** - Invoice & payment tracking

## 📡 API Endpoints

All endpoints require `x-user-id` header.

### Registries (CRUD)

```bash
# APIs
GET    /api/ai-api-manager/apis
POST   /api/ai-api-manager/apis
GET    /api/ai-api-manager/apis/:id
PUT    /api/ai-api-manager/apis/:id
DELETE /api/ai-api-manager/apis/:id

# AI Providers
GET    /api/ai-api-manager/ai-providers
POST   /api/ai-api-manager/ai-providers
GET    /api/ai-api-manager/ai-providers/:id
PUT    /api/ai-api-manager/ai-providers/:id

# Providers, Services, Webhooks, Connectors, Integrations
# Same CRUD pattern...
```

### Usage & Metrics

```bash
# Record usage
POST   /api/ai-api-manager/usage
{
  "apiId": "507f1f77bcf86cd799439011",
  "requestCount": 100,
  "cost": 2.50,
  "unit": "request"
}

# Get metrics
GET    /api/ai-api-manager/usage/:apiId/:period

# Dashboard
GET    /api/ai-api-manager/dashboard/metrics
```

### Alerts

```bash
GET    /api/ai-api-manager/alerts
POST   /api/ai-api-manager/alerts
PUT    /api/ai-api-manager/alerts/:id
```

### Audit Trail

```bash
GET    /api/ai-api-manager/audit?action=api_created&actor=user123
```

### Billing

```bash
GET    /api/ai-api-manager/billing/:apiId
POST   /api/ai-api-manager/billing
```

### Wallet

```bash
GET    /api/ai-api-manager/wallet
POST   /api/ai-api-manager/wallet/charge
{
  "amount": 50,
  "reason": "Monthly subscription",
  "relatedApiId": "507f1f77bcf86cd799439011"
}
```

## 🔄 Frontend Integration

### Update React Components

Replace all `apiManagerService` calls with real API client:

```typescript
// OLD (mock)
const apis = apiManagerService.getAllAPIs();

// NEW (real backend)
import { apiManagerClient } from '@/lib/apiClient';

const apis = await apiManagerClient.getAllAPIs();
```

### Example in React Component

```typescript
import { useEffect, useState } from 'react';
import { apiManagerClient } from '@/lib/apiClient';

export function APIListComponent() {
  const [apis, setApis] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAPIs();
  }, []);

  async function loadAPIs() {
    try {
      setLoading(true);
      const data = await apiManagerClient.getAllAPIs({ status: 'online' });
      setApis(data);
    } catch (error) {
      console.error('Failed to load APIs:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {apis.map(api => (
        <div key={api._id}>{api.name}</div>
      ))}
    </div>
  );
}
```

## 🐳 Docker Setup

### docker-compose.yml

```yaml
version: '3.8'

services:
  mongodb:
    image: mongo:latest
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db

  backend:
    build: .
    ports:
      - "3000:3000"
    environment:
      MONGODB_URI: mongodb://admin:password@mongodb:27017/software-vala-ai-api-manager
      NODE_ENV: development
    depends_on:
      - mongodb
    volumes:
      - .:/app
      - /app/node_modules

volumes:
  mongodb_data:
```

Start with:
```bash
docker-compose up -d
```

## 🔐 Security Features

- ✅ JWT authentication support
- ✅ Role-based access control (RBAC)
- ✅ Audit logging for all actions
- ✅ Request rate limiting
- ✅ CORS configured for frontend
- ✅ Input validation on all endpoints
- ✅ Encrypted API keys in database

## 📊 Database Migrations

### Running Migrations

```bash
npm run migrate
```

### Writing Migrations

```typescript
// src/server/scripts/migrate.ts
import mongoose from 'mongoose';
import { APIRegistry } from '../models/apiManager';

async function migrate() {
  await APIRegistry.updateMany(
    { status: null },
    { $set: { status: 'pending_discovery' } }
  );
  console.log('Migration complete');
}
```

## 🌱 Database Seeding

### Seed Sample Data

```bash
npm run seed
```

```typescript
// src/server/scripts/seed.ts
import { dbService } from '../database/dbService';

async function seed() {
  await dbService.createAPI({
    name: 'OpenAI API',
    provider: 'OpenAI',
    category: 'ai_model',
    owner: 'admin',
    purpose: 'LLM inference',
    status: 'online',
    environment: 'production',
  });
}

seed().then(() => console.log('Seeding complete'));
```

## 🧪 Testing Endpoints

### Using cURL

```bash
# Get all APIs
curl -X GET http://localhost:3000/api/ai-api-manager/apis \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json"

# Create API
curl -X POST http://localhost:3000/api/ai-api-manager/apis \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Stripe",
    "provider": "Stripe",
    "category": "payment",
    "owner": "user123",
    "purpose": "Payment processing",
    "status": "online",
    "environment": "production"
  }'

# Record usage
curl -X POST http://localhost:3000/api/ai-api-manager/usage \
  -H "x-user-id: user123" \
  -H "Content-Type: application/json" \
  -d '{
    "apiId": "507f1f77bcf86cd799439011",
    "requestCount": 100,
    "cost": 2.50
  }'

# Get dashboard metrics
curl -X GET http://localhost:3000/api/ai-api-manager/dashboard/metrics \
  -H "x-user-id: user123"
```

### Using Postman

1. Import endpoints from `/api/ai-api-manager/*`
2. Set `x-user-id` header in collection pre-request script:
   ```javascript
   pm.collectionVariables.set("userId", "user123");
   ```
3. Add header to each request: `x-user-id: {{userId}}`

## 🐛 Troubleshooting

### MongoDB Connection Error

```
Error: connect ECONNREFUSED 127.0.0.1:27017
```

Solution: Start MongoDB
```bash
docker run -d -p 27017:27017 mongo
```

### Port Already in Use

```
Error: listen EADDRINUSE :::3000
```

Solution: Change PORT in .env
```
PORT=3001
```

### CORS Errors

Add frontend URL to CORS whitelist in `src/server/index.ts`:
```typescript
origin: ['http://localhost:5173', 'http://localhost:3000']
```

### Database Indexes Not Created

```bash
# Drop and recreate indexes
mongo software-vala-ai-api-manager
db.apiregistries.dropIndexes()
db.apiregistries.createIndexes()
```

## 📈 Performance Optimization

### Database Indexes

All models include strategic indexes:
- Compound indexes on frequently filtered fields
- TTL indexes on logs (auto-delete after 90 days)
- Unique indexes on apiKey, userId

### Query Optimization

```typescript
// Good: Uses index
await APIRegistry.find({ status: 'online' });

// Better: Also project only needed fields
await APIRegistry.find({ status: 'online' }).select('name provider status');

// Best: Lean queries for read-only
await APIRegistry.find({ status: 'online' }).lean();
```

### Connection Pooling

```typescript
mongoose.connect(MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
});
```

## 🚢 Production Deployment

### Environment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Configure production MongoDB URL (Atlas recommended)
- [ ] Set secure JWT_SECRET (minimum 32 characters)
- [ ] Enable HTTPS/SSL
- [ ] Configure rate limiting
- [ ] Set up monitoring & alerting
- [ ] Enable backup strategy for database
- [ ] Configure API key rotation policy

### Deployment Platforms

**Heroku:**
```bash
git push heroku main
heroku config:set MONGODB_URI=mongodb+srv://...
```

**AWS EC2/Lambda:**
```bash
npm run build
zip -r function.zip dist node_modules
aws lambda create-function ...
```

**Docker on Cloud:**
```bash
docker build -t ai-api-manager .
docker push your-registry/ai-api-manager
```

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Mongoose Guide](https://mongoosejs.com/docs/guide.html)
- [MongoDB Best Practices](https://docs.mongodb.com/manual/reference/bson-type-comparison-order/)
- [Node.js Security](https://nodejs.org/en/docs/guides/security/)

## 📞 Support

For issues or questions:
1. Check troubleshooting section above
2. Review server logs: `npm run dev`
3. Verify MongoDB connection: `mongo`
4. Test API endpoint: `curl http://localhost:3000/health`

---

✅ **Real Production Backend Ready!** - No more mocks, all data persists to MongoDB.
