# Phase 3 — Prompt 8 AI + Automation Infrastructure System

## Status

Implemented the backend foundation for an AI-native enterprise automation platform.

## Added

- AI provider abstraction with safe disabled fallback
- OpenAI-compatible HTTP provider path
- Prompt governance and safety inspection
- Governed prompt construction with role, purpose, and scoped context
- Prompt hashing instead of raw prompt persistence
- AI request audit and usage tracking
- Daily per-user AI usage limiting
- AI memory persistence by user, scope, and key
- Automation rule persistence
- Automation run execution records
- Event outbox integration for automation triggers
- Scheduled automation worker scaffold
- Role-safe AI routes using `ai:use` and `ai:admin`

## Endpoint Surface

- `POST /api/v1/ai/run`
- `GET /api/v1/ai/usage`
- `GET /api/v1/ai/memory`
- `PUT /api/v1/ai/memory`
- `POST /api/v1/ai/automation/rules`
- `GET /api/v1/ai/automation/rules`
- `POST /api/v1/ai/automation/rules/:id/run`

## Governance

- Raw prompts are not stored in Prisma; only SHA-256 prompt hashes are persisted.
- Unsafe prompt patterns are blocked and recorded with safety flags.
- AI routes require authenticated backend sessions.
- AI admin automation routes require elevated `ai:admin` permission.
- Provider failures are converted into controlled API errors.
- `AI_PROVIDER=disabled` provides a safe fallback mode for development.

## Required Environment

```bash
AI_PROVIDER="disabled"
AI_API_KEY=""
AI_MODEL="gpt-4o-mini"
AI_MAX_OUTPUT_TOKENS="1200"
AI_DAILY_USER_LIMIT="100"
AUTOMATION_WORKER_INTERVAL_MS="60000"
```

## Validation Notes

Run after installing dependencies and generating Prisma client:

```bash
npm install
npm run db:generate
npm run db:migrate
npm run server:build
```

The frontend still contains static AI surfaces. The backend AI and automation infrastructure is now present; follow-up work should connect author AI insights, SEO tools, assistant UI, smart notifications, reports, and automation flows to these endpoints.
