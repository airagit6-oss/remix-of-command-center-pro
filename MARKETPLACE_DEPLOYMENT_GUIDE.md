# Marketplace Deployment Guide

## Pre-Deployment Checklist

### Database
- [ ] Run all database migrations in order
- [ ] Verify RLS policies are working
- [ ] Check indexes are created
- [ ] Test database functions
- [ ] Verify triggers are active
- [ ] Backup existing database

### Environment Variables
- [ ] Set SUPABASE_URL
- [ ] Set SUPABASE_ANON_KEY
- [ ] Set SUPABASE_SERVICE_ROLE_KEY
- [ ] Set VITE_SUPABASE_URL
- [ ] Set VITE_SUPABASE_ANON_KEY
- [ ] Configure any third-party API keys

### Edge Functions
- [ ] Deploy marketplace_cart_service
- [ ] Deploy marketplace_checkout_service
- [ ] Deploy marketplace_order_processor
- [ ] Test all edge functions
- [ ] Verify authentication

### Application
- [ ] Build application locally
- [ ] Run tests
- [ ] Check for lint errors
- [ ] Verify all imports
- [ ] Test critical user flows

## Deployment Steps

### 1. Database Migration
```bash
# Link to Supabase project
supabase link --project-ref YOUR_PROJECT_ID

# Push migrations
supabase db push

# Verify migrations
supabase db diff
```

### 2. Deploy Edge Functions
```bash
# Deploy all functions
supabase functions deploy --no-verify-jwt

# Or deploy individually
supabase functions deploy marketplace_cart_service --no-verify-jwt
supabase functions deploy marketplace_checkout_service --no-verify-jwt
supabase functions deploy marketplace_order_processor --no-verify-jwt
```

### 3. Build Application
```bash
# Install dependencies
npm ci

# Build for production
npm run build

# Preview build locally
npm run preview
```

### 4. Deploy to Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 5. Verify Deployment
- [ ] Check homepage loads
- [ ] Test marketplace catalog
- [ ] Test cart functionality
- [ ] Test checkout flow
- [ ] Test authentication
- [ ] Check console for errors
- [ ] Verify API calls

## Post-Deployment

### Monitoring
- Set up error tracking (Sentry)
- Configure performance monitoring
- Set up uptime monitoring
- Configure alerting

### Analytics
- Set up Google Analytics
- Configure event tracking
- Set up conversion tracking
- Verify data collection

### Security
- Run security audit
- Check for vulnerabilities
- Verify SSL certificates
- Test authentication flows

## Rollback Procedure

If deployment fails:

### Database Rollback
```bash
# View migration history
supabase migration list

# Rollback to previous migration
supabase migration down
```

### Application Rollback
```bash
# Revert to previous commit
git checkout PREVIOUS_COMMIT_HASH

# Rebuild and deploy
npm run build
vercel --prod
```

## Troubleshooting

### Common Issues

**Migration Fails**
- Check database connection
- Verify migration order
- Check for conflicts with existing data
- Review migration logs

**Edge Function Errors**
- Check function logs in Supabase dashboard
- Verify environment variables
- Check authentication headers
- Review function code for errors

**Build Fails**
- Check for missing dependencies
- Verify TypeScript errors
- Check for circular dependencies
- Review build logs

**Runtime Errors**
- Check browser console
- Verify API endpoints
- Check network requests
- Review error logs

## Maintenance

### Regular Tasks
- Weekly: Check error logs
- Monthly: Review performance metrics
- Quarterly: Security audit
- Annually: Full system review

### Database Maintenance
- Run VACUUM ANALYZE monthly
- Check table sizes
- Review slow queries
- Optimize indexes

### Application Updates
- Test updates in staging
- Run full test suite
- Backup before deploying
- Monitor after deployment

## Support

### Emergency Contacts
- Database: Supabase Support
- Hosting: Vercel Support
- Monitoring: Internal team

### Documentation
- Architecture: MARKETPLACE_ARCHITECTURE.md
- Progress: MARKETPLACE_PROGRESS_REPORT.md
- Final Report: MARKETPLACE_FINAL_REPORT.md
- Gap Analysis: MARKETPLACE_GAP_ANALYSIS.md
