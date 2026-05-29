# Phase 3 — Prompt 2 Auth + RBAC Security Reconstruction

## Status

Implemented the enterprise identity backend foundation for production-grade authentication and RBAC.

## Added

- JWT access token architecture
- Refresh token rotation with hashed refresh-token persistence
- Secure HTTP-only refresh-token cookies
- CSRF token issuing and enforcement middleware
- Express rate limiting for auth and API routes
- bcrypt password hashing
- Device-aware sessions with device ID, user agent, IP address, expiry, revocation, and last-seen tracking
- Role matrix for `SUPER_ADMIN`, `ADMIN`, `RESELLER`, `AUTHOR`, `USER`, `SUPPORT`, and `OPERATIONS`
- API permission middleware with auth-event logging on permission denial
- Auth logs for login success/failure, logout, token refresh, session revoke, permission denial, and suspicious activity
- Prisma PostgreSQL schema for users, sessions, auth events, audit logs, products, and event outbox
- Versioned API gateway under `/api/v1`

## Endpoint Surface

- `GET /api/v1/health`
- `GET /api/v1/auth/csrf`
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `GET /api/v1/auth/sessions`
- `POST /api/v1/auth/sessions/revoke`
- `GET /api/v1/rbac/permissions`
- `GET /api/v1/rbac/matrix`

## Remaining Integration Work

The frontend still contains legacy client-side auth context and guards. The backend identity layer is now present, but Phase 3 follow-up should replace `AuthContext`, route guards, and localStorage-backed auth flows with calls to these endpoints.

## Validation Notes

Dependencies must be installed and Prisma client generated before server typechecking/running:

```bash
npm install
npm run db:generate
npm run server:build
```

A real PostgreSQL `DATABASE_URL` and strong JWT secrets are required in `.env`.
