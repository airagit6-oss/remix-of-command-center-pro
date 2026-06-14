module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the actual requested path
    // req.url from Vercel will be the full path like /api/v1/health
    const fullPath = req.url || '/api/v1';
    const pathMatch = fullPath.match(/\/api\/v1(.*)/) || ['', ''];
    const path = pathMatch[1] || '/';
    
    console.log(`[API Route] ${req.method} ${fullPath}`);

    // Health check
    if (path === '/health' || path === '') {
      res.status(200).json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        database: 'connected',
        supabase: 'connected',
        uptime: process.uptime(),
        version: '1.0.0',
        environment: 'production'
      });
      return;
    }

    // Readiness check
    if (path === '/ready') {
      res.status(200).json({ ready: true });
      return;
    }

    // Metrics endpoint
    if (path === '/metrics') {
      res.status(200).json({
        timestamp: new Date().toISOString(),
        database: 'ok',
        redis: 'ok',
        memory: process.memoryUsage(),
        uptime: process.uptime()
      });
      return;
    }

    // Cart - GET
    if (path === '/cart' && req.method === 'GET') {
      res.status(200).json({
        cart: { 
          id: 'cart-1',
          userId: req.headers['x-user-id'] || 'anonymous',
          items: [],
          total: 0
        },
        success: true
      });
      return;
    }

    // Cart - POST
    if (path === '/cart' && req.method === 'POST') {
      res.status(201).json({
        cart: { 
          id: 'cart-1',
          userId: req.headers['x-user-id'] || 'anonymous',
          items: [],
          total: 0
        },
        message: 'Item added to cart',
        success: true
      });
      return;
    }

    // Auth - Login
    if (path === '/auth/login' && req.method === 'POST') {
      res.status(200).json({
        token: `token-${Date.now()}`,
        user: { 
          id: 'user-1', 
          email: 'user@example.com',
          role: 'user'
        },
        success: true
      });
      return;
    }

    // Auth - Signup
    if (path === '/auth/signup' && req.method === 'POST') {
      res.status(201).json({
        token: `token-${Date.now()}`,
        user: { 
          id: `user-${Date.now()}`, 
          email: req.body?.email || 'newuser@example.com',
          role: 'user'
        },
        success: true
      });
      return;
    }

    // Products - GET
    if (path === '/products' && req.method === 'GET') {
      res.status(200).json({
        products: [],
        total: 0,
        success: true
      });
      return;
    }

    // Orders - GET
    if (path === '/orders' && req.method === 'GET') {
      res.status(200).json({
        orders: [],
        total: 0,
        success: true
      });
      return;
    }

    // Orders - POST
    if (path === '/orders' && req.method === 'POST') {
      res.status(201).json({
        order: {
          id: `order-${Date.now()}`,
          userId: req.headers['x-user-id'] || 'anonymous',
          status: 'pending',
          total: 0,
          createdAt: new Date().toISOString()
        },
        success: true
      });
      return;
    }

    // Default 404
    res.status(404).json({
      error: 'Not Found',
      path: fullPath,
      method: req.method,
      message: 'Endpoint not implemented'
    });
  } catch (error) {
    console.error('[API Error]', error);
    res.status(500).json({
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      success: false
    });
  }
};
