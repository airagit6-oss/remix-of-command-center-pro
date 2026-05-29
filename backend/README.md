# SoftwareVala Backend

Enterprise-grade backend for SoftwareVala.net marketplace with Author, Reseller, Commission, and Payout systems.

## Features

- **Author System**: Product management, revenue tracking, earnings, payouts
- **Reseller System**: Referral tracking, lead management, commission calculation
- **Commission Engine**: Automatic commission calculation on orders and referrals
- **Payout System**: Automated payout processing with multiple payment methods
- **RBAC**: Role-based access control (Guest, Customer, Author, Reseller, Admin, Super Admin)
- **Audit Logging**: Complete audit trail for all critical operations
- **Analytics**: Daily aggregation of revenue, sales, commissions, referrals
- **Security**: JWT authentication, rate limiting, error handling

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Fastify
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Password Hashing**: bcrypt

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn

## Setup

1. **Install dependencies**
```bash
cd backend
npm install
```

2. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/softwarevala?schema=public"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
PORT=3001
NODE_ENV=development
CORS_ORIGIN="http://localhost:3000"
APP_URL="http://localhost:3000"
```

3. **Run database migrations**
```bash
npm run prisma:migrate
```

4. **Generate Prisma client**
```bash
npm run prisma:generate
```

5. **Seed database (optional)**
```bash
npm run seed
```

This creates test users:
- admin@softwarevala.net / admin123
- author@softwarevala.net / author123
- reseller@softwarevala.net / reseller123
- customer@softwarevala.net / customer123

6. **Start development server**
```bash
npm run dev
```

Server runs on `http://localhost:3001`

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login
- `GET /api/v1/auth/me` - Get current user

### Author
- `GET /api/v1/author/dashboard` - Author dashboard data
- `GET /api/v1/author/products` - List author products
- `POST /api/v1/author/products` - Create product
- `PATCH /api/v1/author/products/:id` - Update product
- `DELETE /api/v1/author/products/:id` - Delete product
- `GET /api/v1/author/analytics` - Author analytics
- `GET /api/v1/author/earnings` - Author earnings
- `GET /api/v1/author/payouts` - Author payout history
- `POST /api/v1/author/payouts` - Request payout
- `DELETE /api/v1/author/payouts/:id` - Cancel payout
- `GET /api/v1/author/profile` - Author profile
- `PATCH /api/v1/author/profile` - Update author profile

### Reseller
- `GET /api/v1/reseller/dashboard` - Reseller dashboard data
- `GET /api/v1/reseller/referrals` - List referrals
- `GET /api/v1/reseller/leads` - List leads
- `POST /api/v1/reseller/leads` - Create lead
- `PATCH /api/v1/reseller/leads/:id` - Update lead
- `DELETE /api/v1/reseller/leads/:id` - Delete lead
- `POST /api/v1/reseller/leads/:id/convert` - Convert lead
- `GET /api/v1/reseller/commissions` - List commissions
- `GET /api/v1/reseller/earnings` - Reseller earnings
- `GET /api/v1/reseller/payouts` - Reseller payout history
- `POST /api/v1/reseller/payouts` - Request payout
- `DELETE /api/v1/reseller/payouts/:id` - Cancel payout
- `GET /api/v1/reseller/referral-code` - Get referral code
- `POST /api/v1/reseller/referral-code/regenerate` - Regenerate referral code
- `GET /api/v1/reseller/analytics` - Reseller analytics

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List orders
- `GET /api/v1/orders/:id` - Get order details

### Health
- `GET /health` - Health check

## Database Schema

### Core Tables
- `User` - User accounts with roles
- `AuthorProfile` - Author-specific data
- `ResellerProfile` - Reseller-specific data
- `Product` - Software products
- `ProductMedia` - Product media files
- `Order` - Customer orders
- `OrderItem` - Order line items
- `Referral` - Referral tracking
- `Lead` - Reseller leads
- `LeadActivity` - Lead activity log
- `Commission` - Commission records
- `CommissionRule` - Commission rules
- `Payout` - Payout requests
- `AuthorEarnings` - Author earnings
- `ResellerEarnings` - Reseller earnings
- `AuthorAnalytics` - Author analytics
- `ResellerAnalytics` - Reseller analytics
- `KYCRecord` - KYC verification
- `Notification` - User notifications
- `AuditLog` - Audit trail

## Commission Flow

1. User registers with referral code
2. Referral record created (status: PENDING)
3. User places order
4. Order completion triggers commission calculation
5. Commission created (status: PENDING)
6. Admin approves commission
7. Commission status: APPROVED
8. Earnings status: AVAILABLE
9. Reseller balance updated
10. Reseller requests payout
11. Payout processed
12. Earnings status: PAID

## Security

- JWT authentication with 7-day expiration
- Role-based access control
- Rate limiting (100 req/min)
- Password hashing with bcrypt
- Audit logging for all critical operations
- Input validation
- SQL injection prevention (Prisma ORM)

## Development

### View database
```bash
npm run prisma:studio
```

### Create new migration
```bash
npx prisma migrate dev --name migration_name
```

### Reset database
```bash
npx prisma migrate reset
```

## Production Deployment

1. Set `NODE_ENV=production`
2. Use strong `JWT_SECRET`
3. Configure production database
4. Set proper `CORS_ORIGIN`
5. Use HTTPS
6. Configure reverse proxy (nginx)
7. Enable process manager (PM2)
8. Set up monitoring

## License

Proprietary - SoftwareVala.net
