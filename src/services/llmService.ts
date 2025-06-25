/**
 * LLM Service - Secure API layer for Language Model interactions
 * 
 * SECURITY NOTE: This service encapsulates LLM API access to minimize direct exposure
 * of API keys in component code. However, in a client-side only application, 
 * environment variables prefixed with VITE_ are still exposed in the built bundle.
 * 
 * For production environments, consider:
 * 1. Moving to a backend API that handles LLM calls server-side
 * 2. Using serverless functions as a proxy
 * 3. Implementing user-based API key management
 */

import { HfInference } from '@huggingface/inference';

// Helper function to get environment variables in both Vite and test environments
function getEnvVar(name: string): string | undefined {
  // In test environment, use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }
  
  // In Vite environment, check if import.meta is available
  if (typeof window !== 'undefined' && (window as unknown as { importMeta?: { env: Record<string, string> } }).importMeta?.env) {
    return (window as unknown as { importMeta: { env: Record<string, string> } }).importMeta.env[name];
  }
  
  // Fallback: try to access import.meta safely
  try {
    // @ts-expect-error - This will work in Vite but not in Jest
    return import.meta.env[name];
  } catch {
    return undefined;
  }
}

// Environment configuration with validation
interface LLMConfig {
  apiKey: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
}

// Rate limiting implementation for client-side protection
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

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);
    return Math.max(0, this.maxRequests - this.requests.length);
  }

  getResetTime(): number {
    if (this.requests.length === 0) return 0;
    const oldestRequest = Math.min(...this.requests);
    const resetTime = oldestRequest + this.timeWindow;
    return Math.ceil((resetTime - Date.now()) / (1000 * 60)); // minutes
  }
}

// Custom error for rate limiting
export class RateLimitError extends Error {
  constructor(message: string, public remainingTime?: number) {
    super(message);
    this.name = 'RateLimitError';
  }
}

class LLMService {
  private hf: HfInference | null = null;
  private config: LLMConfig | null = null;
  private initialized = false;
  private rateLimiter: RateLimiter;

  constructor() {
    // Configure rate limits based on environment
    const isDevelopment = process.env.NODE_ENV === 'development' || 
                         getEnvVar('DEV') === 'true';
    const maxRequests = isDevelopment ? 50 : 20; // More lenient for development
    const timeWindow = 1; // 1 minute window
    
    this.rateLimiter = new RateLimiter(maxRequests, timeWindow);
  }

  /**
   * Initialize the LLM service with secure configuration
   */
  private initialize(): void {
    if (this.initialized) return;

    const apiKey = getEnvVar('VITE_HF_ACCESS_TOKEN');
    
    if (!apiKey) {
      console.warn('LLM Service: No API key provided. AI features will be disabled.');
      return;
    }

    if (typeof apiKey !== 'string' || apiKey.trim().length === 0) {
      console.error('LLM Service: Invalid API key format.');
      return;
    }

    this.config = {
      apiKey: apiKey.trim(),
      defaultModel: 'deepseek-ai/deepseek-v2-lite-chat',
      maxTokens: 1000,
      temperature: 0.7
    };

    this.hf = new HfInference(this.config.apiKey);
    this.initialized = true;
  }

  /**
   * Check rate limits before making API calls
   */
  private checkRateLimit(): void {
    if (!this.rateLimiter.canMakeRequest()) {
      const resetTime = this.rateLimiter.getResetTime();
      throw new RateLimitError(
        `Rate limit exceeded. Please wait ${resetTime} minute(s) before making another request.`,
        resetTime
      );
    }
  }

  /**
   * Get rate limit status for user feedback
   */
  public getRateLimitStatus(): { remaining: number; resetTime: number } {
    return {
      remaining: this.rateLimiter.getRemainingRequests(),
      resetTime: this.rateLimiter.getResetTime()
    };
  }
  /**
   * Check if the LLM service is available and properly configured
   */
  public isAvailable(): boolean {
    this.initialize();
    return this.hf !== null && this.config !== null;
  }

  /**
   * Generate game data based on partial input with rate limiting
   */
  public async generateGameData(
    partialGameData: Record<string, unknown>,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available. Please check your API key configuration.');
    }

    // Check rate limits before making API call
    this.checkRateLimit();

    try {
      const prompt = `${systemPrompt}\n\nPartial game data: ${JSON.stringify(partialGameData, null, 2)}\n\nComplete the game data, maintaining any existing values and generating appropriate values for missing fields. Return only the JSON object.`;

      const response = await this.hf!.textGeneration({
        model: this.config!.defaultModel,
        inputs: prompt,
        parameters: {
          max_new_tokens: this.config!.maxTokens,
          temperature: this.config!.temperature,
          return_full_text: false
        }
      });

      // Record successful request for rate limiting
      this.rateLimiter.recordRequest();

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      return JSON.parse(response.generated_text);
    } catch (error) {
      // Don't record failed requests in rate limiter to avoid penalizing users for API errors
      if (error instanceof RateLimitError) {
        throw error; // Re-throw rate limit errors as-is
      }
      console.error('LLM Service: Error generating game data:', error);
      throw new Error('Failed to generate game data. Please try again.');
    }
  }

  /**
   * Generate a complete game based on user prompt with rate limiting
   */
  public async generateCompleteGame(
    userPrompt: string,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available. Please check your API key configuration.');
    }

    // Check rate limits before making API call
    this.checkRateLimit();

    try {
      const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}\n\nResponse:`;

      const response = await this.hf!.textGeneration({
        model: this.config!.defaultModel,
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: this.config!.maxTokens,
          temperature: this.config!.temperature
        }
      });

      // Record successful request for rate limiting
      this.rateLimiter.recordRequest();

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      return JSON.parse(response.generated_text);
    } catch (error) {
      // Don't record failed requests in rate limiter to avoid penalizing users for API errors
      if (error instanceof RateLimitError) {
        throw error; // Re-throw rate limit errors as-is
      }
      console.error('LLM Service: Error generating complete game:', error);
      throw new Error('Failed to generate game suggestion. Please try again.');
    }
  }

  /**
   * Get service status and configuration (for debugging)
   */
  public getStatus(): { 
    available: boolean; 
    hasApiKey: boolean; 
    model?: string;
    rateLimit: { remaining: number; resetTime: number };
  } {
    this.initialize();
    
    return {
      available: this.isAvailable(),
      hasApiKey: !!getEnvVar('VITE_HF_ACCESS_TOKEN'),
      model: this.config?.defaultModel,
      rateLimit: this.getRateLimitStatus()
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;