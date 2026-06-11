# 🧪 QUICK START ENDPOINT TESTING
## Real Backend Validation Against softwarevala.net

**Website:** https://www.softwarevala.net  
**API Base:** https://www.softwarevala.net/api/v1  
**Method:** Browser Console + Manual Testing  

---

## STEP 1: Test API Health

### Open Browser Console
```
Press: F12 → Console tab
Website: https://www.softwarevala.net
```

### Test Health Endpoint
```javascript
// Paste into console:
fetch('/api/v1/health')
  .then(r => r.json())
  .then(d => console.log('Health:', d))

// Expected output:
// Health: { 
//   status: 'healthy',
//   database: 'connected',
//   uptime: 123.45,
//   timestamp: '2026-06-11T...'
// }
```

---

## STEP 2: Test Product Endpoints

### Get Product Details
```javascript
// Test: GET /api/v1/product/prod-10 (CartMax product)
fetch('/api/v1/product/prod-10')
  .then(r => r.json())
  .then(d => {
    console.log('Product:');
    console.log('- Name:', d.name);
    console.log('- Price:', d.price);
    console.log('- Description:', d.description?.substring(0, 50) + '...');
    console.log('- Modules:', d.modules?.length);
    console.log('- Requirements:', d.requirements?.length);
  })

// Expected: Real CartMax product data
```

### Get All Products
```javascript
// Test: GET /api/v1/products
fetch('/api/v1/products')
  .then(r => r.json())
  .then(d => {
    console.log('Products Count:', d.length);
    console.log('First Product:', d[0]);
  })

// Expected: Array of 50+ products
```

### Search Products
```javascript
// Test: GET /api/v1/products?search=cart
fetch('/api/v1/products?search=cart')
  .then(r => r.json())
  .then(d => {
    console.log('Search Results:');
    console.log('- Found:', d.length);
    d.slice(0, 3).forEach(p => 
      console.log(`  - ${p.name} ($${p.price})`)
    );
  })

// Expected: Products matching 'cart'
```

---

## STEP 3: Test Authentication & Cart

### Get Current User
```javascript
// Test: GET /api/v1/me (requires login)
const token = localStorage.getItem('authToken');
fetch('/api/v1/me', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log('User:', d))

// Expected: { id, email, role, ... }
```

### Get Cart
```javascript
// Test: GET /api/v1/cart
const token = localStorage.getItem('authToken');
fetch('/api/v1/cart', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => {
    console.log('Cart:');
    console.log('- Items:', d.items?.length);
    console.log('- Total:', d.total);
    console.log('- Items:', d.items);
  })

// Expected: { items: [...], total: ..., ... }
```

### Add to Cart
```javascript
// Test: POST /api/v1/cart
const token = localStorage.getItem('authToken');
fetch('/api/v1/cart', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    productId: 'prod-10',
    quantity: 1
  })
})
  .then(r => r.json())
  .then(d => console.log('Added to Cart:', d))

// Expected: { success: true, item: {...} }
```

---

## STEP 4: Test Admin Endpoints (if logged in as admin)

### Admin Dashboard
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/v1/admin/dashboard', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log('Admin Dashboard:', d))

// Expected: KPI data, metrics, charts
```

### Admin Reviews
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/v1/admin/reviews', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => {
    console.log('Reviews:');
    console.log('- Total:', d.length);
    d.slice(0, 3).forEach(r =>
      console.log(`  - ${r.title} (${r.status})`)
    );
  })

// Expected: Real reviews, not seed data
```

---

## STEP 5: Test Reseller Endpoints (if logged in as reseller)

### Reseller Products
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/v1/reseller/products', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => {
    console.log('Reseller Products:');
    console.log('- Assigned:', d.length);
    d.slice(0, 2).forEach(p =>
      console.log(`  - ${p.name} ($${p.price})`)
    );
  })

// Expected: Products assigned to reseller
```

### Reseller Users
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/v1/reseller/users', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => {
    console.log('Managed Users:');
    console.log('- Count:', d.length);
  })

// Expected: User list for reseller
```

### Reseller Subscriptions
```javascript
const token = localStorage.getItem('authToken');
fetch('/api/v1/reseller/subscriptions', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => {
    console.log('Subscriptions:');
    console.log('- Count:', d.length);
  })

// Expected: Subscription data
```

---

## STEP 6: Create Comprehensive Test Log

### Copy-Paste This Script

```javascript
// Run this entire script to test all endpoints

const results = {
  endpoints: [],
  errors: [],
  timestamp: new Date().toISOString()
};

async function testEndpoint(name, method, url, needsAuth = false) {
  try {
    const token = localStorage.getItem('authToken');
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    if (needsAuth && token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(url, options);
    const data = await response.json();
    
    const result = {
      name,
      method,
      url,
      status: response.status,
      success: response.ok,
      dataType: Array.isArray(data) ? 'array' : typeof data,
      timestamp: new Date().toISOString()
    };
    
    if (Array.isArray(data)) {
      result.count = data.length;
    }
    
    results.endpoints.push(result);
    console.log(`✅ ${name}: ${response.status}`);
    
  } catch (error) {
    const errorResult = {
      name,
      method,
      url,
      error: error.message,
      timestamp: new Date().toISOString()
    };
    results.errors.push(errorResult);
    console.log(`❌ ${name}: ${error.message}`);
  }
}

// Run all tests
async function runTests() {
  console.log('Starting comprehensive endpoint tests...\n');
  
  // Health
  await testEndpoint('Health', 'GET', '/api/v1/health');
  
  // Products
  await testEndpoint('All Products', 'GET', '/api/v1/products');
  await testEndpoint('Product Detail', 'GET', '/api/v1/product/prod-10');
  await testEndpoint('Search Products', 'GET', '/api/v1/products?search=cart');
  
  // Cart (requires auth)
  await testEndpoint('Get Cart', 'GET', '/api/v1/cart', true);
  
  // Admin (requires admin role)
  await testEndpoint('Admin Dashboard', 'GET', '/api/v1/admin/dashboard', true);
  await testEndpoint('Admin Reviews', 'GET', '/api/v1/admin/reviews', true);
  await testEndpoint('Admin Users', 'GET', '/api/v1/admin/users', true);
  
  // Reseller (requires reseller role)
  await testEndpoint('Reseller Products', 'GET', '/api/v1/reseller/products', true);
  await testEndpoint('Reseller Users', 'GET', '/api/v1/reseller/users', true);
  await testEndpoint('Reseller Subscriptions', 'GET', '/api/v1/reseller/subscriptions', true);
  
  console.log('\n✅ Test Summary:');
  console.log(`- Total Tests: ${results.endpoints.length + results.errors.length}`);
  console.log(`- Successful: ${results.endpoints.length}`);
  console.log(`- Failed: ${results.errors.length}`);
  
  // Output results
  console.log('\nDetailed Results:');
  console.log(JSON.stringify(results, null, 2));
  
  // Copy to clipboard
  const json = JSON.stringify(results, null, 2);
  console.log('\nResults (copy to share):');
  console.log(json);
}

// Execute
runTests().then(() => console.log('\n✅ All tests complete!'));
```

---

## STEP 7: Documentation

### Copy Test Results

```
When tests complete, copy the JSON output:
- Right-click console output
- Select "Copy Object"
- Paste into a file
- Share for review
```

### Expected Format

```json
{
  "endpoints": [
    {
      "name": "Health",
      "method": "GET",
      "url": "/api/v1/health",
      "status": 200,
      "success": true,
      "dataType": "object",
      "timestamp": "2026-06-11T14:30:00Z"
    },
    {
      "name": "All Products",
      "method": "GET",
      "url": "/api/v1/products",
      "status": 200,
      "success": true,
      "dataType": "array",
      "count": 47,
      "timestamp": "2026-06-11T14:30:00Z"
    }
  ],
  "errors": [],
  "timestamp": "2026-06-11T14:30:00Z"
}
```

---

## STEP 8: Analysis

### What Each Result Means

```
✅ Status 200 + success:true
   → Endpoint working perfectly

⚠️ Status 200 + wrong dataType
   → Working but data format unexpected

❌ Status 404
   → Endpoint doesn't exist (needs backend work)

❌ Status 401
   → Authentication required (need login token)

❌ Status 403
   → Permission denied (wrong role)

❌ Status 500
   → Backend error (server issue)
```

---

## NEXT ACTIONS

1. **Open Console** → Run test script
2. **Copy Results** → Share test output
3. **Analyze** → Identify which endpoints work
4. **Document** → Note any discrepancies
5. **Fix** → Replace mocks based on findings

---

## TROUBLESHOOTING

### Script doesn't work?
- Make sure you're on https://www.softwarevala.net (not localhost)
- Check if API is accessible (try health first)
- Verify browser console is open (F12)

### Getting 401 errors?
- You need to be logged in
- Get auth token: `localStorage.getItem('authToken')`
- If empty, login first

### Getting 403 errors?
- Your role doesn't have permission
- Try with admin account for admin endpoints
- Try with reseller account for reseller endpoints

### All 404s?
- Backend might be down
- Test health endpoint first
- Check if API base URL is correct

---

**Ready to test?** Open browser console and run the comprehensive test script above!
