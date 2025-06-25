# Security Policy

## API Key Security

### Current Implementation

AgileGamifAI uses a client-side architecture with Vite/React. The application requires API keys for LLM functionality through the HuggingFace Inference API.

### Security Considerations

⚠️ **Important**: In client-side applications using Vite, environment variables prefixed with `VITE_` are exposed in the built JavaScript bundle. This means:

- API keys are visible to end users who inspect the built application
- Keys can be extracted from browser developer tools or network requests
- This is a fundamental limitation of client-side only applications

### Current Security Measures

1. **Service Layer Encapsulation**: All API calls are centralized in `src/services/llmService.ts`
2. **Runtime Validation**: API keys are validated before use
3. **Error Handling**: Graceful degradation when keys are missing or invalid
4. **Clear Documentation**: Warnings and guidance about security limitations

### Recommended Production Solutions

For production environments, consider implementing one of these approaches:

#### 1. Backend API (Recommended)
```
Client → Your Backend API → LLM Service
```
- Move all LLM API calls to a backend server
- Keep API keys on the server side only
- Client makes requests to your authenticated backend

#### 2. Serverless Functions
```
Client → Serverless Function → LLM Service
```
- Deploy functions (Vercel Functions, Netlify Functions, AWS Lambda)
- Functions handle LLM API calls securely
- Client calls your functions instead of LLM API directly

#### 3. User-Based API Keys
```
Client → LLM Service (with user's own API key)
```
- Users provide their own API keys
- Keys stored in browser localStorage (still client-side)
- Users responsible for their own API usage and costs

### Environment Variables

Required environment variables:

```bash
# LLM API Key (exposed in client bundle)
VITE_HF_ACCESS_TOKEN=your_huggingface_token

# Database credentials (exposed in client bundle)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Best Practices for Current Implementation

1. **Development Only**: Use this setup for development and testing
2. **Demo Keys**: Use demo/limited API keys for public deployments
3. **Rate Limiting**: Implement client-side rate limiting where possible
4. **Key Rotation**: Regularly rotate API keys
5. **Monitoring**: Monitor API usage for unauthorized access

## Best Practices

### API Key Management

#### Key Rotation Strategies

**Recommended Rotation Schedule:**
- **Development Keys**: Rotate monthly or when team members change
- **Demo/Public Keys**: Rotate weekly or after significant usage spikes
- **Production Keys**: Rotate every 2-4 weeks or immediately if compromised

**Implementation Approach:**
```bash
# Example rotation script
#!/bin/bash
# 1. Generate new API key from provider
# 2. Update environment variables
export VITE_HF_ACCESS_TOKEN="new_token_here"
# 3. Deploy updated configuration
# 4. Monitor for successful transition
# 5. Revoke old key after 24-48 hours
```

**Key Rotation Checklist:**
- [ ] Generate new API key from provider console
- [ ] Test new key in development environment
- [ ] Update environment variables in deployment
- [ ] Monitor API calls for errors or failures
- [ ] Revoke old key after confirming new key works
- [ ] Document rotation in security log

#### Demo and Public Deployment Keys

**Demo Key Best Practices:**
- Use API keys with **strict usage limits** (e.g., 1000 requests/day)
- Create **separate demo accounts** with limited billing
- Set up **spending alerts** at low thresholds ($5-10)
- Use **temporary keys** that expire automatically
- Monitor usage with **automated alerts**

**Public Deployment Recommendations:**
```javascript
// Example demo key configuration
const DEMO_CONFIG = {
  maxRequestsPerHour: 50,
  maxRequestsPerDay: 200,
  alertThreshold: 150, // Alert at 75% of daily limit
  autoDisableThreshold: 200 // Disable at daily limit
};
```

**Demo Key Setup Guide:**
1. Create a separate API account for demo purposes
2. Set strict rate limits (e.g., 100 requests/day)
3. Enable spending caps (e.g., $5/month maximum)
4. Configure usage alerts at 50% and 80% of limits
5. Use descriptive key names (e.g., "AgileGamifAI-Demo-2024")
6. Document key purpose and limits in team documentation

### Rate Limiting Implementation

#### Client-Side Rate Limiting Strategies

**Request Throttling:**
```typescript
// Example implementation in LLM service
class RateLimiter {
  private requests: number[] = [];
  private readonly maxRequests: number;
  private readonly timeWindow: number; // in milliseconds

  constructor(maxRequests = 10, timeWindowMinutes = 1) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindowMinutes * 60 * 1000;
  }

  canMakeRequest(): boolean {
    const now = Date.now();
    // Remove requests older than time window
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }
}
```

**User Experience Considerations:**
- Show **clear rate limit messages** to users
- Display **remaining requests** when approaching limits
- Implement **progressive delays** (exponential backoff)
- Provide **alternative actions** when rate limited
- Cache responses to reduce API calls

**Rate Limiting Configuration:**
```typescript
const RATE_LIMITS = {
  development: { requests: 100, window: 'hour' },
  demo: { requests: 50, window: 'hour' },
  production: { requests: 1000, window: 'hour' }
};
```

#### Implementation Examples

**Basic Rate Limiting:**
```typescript
// Add to LLM service before API calls
if (!this.rateLimiter.canMakeRequest()) {
  throw new Error('Rate limit exceeded. Please wait before making another request.');
}
this.rateLimiter.recordRequest();
```

**Advanced Rate Limiting with User Feedback:**
```typescript
public async generateWithRateLimit(prompt: string): Promise<Response> {
  const remaining = this.rateLimiter.getRemainingRequests();
  
  if (remaining === 0) {
    const resetTime = this.rateLimiter.getResetTime();
    throw new RateLimitError(`Rate limit exceeded. Try again in ${resetTime} minutes.`);
  }
  
  if (remaining <= 5) {
    console.warn(`Approaching rate limit. ${remaining} requests remaining.`);
  }
  
  return this.makeAPICall(prompt);
}
```

### Monitoring and Security

#### Unauthorized Access Detection

**Client-Side Monitoring:**
```typescript
// Example monitoring implementation
class SecurityMonitor {
  private suspiciousPatterns = [
    { pattern: /(.)\1{50,}/, description: 'Repeated character attack' },
    { pattern: /<script|javascript:|data:/i, description: 'Script injection attempt' },
    { pattern: /\b(union|select|insert|delete|drop)\b/i, description: 'SQL injection attempt' }
  ];

  checkInput(input: string): SecurityAlert[] {
    const alerts: SecurityAlert[] = [];
    this.suspiciousPatterns.forEach(({ pattern, description }) => {
      if (pattern.test(input)) {
        alerts.push({ type: 'SUSPICIOUS_INPUT', description, input });
      }
    });
    return alerts;
  }
}
```

**Usage Pattern Monitoring:**
- Track **request frequency** per session
- Monitor **unusual input patterns** (very long prompts, special characters)
- Log **failed authentication attempts**
- Alert on **sudden usage spikes**
- Track **geographic distribution** if using analytics

**Monitoring Implementation:**
```typescript
// Example usage tracking
class UsageTracker {
  private sessionStats = new Map<string, SessionStats>();

  trackRequest(sessionId: string, requestType: string, success: boolean): void {
    const stats = this.sessionStats.get(sessionId) || this.createNewSession();
    stats.requests++;
    stats.lastActivity = Date.now();
    
    if (!success) {
      stats.failures++;
      if (stats.failures > 5) {
        this.flagSuspiciousSession(sessionId, 'High failure rate');
      }
    }
    
    this.sessionStats.set(sessionId, stats);
  }
}
```

#### Monitoring Tools and Services

**Recommended Monitoring Solutions:**
1. **Application Monitoring:**
   - Sentry for error tracking
   - LogRocket for session replay
   - DataDog for performance monitoring

2. **API Usage Monitoring:**
   - Provider dashboards (HuggingFace, OpenAI)
   - Custom usage tracking with localStorage
   - Webhook notifications for usage alerts

3. **Security Monitoring:**
   - Content Security Policy (CSP) violations
   - Unusual request patterns
   - Failed API authentication attempts

**Alert Configuration Examples:**
```javascript
// Usage alert thresholds
const ALERT_THRESHOLDS = {
  hourlyRequests: 100,
  dailyRequests: 500,
  failureRate: 0.1, // 10% failure rate
  suspiciousPatterns: 5 // 5 suspicious inputs per session
};
```

### Implementation Guidelines

#### Environment-Specific Configurations

**Development Environment:**
```bash
# Relaxed limits for development
VITE_HF_ACCESS_TOKEN=dev_token_with_higher_limits
RATE_LIMIT_REQUESTS_PER_HOUR=200
ENABLE_DEBUG_LOGGING=true
```

**Demo Environment:**
```bash
# Strict limits for public demos
VITE_HF_ACCESS_TOKEN=demo_token_with_strict_limits  
RATE_LIMIT_REQUESTS_PER_HOUR=50
ENABLE_USAGE_TRACKING=true
AUTO_DISABLE_ON_LIMIT=true
```

**Production Considerations:**
```bash
# Production should use backend API
# These variables should NOT be used in production
# VITE_HF_ACCESS_TOKEN=NOT_RECOMMENDED_FOR_PRODUCTION
```

#### Security Headers and CSP

**Recommended Content Security Policy:**
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               connect-src 'self' https://api-inference.huggingface.co https://*.supabase.co;
               script-src 'self' 'unsafe-inline';
               style-src 'self' 'unsafe-inline';">
```

**Security Headers for Static Hosting:**
```javascript
// Example for Netlify _headers file
/*
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), microphone=(), camera=()
```

#### Testing Rate Limiting Implementation

**Manual Testing:**
```javascript
// Test rate limiting in browser console
const service = llmService;

// Check current rate limit status
console.log('Rate limit status:', service.getRateLimitStatus());

// Check service status including rate limits
console.log('Service status:', service.getStatus());

// Test multiple rapid requests to trigger rate limiting
async function testRateLimit() {
  for (let i = 0; i < 25; i++) {
    try {
      const status = service.getRateLimitStatus();
      console.log(`Request ${i}: ${status.remaining} remaining`);
      
      if (status.remaining === 0) {
        console.log('Rate limit reached!');
        break;
      }
      
      // This would make an actual API call in a real scenario
      // await service.generateGameData({}, 'test');
    } catch (error) {
      console.log('Rate limit error:', error.message);
      break;
    }
  }
}
```

**Automated Testing Considerations:**
- Rate limiting uses import.meta.env which requires special handling in Jest
- Consider mocking the RateLimiter class for unit tests
- Test rate limiting behavior in integration tests using Cypress or Playwright
- Monitor rate limiting effectiveness in production using analytics

### Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers rather than opening a public issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Security Updates

Security updates will be released as patch versions and documented in the changelog.