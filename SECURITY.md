# Security Policy

## 🚨 CRITICAL SECURITY AWARENESS

**This application exposes API keys in client-side builds. This is a fundamental security limitation that affects all users and deployments.**

## API Key Security

### Current Implementation

AgileGamifAI uses a client-side architecture with Vite/React. The application requires API keys for LLM functionality through the HuggingFace Inference API and database access through Supabase.

### ⚠️ MAJOR SECURITY LIMITATION

**In client-side applications using Vite, environment variables prefixed with `VITE_` are ALWAYS exposed in the built JavaScript bundle.** This means:

- 🔓 **API keys are visible to ALL end users** who inspect the built application
- 🔓 **Keys can be extracted** from browser developer tools or network requests
- 🔓 **Anyone can use your API keys** for their own purposes
- 🔓 **This applies to ALL deployments** (development, staging, production)
- 🔓 **This is NOT a bug** - it's how client-side bundlers work

### 🛡️ Current Security Measures

While we cannot hide API keys in client-side builds, we have implemented these protective measures:

1. **Service Layer Encapsulation**: All API calls are centralized in `src/services/llmService.ts`
2. **Runtime Validation**: API keys are validated before use
3. **Error Handling**: Graceful degradation when keys are missing or invalid
4. **Clear Documentation**: Warnings and guidance about security limitations
5. **Development-First Design**: Architecture optimized for safe development use

### 🏭 Recommended Production Solutions

**IMPORTANT: Do not use this client-side architecture for production with valuable API keys.**

For production environments, implement one of these secure approaches:

#### 1. Backend API (🌟 Recommended)
```
Client → Your Backend API → LLM Service
```
**Benefits:**
- API keys stored securely on server
- Rate limiting and access control
- Usage monitoring and analytics
- User authentication and authorization

**Implementation:**
- Move all LLM API calls to a backend server
- Keep API keys in server environment variables
- Client makes authenticated requests to your backend
- Backend proxies requests to LLM services

#### 2. Serverless Functions
```
Client → Serverless Function → LLM Service
```
**Benefits:**
- No server management required
- Pay-per-use pricing model
- Automatic scaling
- API keys in function environment

**Platforms:**
- Vercel Functions
- Netlify Functions
- AWS Lambda
- Azure Functions
- Google Cloud Functions

#### 3. User-Based API Keys
```
Client → LLM Service (with user's own API key)
```
**Benefits:**
- Users control their own API usage and costs
- No server infrastructure required
- Direct API access

**Considerations:**
- Keys still stored client-side (localStorage)
- Users must manage their own API accounts
- Complex onboarding process

### 🔑 Environment Variables

**ALL of these variables are exposed in the client-side build:**

```bash
# LLM API Key (⚠️ EXPOSED in client bundle)
VITE_HF_ACCESS_TOKEN=your_huggingface_token

# Database credentials (⚠️ EXPOSED in client bundle)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 🛡️ Best Practices for Current Implementation

#### For Development & Testing:
1. **Use Demo Keys**: Create API keys with limited quotas and capabilities
2. **Separate Accounts**: Use different accounts for development vs. production
3. **Regular Rotation**: Rotate API keys frequently (weekly/monthly)
4. **Monitor Usage**: Watch for unexpected API usage that might indicate key misuse
5. **Rate Limiting**: Implement client-side rate limiting where possible

#### For Public Demos & Portfolios:
1. **Demo-Only Keys**: Use keys specifically created for public demonstration
2. **Usage Limits**: Set very low daily/monthly limits on demo keys
3. **Disable Billing**: Ensure demo keys cannot incur charges
4. **Clear Warnings**: Display prominent warnings about API key exposure
5. **Alternative Features**: Consider mock responses for sensitive demo scenarios

#### For Contributors:
1. **Never Commit Keys**: Use `.env.local` (git-ignored) for personal keys
2. **Test Keys Only**: Use dedicated test/demo keys for development
3. **Document Changes**: Update security documentation when adding API integrations
4. **Review Process**: Include security review in pull request process

### 🚫 What NOT To Do

❌ **NEVER use production API keys** in any client-side build  
❌ **NEVER use billing-enabled keys** for public deployments  
❌ **NEVER use high-limit keys** that could be costly if misused  
❌ **NEVER assume keys are hidden** - they are always visible  
❌ **NEVER deploy to production** without implementing backend security

### 👥 Guidance by User Type

#### 🔧 For Developers & Contributors

**Setting up development environment:**
1. Create a HuggingFace account and generate a token with minimal permissions
2. Set up a free Supabase project for testing
3. Use `.env.local` (git-ignored) for your personal API keys
4. Never commit actual API keys to version control
5. Test with limited-quota keys to avoid unexpected charges

**Code contribution guidelines:**
- Review [security impact] for any new API integrations
- Update documentation when adding environment variables
- Consider security implications in pull request descriptions
- Test with demo keys before submitting PRs

#### 🚀 For Deployers & Operators

**For personal/internal use:**
1. Use dedicated demo accounts with spending limits
2. Monitor API usage regularly
3. Rotate keys monthly
4. Consider IP restrictions if supported by the API provider
5. Document which keys are being used where

**For public demonstrations:**
1. Create separate "demo-only" API accounts
2. Set strict usage limits (e.g., 100 requests/day)
3. Use separate Supabase projects with limited data
4. Display clear warnings about the demo nature
5. Monitor for abuse and react quickly

**For production use:**
1. **DO NOT deploy this architecture to production**
2. Implement backend API or serverless functions first
3. See "Recommended Production Solutions" section above
4. Plan migration strategy before going live

#### 📚 For Educators & Workshop Leaders

**Using AgileGamifAI in training:**
1. Set up dedicated training accounts with API providers
2. Use classroom-specific Supabase projects
3. Prepare backup plans for API outages
4. Educate participants about API key security
5. Consider using mock data for sensitive scenarios

#### 🏢 For Enterprise Users

**Important considerations:**
1. This architecture violates most enterprise security policies
2. API keys will be visible to all users
3. Consider this for proof-of-concept only
4. Plan backend implementation before enterprise deployment
5. Consult with security team before any deployment

### 📋 Pre-Deployment Checklist

Before deploying AgileGamifAI anywhere:

- [ ] API keys are demo/test keys with limited quotas
- [ ] Billing limits are set on all API accounts
- [ ] Keys are regularly rotated (set calendar reminders)
- [ ] Usage monitoring is configured
- [ ] Clear security warnings are displayed to users
- [ ] Backup plan exists for API key compromise
- [ ] Team understands this is development/demo architecture only

### 🚨 Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers rather than opening a public issue.

**How to report:**
1. Email the maintainers directly (preferred)
2. Use GitHub's private vulnerability reporting feature
3. Include details about the vulnerability and potential impact
4. Provide steps to reproduce if applicable

**Response timeline:**
- Acknowledgment: Within 48 hours
- Initial assessment: Within 1 week
- Resolution/mitigation: Depends on severity and complexity

## 🚀 Migration Planning

### Phase 1: Immediate Actions (Now)
- [ ] Document current security limitations
- [ ] Implement API key usage monitoring
- [ ] Set up demo keys with strict limits
- [ ] Create security awareness documentation
- [ ] Establish key rotation schedule

### Phase 2: Short-term Improvements (1-3 months)
- [ ] Implement rate limiting on client side
- [ ] Add user warnings about key exposure
- [ ] Create mock/offline mode for demos
- [ ] Set up automated usage alerts
- [ ] Develop backend API specification

### Phase 3: Architecture Migration (3-6 months)
- [ ] Implement backend API or serverless functions
- [ ] Migrate all LLM API calls to server-side
- [ ] Add user authentication and authorization
- [ ] Implement proper secret management
- [ ] Deploy production-ready security architecture

### Phase 4: Production Readiness (6+ months)
- [ ] Complete security audit
- [ ] Implement comprehensive logging and monitoring
- [ ] Add abuse detection and prevention
- [ ] Create incident response procedures
- [ ] Document production security architecture

## 🔗 Related Resources

- [Vite Environment Variables Documentation](https://vitejs.dev/guide/env-and-mode.html)
- [HuggingFace API Security Best Practices](https://huggingface.co/docs/api-inference/security)
- [Supabase Security Guide](https://supabase.com/docs/guides/auth/auth-helpers/security)
- [OWASP Client-Side Security Guidelines](https://owasp.org/www-project-top-ten/)

## Supported Versions

| Version | Supported          | Security Status |
| ------- | ------------------ | --------------- |
| 0.x.x   | :white_check_mark: | Development/Demo Only |

## Security Updates

Security updates will be released as patch versions and documented in the changelog. Given the fundamental security limitation of this architecture, most security improvements will focus on:

1. Better documentation and warnings
2. Improved monitoring and alerting
3. Migration tools and guidance
4. Development security practices