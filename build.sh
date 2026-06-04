#!/bin/bash

# ════════════════════════════════════════════════════
# PRODUCTION BUILD SCRIPT
# ════════════════════════════════════════════════════

set -e

echo "🚀 Starting production build..."

# Build frontend
echo "📦 Building frontend..."
npm run build

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
npm run prisma:generate

# Return to root
cd ..

echo "✅ Build complete!"
echo "Output locations:"
echo "  - Frontend: dist/"
echo "  - Backend: backend/dist/"
