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

### Reporting Security Issues

If you discover a security vulnerability, please report it privately to the maintainers rather than opening a public issue.

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Security Updates

Security updates will be released as patch versions and documented in the changelog.