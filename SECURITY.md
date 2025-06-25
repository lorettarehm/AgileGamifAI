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

## User-Provided API Keys

### Overview

When deploying AgileGamifAI in environments where users supply their own HuggingFace API keys, this approach shifts the responsibility and cost of AI features to individual users while providing them with full control over their API usage.

### Storage Implementation

**localStorage Storage**:
- API keys are stored in the browser's localStorage when provided by users
- Keys persist across browser sessions until manually cleared
- Storage is isolated per domain and user profile
- Keys remain accessible to JavaScript running on the same origin

### Security Trade-offs

**Advantages**:
- ✅ No shared API key exposed in application bundle
- ✅ Users maintain full control over their API usage and costs
- ✅ No central API key management required
- ✅ Scales naturally with user base

**Risks and Limitations**:
- ⚠️ **Client-side storage**: Keys stored in localStorage are accessible to any JavaScript code running on the domain
- ⚠️ **Browser access**: Keys can be viewed through browser developer tools
- ⚠️ **XSS vulnerability**: Malicious scripts could potentially access stored keys
- ⚠️ **No server-side validation**: Application cannot validate key authenticity before use
- ⚠️ **User education required**: Users must understand security implications

### User Responsibilities

**API Key Management**:
- Obtain API keys from HuggingFace directly
- Keep keys confidential and never share them
- Regularly rotate API keys (recommended: monthly)
- Monitor API usage and billing on HuggingFace platform
- Revoke compromised keys immediately

**Security Best Practices**:
- Use dedicated API keys for this application (not shared across services)
- Consider using keys with limited permissions where possible
- Log out or clear browser data when using shared/public computers
- Be aware that API usage will be billed to their account

**Cost Management**:
- Understand HuggingFace pricing model
- Monitor API usage to avoid unexpected charges
- Set up billing alerts on HuggingFace platform
- Consider API rate limiting in their own usage patterns

### UI/UX Implementation Guidance

**Key Input Interface**:
```typescript
// Recommended input component features
interface APIKeyInputProps {
  onKeySubmit: (key: string) => void;
  onKeyClear: () => void;
  isValid?: boolean;
  validationMessage?: string;
}
```

**Best Practices for Key Input**:
- Use password-type input fields to hide keys during entry
- Provide clear validation feedback (key format, test connection)
- Include "Show/Hide" toggle for key verification
- Offer "Test Key" functionality before saving
- Provide clear instructions on obtaining keys from HuggingFace

**Error Handling**:
- **Invalid Key Format**: Clear message about expected format
- **Authentication Failures**: Guide users to check key validity
- **Rate Limiting**: Inform users about temporary restrictions
- **Network Issues**: Distinguish between connectivity and authentication problems

**User Education Elements**:
- Link to HuggingFace API key generation documentation
- Explain what the key is used for (AI game generation features)
- Provide cost estimates or usage guidelines
- Include security warnings about key confidentiality

### Implementation Example

```typescript
// Example localStorage key management
class UserAPIKeyManager {
  private static readonly STORAGE_KEY = 'hf_api_key';
  
  static setKey(key: string): void {
    if (this.validateKeyFormat(key)) {
      localStorage.setItem(this.STORAGE_KEY, key);
    } else {
      throw new Error('Invalid API key format');
    }
  }
  
  static getKey(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }
  
  static clearKey(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
  static hasKey(): boolean {
    return !!this.getKey();
  }
  
  private static validateKeyFormat(key: string): boolean {
    // HuggingFace API keys start with 'hf_'
    return typeof key === 'string' && key.startsWith('hf_') && key.length > 10;
  }
}
```

### Recommended User Workflow

1. **First-time Setup**:
   - User visits application
   - Prompted to enter HuggingFace API key for AI features
   - Key is validated and tested with a simple API call
   - Key stored in localStorage upon successful validation

2. **Ongoing Usage**:
   - Key automatically loaded from localStorage
   - Periodic validation to ensure key is still active
   - Clear error messages if key becomes invalid
   - Option to update or remove key from settings

3. **Error Recovery**:
   - Clear guidance when key expires or becomes invalid
   - Easy path to update or replace keys
   - Graceful degradation when AI features are unavailable

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
