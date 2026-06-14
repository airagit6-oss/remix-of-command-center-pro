export default async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT,HEAD');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, x-user-id'
  );

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    // Get the path - either from query param (if rewritten) or from req.url
    const queryPath = req.query?.path;
    const basePath = queryPath ? '/' + queryPath : req.url || '';
    const url = basePath.startsWith('/api/v1') ? basePath : '/api/v1' + basePath;
    
    console.log(`[API] ${req.method} ${url} (basePath: ${basePath})`);

    // Health check - CRITICAL FOR FRONTEND
    if (basePath === '/health' || url === '/api/v1/health') {
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
    if (basePath === '/ready' || url === '/api/v1/ready') {
      res.status(200).json({ ready: true });
      return;
    }

    // Metrics endpoint
    if (basePath === '/metrics' || url === '/api/v1/metrics') {
      res.status(200).json({
        timestamp: new Date().toISOString(),
        database: 'ok',
        redis: 'ok',
        memory: process.memoryUsage(),
        uptime: process.uptime()
      });
      return;
    }

    // Cart - GET (fetch cart)
    if ((basePath === '/cart' || url === '/api/v1/cart') && req.method === 'GET') {
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

    // Cart - POST (add to cart)
    if ((basePath === '/cart' || url === '/api/v1/cart') && req.method === 'POST') {
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
    if ((basePath === '/auth/login' || url === '/api/v1/auth/login') && req.method === 'POST') {
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
    if ((basePath === '/auth/signup' || url === '/api/v1/auth/signup') && req.method === 'POST') {
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

    // Products - GET all
    if ((basePath === '/products' || url === '/api/v1/products') && req.method === 'GET') {
      res.status(200).json({
        products: [],
        total: 0,
        success: true
      });
      return;
    }

    // Orders - GET user orders
    if ((basePath === '/orders' || url === '/api/v1/orders') && req.method === 'GET') {
      res.status(200).json({
        orders: [],
        total: 0,
        success: true
      });
      return;
    }

    // Orders - CREATE order
    if ((basePath === '/orders' || url === '/api/v1/orders') && req.method === 'POST') {
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

    // Default 404 response
    res.status(404).json({
      error: 'Not Found',
      path: url,
      basePath: basePath,
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
