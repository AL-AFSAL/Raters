# Movie Rating System Troubleshooting Guide

## Table of Contents
1. [Quick Reference Matrix](#quick-reference-matrix)
2. [Database Connectivity](#database-connectivity)
3. [API Endpoint Functionality](#api-endpoint-functionality)
4. [User Authentication](#user-authentication)
5. [Front-end Components](#front-end-components)
6. [Emergency Procedures](#emergency-procedures)

## Quick Reference Matrix

| Issue Type | Common Symptoms | First Response | Escalation Path |
|------------|----------------|----------------|-----------------|
| Database | Connection timeout | Check connection string | Contact DBA |
| API | 5xx errors | Verify endpoint status | Contact DevOps |
| Auth | Login failures | Check token validity | Contact Security |
| Frontend | Console errors | Clear cache & reload | Contact Frontend Dev |

## Database Connectivity

### Initial Diagnostic Steps
1. Verify connection string format
   ```typescript
   const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
   const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
   ```

2. Check database permissions
   ```sql
   SELECT has_table_privilege('public.ratings', 'SELECT');
   ```

3. Monitor query performance
   ```sql
   EXPLAIN ANALYZE SELECT * FROM ratings WHERE movie_id = 1;
   ```

### Common Error Codes
- `PGRST301`: Invalid credentials
- `PGRST402`: Row-level security violation
- `PGRST504`: Connection timeout

### Resolution Steps
1. Connection Issues
   - Validate environment variables
   - Check network connectivity
   - Verify SSL certificates

2. Permission Problems
   - Review RLS policies
   - Check user role assignments
   - Validate token claims

3. Performance Issues
   - Analyze query plans
   - Check index usage
   - Monitor connection pool

## API Endpoint Functionality

### Health Check Procedures
1. Endpoint availability
   ```typescript
   const checkEndpoint = async (url: string) => {
     const response = await fetch(url);
     return response.ok;
   };
   ```

2. Rate limit monitoring
   ```typescript
   const getRateLimitStatus = (headers: Headers) => ({
     remaining: headers.get('X-RateLimit-Remaining'),
     reset: headers.get('X-RateLimit-Reset')
   });
   ```

### Common HTTP Status Codes
- `429`: Rate limit exceeded
- `401`: Unauthorized
- `503`: Service unavailable

### Troubleshooting Steps
1. Authentication Issues
   - Verify token format
   - Check token expiration
   - Validate permissions

2. Rate Limiting
   - Monitor usage patterns
   - Implement request queuing
   - Add retry logic

## User Authentication

### Session Validation
1. Check token validity
   ```typescript
   const validateToken = async (token: string) => {
     const { data, error } = await supabase.auth.getUser(token);
     return !error;
   };
   ```

2. Verify permissions
   ```typescript
   const checkUserPermissions = async (userId: string) => {
     const { data } = await supabase
       .from('user_roles')
       .select('permissions')
       .eq('user_id', userId);
     return data?.[0]?.permissions || [];
   };
   ```

### Security Protocols
1. CORS configuration
   ```typescript
   const corsHeaders = {
     'Access-Control-Allow-Origin': origin,
     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
     'Access-Control-Allow-Headers': 'Content-Type, Authorization'
   };
   ```

2. CSRF protection
   ```typescript
   const validateCsrfToken = (token: string) => {
     return token === document.querySelector('meta[name="csrf-token"]')
       ?.getAttribute('content');
   };
   ```

## Front-end Components

### Console Error Monitoring
1. Set up error boundary
   ```typescript
   window.addEventListener('error', (event) => {
     logError('Frontend', event.error);
   });
   ```

2. Performance tracking
   ```typescript
   const trackPerformance = () => {
     const metrics = {
       fcp: performance.getEntriesByName('first-contentful-paint')[0],
       lcp: performance.getEntriesByName('largest-contentful-paint')[0]
     };
     return metrics;
   };
   ```

### Browser Compatibility
1. Feature detection
   ```typescript
   const checkBrowserSupport = () => ({
     customElements: 'customElements' in window,
     shadowDOM: 'attachShadow' in Element.prototype,
     modules: 'noModule' in HTMLScriptElement.prototype
   });
   ```

2. CSS compatibility
   ```typescript
   const checkCssSupport = (property: string, value: string) => {
     const element = document.createElement('div');
     element.style[property] = value;
     return element.style[property] === value;
   };
   ```

## Emergency Procedures

### Data Recovery
1. Backup verification
   ```sql
   SELECT pg_is_in_recovery(), pg_last_wal_receive_lsn();
   ```

2. Restore procedure
   ```sql
   BEGIN;
   SAVEPOINT before_recovery;
   -- Recovery steps
   ROLLBACK TO SAVEPOINT before_recovery;
   COMMIT;
   ```

### Contact Information
- Database Team: dba@example.com
- DevOps: devops@example.com
- Security: security@example.com
- Frontend: frontend@example.com

### Escalation Path
1. L1: System Administrator
2. L2: Technical Lead
3. L3: Engineering Manager
4. L4: CTO

Remember to log all issues and resolutions in the incident tracking system.