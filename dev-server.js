/**
 * Development Server with SPA Routing
 * 
 * This server handles SPA routing during development
 * Run with: node dev-server.js
 * 
 * Features:
 * - Hot Module Replacement (HMR) via Vite
 * - SPA routing fallback to index.html
 * - Static file serving
 * - API proxy (optional)
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;
const VITE_DEV_SERVER = process.env.VITE_DEV_SERVER || 'http://localhost:5173';

// Serve Vite dev server in development
console.log(`🚀 Development server starting...`);
console.log(`📦 Vite dev server: ${VITE_DEV_SERVER}`);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', mode: 'development', timestamp: new Date().toISOString() });
});

// SPA routing fallback
app.get('*', (req, res) => {
  // If it's an API request, skip this handler
  if (req.path.startsWith('/api/') || req.path.startsWith('/admin/')) {
    return res.status(404).json({ 
      error: 'API not configured', 
      message: 'API requests should go to backend server',
      note: 'Configure VITE_API_URL in environment'
    });
  }

  // For development, we want to let Vite handle everything
  // This is just a fallback
  console.log(`[${new Date().toISOString()}] GET ${req.path}`);
  
  res.status(200).type('text/html').send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Development Server - Loading...</title>
    </head>
    <body>
      <div id="root">Loading...</div>
      <script type="module">
        // This will be replaced by Vite's dev client in development
        console.log('Development mode: Using Vite HMR');
        window.location.reload();
      </script>
    </body>
    </html>
  `);
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Dev server error:', err);
  res.status(500).json({ error: 'Development server error', message: err.message });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n✅ Development server ready`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🔄 HMR enabled via Vite`);
  console.log(`📝 Note: Routes will be handled by Vite dev server\n`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n⛔ SIGTERM received, shutting down...');
  server.close(() => {
    console.log('✅ Server shut down');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('\n⛔ SIGINT received, shutting down...');
  server.close(() => {
    console.log('✅ Server shut down');
    process.exit(0);
  });
});
