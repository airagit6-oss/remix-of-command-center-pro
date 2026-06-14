#!/usr/bin/env node

/**
 * DEEP DIAGNOSTIC - Backend 404 Error Root Cause Analysis
 * Purpose: Identify why API is returning 404
 */

import fs from 'fs';
import path from 'path';

console.log('\n' + '═'.repeat(80));
console.log('  🔍 DEEP DIAGNOSTIC: Backend 404 Error Analysis');
console.log('═'.repeat(80) + '\n');

const DIAGNOSTICS = {
  issues: [],
  passed: [],
  warnings: []
};

// 1. Check API Configuration
console.log('📋 CHECKING API CONFIGURATION\n');

const viteConfig = fs.readFileSync('vite.config.ts', 'utf8');
console.log('✅ vite.config.ts found');

const envProd = fs.readFileSync('.env.production', 'utf8');
const viteApiUrl = envProd.match(/VITE_API_URL=(.+)/);
if (viteApiUrl) {
  console.log(`✅ VITE_API_URL configured: ${viteApiUrl[1]}`);
  DIAGNOSTICS.passed.push('VITE_API_URL');
} else {
  console.log('❌ VITE_API_URL not configured');
  DIAGNOSTICS.issues.push('VITE_API_URL not set');
}

// 2. Check API Client
console.log('\n📋 CHECKING FRONTEND API CLIENT\n');

if (fs.existsSync('src/lib/api.ts')) {
  const apiClient = fs.readFileSync('src/lib/api.ts', 'utf8');
  
  if (apiClient.includes('VITE_API_URL')) {
    console.log('✅ API client uses VITE_API_URL');
    DIAGNOSTICS.passed.push('API client configuration');
  } else {
    console.log('❌ API client not using VITE_API_URL');
    DIAGNOSTICS.issues.push('API client hardcoded endpoint');
  }
  
  if (apiClient.includes('/api/v1')) {
    console.log('✅ API client targets /api/v1');
    DIAGNOSTICS.passed.push('API prefix');
  } else {
    console.log('⚠️  API client may not target /api/v1');
    DIAGNOSTICS.warnings.push('API prefix not explicitly set');
  }
}

// 3. Check Backend Routes
console.log('\n📋 CHECKING BACKEND ROUTES\n');

const backendRoutes = [
  'backend/src/routes/health.routes.ts',
  'backend/src/routes/cart.routes.ts',
  'backend/src/routes/auth.routes.ts',
  'backend/src/routes/order.routes.ts'
];

backendRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    const content = fs.readFileSync(route, 'utf8');
    const routeName = path.basename(route, '.ts');
    if (content.includes('router') || content.includes('export')) {
      console.log(`✅ ${routeName} implemented`);
      DIAGNOSTICS.passed.push(routeName);
    }
  }
});

// 4. Check Backend Server Setup
console.log('\n📋 CHECKING BACKEND SERVER\n');

if (fs.existsSync('backend/src/server.ts')) {
  const server = fs.readFileSync('backend/src/server.ts', 'utf8');
  
  if (server.includes('app.use') && server.includes('/api')) {
    console.log('✅ Backend routes registered with /api prefix');
    DIAGNOSTICS.passed.push('Backend routes registration');
  } else {
    console.log('❌ Backend routes may not be registered');
    DIAGNOSTICS.issues.push('Backend routes not registered with /api');
  }
  
  if (server.includes('process.env.PORT') || server.includes(':3000') || server.includes(':3001')) {
    console.log('✅ Backend listening on correct port');
    DIAGNOSTICS.passed.push('Backend port config');
  } else {
    console.log('⚠️  Backend port configuration unclear');
    DIAGNOSTICS.warnings.push('Check backend port');
  }
  
  if (server.includes('CORS') || server.includes('cors')) {
    console.log('✅ CORS configured');
    DIAGNOSTICS.passed.push('CORS');
  } else {
    console.log('⚠️  CORS may not be configured');
    DIAGNOSTICS.warnings.push('Check CORS setup');
  }
}

// 5. Check Docker Configuration
console.log('\n📋 CHECKING DOCKER CONFIGURATION\n');

const dockerCompose = fs.readFileSync('docker-compose.yml', 'utf8');
if (dockerCompose.includes('backend') && dockerCompose.includes('frontend')) {
  console.log('✅ Docker Compose has backend and frontend services');
  DIAGNOSTICS.passed.push('Docker Compose services');
} else {
  console.log('⚠️  Docker Compose may be incomplete');
  DIAGNOSTICS.warnings.push('Check Docker Compose services');
}

if (dockerCompose.includes('3000') || dockerCompose.includes('3001')) {
  console.log('✅ Backend port exposed in Docker');
  DIAGNOSTICS.passed.push('Docker backend port');
}

// 6. Check Nginx Reverse Proxy
console.log('\n📋 CHECKING NGINX REVERSE PROXY\n');

if (fs.existsSync('nginx.production.conf')) {
  const nginx = fs.readFileSync('nginx.production.conf', 'utf8');
  
  if (nginx.includes('/api') && (nginx.includes('3000') || nginx.includes('3001'))) {
    console.log('✅ Nginx routes /api to backend');
    DIAGNOSTICS.passed.push('Nginx /api routing');
  } else {
    console.log('❌ Nginx may not route /api properly');
    DIAGNOSTICS.issues.push('Nginx /api routing missing or incorrect');
  }
  
  if (nginx.includes('upstream') || nginx.includes('proxy_pass')) {
    console.log('✅ Nginx has upstream/proxy configuration');
    DIAGNOSTICS.passed.push('Nginx proxy setup');
  }
}

// 7. Summary
console.log('\n' + '═'.repeat(80));
console.log('  📊 DIAGNOSTIC SUMMARY');
console.log('═'.repeat(80) + '\n');

console.log(`✅ Passed: ${DIAGNOSTICS.passed.length}`);
console.log(`❌ Issues: ${DIAGNOSTICS.issues.length}`);
console.log(`⚠️  Warnings: ${DIAGNOSTICS.warnings.length}`);

if (DIAGNOSTICS.issues.length > 0) {
  console.log('\n📋 IDENTIFIED ISSUES:\n');
  DIAGNOSTICS.issues.forEach((issue, i) => {
    console.log(`  ${i+1}. ${issue}`);
  });
}

if (DIAGNOSTICS.warnings.length > 0) {
  console.log('\n⚠️  WARNINGS:\n');
  DIAGNOSTICS.warnings.forEach((warning, i) => {
    console.log(`  ${i+1}. ${warning}`);
  });
}

console.log('\n' + '═'.repeat(80) + '\n');

// Save diagnostic report
fs.writeFileSync('DIAGNOSTIC_REPORT.json', JSON.stringify(DIAGNOSTICS, null, 2));
console.log('📄 Diagnostic report saved to: DIAGNOSTIC_REPORT.json\n');
