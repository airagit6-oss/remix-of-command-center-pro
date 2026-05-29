# Phase 3 — Prompt 3 Payment + Billing Infrastructure System

## Status

Implemented a Stripe-ready enterprise payment and billing backend foundation.

## Added

- Stripe SDK integration layer
- Stripe Checkout Session creation
- Recurring subscription support
- Lifetime/payment-mode checkout support
- Seat-based billing quantity support
- Stripe webhook verification with raw request bodies
- Invoice persistence
- Subscription lifecycle persistence
- Payment transaction model
- Refund workflow endpoint
- Payout request workflow endpoint
- Reseller commission calculation model
- Estimated tax utility layer
- Event outbox persistence for webhook events
- Billing audit records
- Versioned billing routes under `/api/v1/billing`

## Endpoint Surface

- `POST /api/v1/billing/checkout/session`
- `GET /api/v1/billing/subscriptions`
- `PATCH /api/v1/billing/subscriptions/change`
- `GET /api/v1/billing/invoices`
- `POST /api/v1/billing/refunds`
- `POST /api/v1/billing/payouts`
- `POST /api/v1/webhooks/stripe`

## Prisma Billing Models

- `BillingCustomer`
- `BillingPlan`
- `BillingSubscription`
- `PaymentTransaction`
- `Invoice`
- `Commission`
- `Payout`
- `EventOutbox`

## Security Governance

- Payment details are never handled by the app server.
- Stripe Checkout keeps card data PCI-safe.
- Webhooks require Stripe signature verification.
- Billing APIs require authenticated sessions and RBAC permissions.
- Refunds, payouts, and checkout creation are audit-traceable.

## Required Environment

```bash
STRIPE_SECRET_KEY="sk_live_or_test"
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_SUCCESS_URL="https://app.example.com/checkout/success"
STRIPE_CANCEL_URL="https://app.example.com/cart"
```

## Validation Notes

Run after installing dependencies and configuring PostgreSQL:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run server:build
```

The frontend still contains mock checkout/subscription views. The backend infrastructure is present; follow-up work should migrate checkout, subscription admin, reseller subscriptions, and webhook client helpers to these server endpoints.
