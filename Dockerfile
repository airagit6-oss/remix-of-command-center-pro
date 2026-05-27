# Multi-stage production build
FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl

# Install all deps (including dev for build)
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Build stage - frontend + backend
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG VITE_API_BASE=https://technologywala.com/api/v1
ENV VITE_API_BASE=$VITE_API_BASE
RUN npm run build
RUN npm run server:build
RUN npx prisma generate

# Production runtime image
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/dist-server ./dist-server
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./package.json

USER nodejs

EXPOSE 4000

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/health || exit 1

CMD ["node", "dist-server/index.js"]
