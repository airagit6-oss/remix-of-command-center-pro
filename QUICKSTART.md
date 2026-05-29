# Enterprise Realtime Ecosystem — QUICKSTART

## 30-Second Setup

### 1. Initialize in App Root
```typescript
import { initializeRealtimeClient } from '@/lib/api'
import { analyticsEngine } from '@/lib/api'
import { validationEngine } from '@/lib/api'

export function App() {
  useEffect(() => {
    // Initialize systems
    initializeRealtimeClient('ws://your-api.com/realtime').connect()
    analyticsEngine.setUserId(currentUser.id)
    
    // Validate on startup
    const report = validationEngine.validateAllPhases()
    console.log('System Status:', report.status)
  }, [])
}
```

## Import Everything From One Place

```typescript
import {
  // Events
  eventBus,
  eventPublishers,
  useEventSubscription,
  useEventHandler,
  useEventHistory,
  
  // Realtime
  getRealtimeClient,
  useRealtime,
  useRealtimeState,
  
  // Notifications
  notificationEngine,
  useNotifications,
  
  // Activity
  activityStream,
  useActivityFeed,
  useActivityStats,
  
  // Dashboards
  dashboardMetricsManager,
  useKPI,
  useDashboard,
  
  // Queues
  queueManager,
  useQueue,
  useJob,
  
  // Analytics
  analyticsEngine,
  useAnalytics,
  
  // Performance
  useSystemHealth,
  usePerformanceMonitor,
  
  // Validation
  validationEngine,
  useValidationReport,
} from '@/lib/api'
```

## Common Patterns

### Display Notifications
```typescript
export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead } = useNotifications(userId)
  
  return (
    <div className="space-y-2">
      <h2>Notifications ({unreadCount})</h2>
      {notifications.map(n => (
        <div
          key={n.id}
          className="p-3 rounded border"
          onClick={() => markAsRead(n.id)}
        >
          <div className="font-bold">{n.title}</div>
          <div className="text-sm">{n.message}</div>
          <time className="text-xs text-gray-500">{n.created_at}</time>
        </div>
      ))}
    </div>
  )
}
```

### Show Activity Feed
```typescript
export function ActivityFeed() {
  const activities = useActivityFeed({
    scope: 'team',  // 'private', 'team', or 'public'
    limit: 50,
  })
  
  return (
    <div className="space-y-1">
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center gap-2">
          <span>{activity.icon}</span>
          <span>{activity.displayText}</span>
          <time className="text-xs ml-auto">{activity.displayTime}</time>
        </div>
      ))}
    </div>
  )
}
```

### Real-Time KPI
```typescript
export function RevenueDashboard() {
  const revenue = useKPI('sales:revenue')
  
  return (
    <div className="p-4 border rounded">
      <div className="text-2xl font-bold">
        ${revenue?.current.toLocaleString()}
      </div>
      <div className={`text-sm ${revenue?.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
        {revenue?.trend} {revenue?.trendPercent?.toFixed(1)}%
      </div>
      {revenue?.target && (
        <div className="text-xs text-gray-500">
          Goal: ${revenue.target.toLocaleString()}
        </div>
      )}
    </div>
  )
}
```

### Monitor System Health
```typescript
export function HealthStatus() {
  const health = useSystemHealth()
  
  return (
    <div className="fixed bottom-4 right-4 p-2 rounded bg-slate-900 text-white text-xs">
      <div>{health.healthy ? '✅ System Healthy' : '⚠️ Issues Detected'}</div>
      {health.warnings.map((w, i) => (
        <div key={i} className="text-yellow-400">{w}</div>
      ))}
    </div>
  )
}
```

### Listen to Events
```typescript
export function OrderMonitor() {
  const [orders, setOrders] = useState([])
  
  // Subscribe to all order events
  useEventSubscription('order', (event) => {
    console.log('Order event:', event.action, event.data)
  })
  
  // Or listen to specific action
  useEventHandler('order', 'completed', (event) => {
    toast.success(`Order ${event.data.order_id} completed!`)
  })
  
  return <div>Orders: {orders.length}</div>
}
```

### Connect to Realtime
```typescript
export function LiveOrdersPage() {
  const [orders, setOrders] = useState([])
  const state = useRealtimeState()
  
  // Subscribe to updates
  useRealtime('orders:new', (event) => {
    setOrders(prev => [event.data, ...prev])
  })
  
  return (
    <div>
      <div className="text-sm text-gray-500">
        Status: {state === 'CONNECTED' ? '🟢 Live' : '⚫ Offline'}
      </div>
      <div className="space-y-2">
        {orders.map(order => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
```

### Track Analytics
```typescript
export function CheckoutButton({ total }) {
  const { track } = useAnalytics()
  
  const handleCheckout = () => {
    track('checkout_started', {
      total,
      items: 3,
      discount: 15,
    })
    // ... proceed with checkout
  }
  
  return <button onClick={handleCheckout}>Checkout ${total}</button>
}
```

### Monitor Queue
```typescript
export function QueueStatus() {
  const emailQueue = useQueue('emails')
  const payoutQueue = useQueue('payouts')
  
  return (
    <div className="grid gap-4">
      <div>
        <h3>Email Queue</h3>
        <p>Pending: {emailQueue?.pending.length}</p>
        <p>Active: {emailQueue?.active.length}</p>
        <p>Failed: {emailQueue?.failed.length}</p>
      </div>
      <div>
        <h3>Payout Queue</h3>
        <p>Pending: {payoutQueue?.pending.length}</p>
        <p>Active: {payoutQueue?.active.length}</p>
      </div>
    </div>
  )
}
```

### Validate System
```typescript
export function SystemStatus() {
  const report = useValidationReport()
  
  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold">
        {report.status === 'production-ready' ? '✅' : '⚠️'} System Status
      </h2>
      <p className="text-sm">{report.summary}</p>
      {report.criticalIssues.length > 0 && (
        <div className="mt-2 text-red-600">
          {report.criticalIssues.map((issue, i) => (
            <p key={i}>🔴 {issue}</p>
          ))}
        </div>
      )}
    </div>
  )
}
```

## Event Types Available

```typescript
// Order Events
eventPublishers.order.orderCreated(id, userId, amount, items)
eventPublishers.order.orderUpdated(id, status)
eventPublishers.order.orderCompleted(id, shippingDate)
eventPublishers.order.orderCancelled(id, reason)

// Product Events
eventPublishers.product.productCreated(id, creatorId, name)
eventPublishers.product.productUpdated(id, updates)
eventPublishers.product.productPublished(id)
eventPublishers.product.productDeleted(id, reason)

// User Events
eventPublishers.user.userSignedUp(id, email)
eventPublishers.user.userLoggedIn(id, device)
eventPublishers.user.userProfileUpdated(id, changes)

// Marketplace Events
eventPublishers.marketplace.productSearched(userId, query)
eventPublishers.marketplace.productFiltered(userId, filters)

// Admin Events
eventPublishers.admin.systemHealthAlert(severity, message)
eventPublishers.admin.fraudDetected(userId, reason)

// And more...
```

## Notification Types

```typescript
// Automatic from events:
'order_created'
'order_shipped'
'order_completed'
'payment_successful'
'payment_failed'
'product_available'
'review_received'
'message_received'
'subscription_expiring'
'payout_completed'
'fraud_detected'
'system_maintenance'
// ... and more
```

## Dashboard Metrics Setup

```typescript
// Initialize dashboard once
dashboardMetricsManager.createDashboard('sales', 'Sales Dashboard', [
  { id: 'revenue', label: 'Revenue', category: 'sales', unit: '$' },
  { id: 'orders', label: 'Orders', category: 'sales' },
  { id: 'customers', label: 'New Customers', category: 'sales' },
])

// Then use in components
const revenue = useKPI('revenue')
const orders = useKPI('orders')
```

## Backend Integration Checklist

Before going to production:

- [ ] WebSocket server running at `ws://your-api.com/realtime`
- [ ] Event persistence layer implemented
- [ ] Job queue backend (Bull/RabbitMQ) configured
- [ ] Notification delivery (email/SMS/push) set up
- [ ] Analytics ingestion API ready
- [ ] Authentication for websocket connections
- [ ] Database schema for events, notifications, jobs
- [ ] Monitoring and alerting configured
- [ ] Load testing completed (1000+ concurrent connections)
- [ ] Disaster recovery plan in place

## Troubleshooting

### Events not triggering notifications?
→ Check `eventRouting.ts` for event→notification mapping

### Websocket not connecting?
→ Verify URL and check browser console for errors

### High memory usage?
→ Call `useSystemHealth()` to check warnings

### Realtime feels slow?
→ Check `usePerformanceMonitor()` for timing metrics

### Need more help?
→ See `REALTIME_IMPLEMENTATION_GUIDE.ts` for detailed docs

## Performance Tips

✅ Use event batching (automatically done)
✅ Check system health regularly
✅ Monitor memory usage
✅ Validate system on startup
✅ Keep event history trimmed
✅ Use role-based channel subscriptions
✅ Test with realistic event volume

## That's It!

You now have a production-grade realtime ecosystem ready to power your application.

Start with notifications, then activity feeds, then dashboards. Add realtime updates as needed.

All systems are independent but work together seamlessly through the event bus.

**Questions?** See `REALTIME_IMPLEMENTATION_GUIDE.ts` or check the TypeScript definitions for full API documentation.
