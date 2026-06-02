/**
 * Production Frontend Server
 * ════════════════════════════════════════════════════
 * Serves built Vite frontend on configurable port
 * Handles SPA routing with index.html fallback
 * 
 * Entry point for PM2 in production
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Determine dist directory location
const distPath = path.join(__dirname, 'dist');

// Check if dist exists
if (!fs.existsSync(distPath)) {
  console.error(`ERROR: dist directory not found at ${distPath}`);
  console.error('Please run: npm run build');
  process.exit(1);
}

// ──────────────────────────────────────────────────────
// SECURITY HEADERS
// ──────────────────────────────────────────────────────

app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https: wss:; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';"
  );
  next();
});

// ──────────────────────────────────────────────────────
// GZIP COMPRESSION
// ──────────────────────────────────────────────────────

app.use(express.compress?.());

// ──────────────────────────────────────────────────────
// STATIC FILES
// ──────────────────────────────────────────────────────

// Serve built assets from dist
app.use(express.static(distPath, {
  maxAge: '1y',
  etag: false,
  dotfiles: 'deny',
}));

// Cache busting for assets
app.use('/assets', express.static(path.join(distPath, 'assets'), {
  maxAge: '1y',
  immutable: true,
  etag: false,
}));

// ──────────────────────────────────────────────────────
// SPA ROUTING
// ──────────────────────────────────────────────────────

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes should NOT be served by this server
// They go through nginx proxy to backend:3001
app.all('/api/*', (req, res) => {
  res.status(404).json({ error: 'API routes are proxied through nginx' });
});

// SPA fallback: serve index.html for all other routes
app.get('*', (req, res) => {
  // Don't serve index.html for certain file types
  const ext = path.extname(req.path);
  if (ext && ext !== '.html') {
    return res.status(404).send('Not found');
  }

  const indexPath = path.join(distPath, 'index.html');
  
  if (!fs.existsSync(indexPath)) {
    console.error(`ERROR: index.html not found at ${indexPath}`);
    return res.status(404).send('index.html not found');
  }

  res.setHeader('Cache-Control', 'no-cache, must-revalidate');
  res.sendFile(indexPath);
});

// ──────────────────────────────────────────────────────
// ERROR HANDLING
// ──────────────────────────────────────────────────────

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// ──────────────────────────────────────────────────────
// SERVER START
// ──────────────────────────────────────────────────────

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Frontend server running on port ${PORT}`);
  console.log(`   Serving: ${distPath}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   URL: http://0.0.0.0:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => {
    console.log('Server shut down');
    process.exit(0);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});
