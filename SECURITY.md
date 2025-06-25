# Security Policy

# Security Policy

## API Key Security

### Current Implementation

AgileGamifAI uses a client-side architecture with Vite/React. The application requires API keys for LLM functionality through the HuggingFace Inference API and includes comprehensive security features to protect users and prevent abuse.

### Security Features

✅ **User-Provided API Keys**: Users can securely provide their own API keys
✅ **Client-Side Rate Limiting**: Prevents API abuse with configurable limits  
✅ **Usage Monitoring**: Tracks API usage patterns and detects anomalies
✅ **Secure Storage**: User keys stored in browser localStorage with validation
✅ **Error Handling**: Comprehensive error logging and graceful degradation

### Security Considerations

⚠️ **Important**: In client-side applications using Vite, environment variables prefixed with `VITE_` are exposed in the built JavaScript bundle. This means:

- Environment API keys are visible to end users who inspect the built application
- Keys can be extracted from browser developer tools or network requests
- This is a fundamental limitation of client-side only applications

**However**, this application now supports user-provided API keys as a more secure alternative:
- Users can provide their own HuggingFace API keys
- Keys are stored securely in browser localStorage
- Users maintain full control over their API usage and costs
- Rate limiting prevents abuse of user-provided keys

### Current Security Measures

1. **Service Layer Encapsulation**: All API calls are centralized in `src/services/llmService.ts`
2. **User-Provided Keys**: Support for secure user-managed API keys via `src/services/apiKeyService.ts`
3. **Rate Limiting**: Client-side rate limiting via `src/services/rateLimitService.ts` (10 requests per minute)
4. **Usage Monitoring**: Comprehensive tracking via `src/services/usageMonitoringService.ts`
5. **Runtime Validation**: API keys are validated before use with proper format checking
6. **Error Handling**: Graceful degradation when keys are missing or invalid
7. **Anomaly Detection**: Automatic detection of suspicious usage patterns
8. **Clear Documentation**: Warnings and guidance about security limitations

### Recommended Production Solutions

For production environments, consider implementing one of these approaches:

#### 1. User-Provided API Keys (Now Supported! ✅)
```
Client → LLM Service (with user's own API key)
```
- **NEW**: Users can now provide their own API keys through the settings interface
- Keys stored securely in browser localStorage (client-side only)
- Users responsible for their own API usage and costs
- Rate limiting prevents abuse
- Usage monitoring helps users track their consumption
- **How to use**: Access the API Key Management interface in the application

#### 2. Backend API (Most Secure)
```
Client → Your Backend API → LLM Service
```
- Move all LLM API calls to a backend server
- Keep API keys on the server side only
- Client makes requests to your authenticated backend
- Requires backend infrastructure setup

#### 3. Serverless Functions
```
Client → Serverless Function → LLM Service
```
- Deploy functions (Vercel Functions, Netlify Functions, AWS Lambda)
- Functions handle LLM API calls securely
- Client calls your functions instead of LLM API directly
- Good balance between security and simplicity

### Security Architecture

The application implements a multi-layered security approach:

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                           │
├─────────────────────────────────────────────────────────────┤
│  API Key Management │  Usage Statistics │ Security Alerts   │
├─────────────────────────────────────────────────────────────┤
│                   Security Services                         │
│  ┌─────────────────┬─────────────────┬─────────────────┐    │
│  │  API Key Service │ Rate Limiting   │ Usage Monitoring │    │
│  │                 │ Service         │ Service         │    │
│  └─────────────────┴─────────────────┴─────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│                      LLM Service                            │
│            (Secure API Layer with Integration)              │
├─────────────────────────────────────────────────────────────┤
│                 HuggingFace API                             │
└─────────────────────────────────────────────────────────────┘
```

**Service Responsibilities:**

- **API Key Service**: Manages user-provided keys, validation, and secure storage
- **Rate Limiting Service**: Prevents abuse with configurable request limits
- **Usage Monitoring Service**: Tracks usage, detects anomalies, provides insights
- **LLM Service**: Orchestrates all services and handles API calls securely

### Environment Variables

Required environment variables:

```bash
# Database credentials (exposed in client bundle)
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# LLM API Key (optional - users can provide their own)
VITE_HF_ACCESS_TOKEN=your_huggingface_token
```

**Note**: The HuggingFace API key is now optional. Users are encouraged to provide their own API keys through the application interface for better security.

### Best Practices for Current Implementation

#### For Users (NEW Features!)

1. **Use Your Own API Key**: Navigate to settings and provide your own HuggingFace API key for better security
2. **Monitor Usage**: Check the usage statistics regularly to track your API consumption
3. **Rate Limiting**: The app automatically limits requests to 10 per minute to prevent abuse
4. **Key Security**: Your personal API key is stored only in your browser and never sent to external servers

#### For Developers

1. **Development Setup**: Use environment keys for development and testing only
2. **Demo Keys**: Use demo/limited API keys for public deployments 
3. **Key Rotation**: Regularly rotate API keys, especially environment keys
4. **Monitor Usage**: Use the built-in monitoring to track API usage patterns
5. **Error Handling**: The application gracefully handles rate limits and API errors
6. **Anomaly Detection**: Review usage alerts for suspicious activity

#### Security Best Practices

1. **API Key Management**:
   - Prefer user-provided keys over environment keys
   - Validate API key format before storage
   - Clear usage data periodically for privacy

2. **Rate Limiting**:
   - Current limit: 10 requests per minute
   - Configurable through `rateLimitService`
   - Users see clear error messages when rate limited

3. **Usage Monitoring**:
   - Tracks all API calls, errors, and rate limit hits
   - Detects anomalies like high error rates or usage spikes
   - Provides detailed statistics for users

4. **Data Privacy**:
   - All user data stored locally in browser
   - No usage data sent to external servers
   - Users can clear their data at any time

### Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers rather than opening a public issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Security Updates

Security updates will be released as patch versions and documented in the changelog.