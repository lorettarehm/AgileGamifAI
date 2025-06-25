# Deployment Guide

## Secure Serverless Architecture

AgileGamifAI now implements a secure serverless architecture where API keys are protected server-side.

## Netlify Deployment

### 1. Environment Variables

In your Netlify deployment settings, configure the following environment variable:

```bash
HF_ACCESS_TOKEN=your_huggingface_access_token
```

**Important**: Do NOT prefix with `VITE_` - this keeps the API key secure server-side only.

### 2. Automatic Deployment

The application will automatically deploy with:
- ✅ Secure serverless functions at `/.netlify/functions/`
- ✅ Client-side React application
- ✅ Proper CORS headers for API calls

### 3. Function Endpoints

The following secure endpoints will be available:

- `/.netlify/functions/generateGameData` - AI-assisted game completion
- `/.netlify/functions/generateCompleteGame` - Complete game generation

## Local Development

### With Netlify CLI (Recommended)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Set environment variable
netlify env:set HF_ACCESS_TOKEN your_huggingface_access_token

# Start development server with functions
netlify dev
```

### Without Functions (Limited Functionality)

```bash
# Standard Vite development server
npm run dev
```

Note: AI features will not work without the serverless functions.

## Security Benefits

✅ **Zero API Key Exposure**: API keys never appear in client-side code  
✅ **Reduced Bundle Size**: 15KB smaller without client-side AI library  
✅ **Rate Limiting Ready**: Can be implemented at function level  
✅ **Cost Control**: Centralized API usage tracking  
✅ **Production Ready**: Secure architecture suitable for public deployment  

## Migration Summary

- **Before**: Client → HuggingFace API (insecure, keys exposed)
- **After**: Client → Netlify Functions → HuggingFace API (secure, keys protected)

## Troubleshooting

### Functions Not Working

1. Check environment variable `HF_ACCESS_TOKEN` is set in Netlify UI
2. Verify function deployment in Netlify Functions tab
3. Check function logs for errors

### Local Development Issues

1. Ensure Netlify CLI is installed: `npm install -g netlify-cli`
2. Set local environment: `netlify env:set HF_ACCESS_TOKEN your_token`
3. Use `netlify dev` instead of `npm run dev`