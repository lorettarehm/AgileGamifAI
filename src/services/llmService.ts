/**
 * LLM Service - Secure API layer for Language Model interactions
 *
 * SECURITY IMPROVEMENT: This service now calls secure serverless functions
 * instead of exposing API keys in the client bundle. API keys are kept
 * server-side only, preventing exposure to end users.
 *
 * Architecture:
 * Client → Serverless Function → LLM Service (API keys secure)
 */

import type { Game } from '../types';

// Type for partial game data used in generation
export type PartialGameData = Partial<Omit<Game, 'id' | 'isFavorite'>>;

// Type for complete game data returned from API (without id and isFavorite)
export type GeneratedGameData = Omit<Game, 'id' | 'isFavorite'>;

// Type for environment variables with extended window types
interface ImportMetaEnv {
  env: Record<string, string>;
}

interface WindowWithEnv extends Window {
  importMeta?: ImportMetaEnv;
  env?: Record<string, string>;
}

/**
 * Runtime validation helper for API responses
 * Validates that the response has the expected structure
 */
function isValidGameData(data: unknown): data is GeneratedGameData {
  if (!data || typeof data !== 'object') {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check for required string fields
  const hasRequiredStrings =
    typeof obj.title === 'string' &&
    typeof obj.description === 'string' &&
    typeof obj.instructions === 'string' &&
    typeof obj.facilitationTips === 'string';

  // Check for required array fields
  const hasRequiredArrays =
    Array.isArray(obj.framework) &&
    Array.isArray(obj.purpose) &&
    Array.isArray(obj.materials) &&
    Array.isArray(obj.learningOutcomes);

  // Check for required number fields
  const hasRequiredNumbers =
    typeof obj.minParticipants === 'number' &&
    typeof obj.maxParticipants === 'number' &&
    typeof obj.duration === 'number';

  // Check for required boolean fields
  const hasRequiredBooleans = typeof obj.isAccessible === 'boolean';

  return hasRequiredStrings && hasRequiredArrays && hasRequiredNumbers && hasRequiredBooleans;
}

// Helper function to get environment variables in both Vite and test environments
function getEnvVar(name: string): string | undefined {
  // In any Node.js environment (including Jest), use process.env
  if (typeof process !== 'undefined' && process.env) {
    return process.env[name];
  }

  // In browser environments, try various approaches
  if (typeof window !== 'undefined') {
    const extendedWindow = window as WindowWithEnv;

    // Check if import.meta is available on the window object (some build systems expose it)
    if (extendedWindow.importMeta?.env) {
      return extendedWindow.importMeta.env[name];
    }

    // Check if environment variables are exposed on window (some build systems do this)
    if (extendedWindow.env) {
      return extendedWindow.env[name];
    }
  }

  return undefined;
}

// Environment configuration with validation
interface LLMConfig {
  baseUrl: string;
  generateGameDataEndpoint: string;
  generateCompleteGameEndpoint: string;
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
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);
    return this.requests.length < this.maxRequests;
  }

  recordRequest(): void {
    this.requests.push(Date.now());
  }

  getRemainingRequests(): number {
    const now = Date.now();
    this.requests = this.requests.filter((time) => now - time < this.timeWindow);
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
  constructor(
    message: string,
    public remainingTime?: number
  ) {
    super(message);
    this.name = 'RateLimitError';
  }
}

class LLMService {
  private config: LLMConfig;
  private initialized = false;
  private rateLimiter: RateLimiter;

  constructor() {
    // Configure rate limits based on environment
    const isDevelopment =
      (typeof process !== 'undefined' && process.env.NODE_ENV === 'development') ||
      getEnvVar('DEV') === 'true';
    const maxRequests = isDevelopment ? 50 : 20; // More lenient for development
    const timeWindow = 1; // 1 minute window

    this.rateLimiter = new RateLimiter(maxRequests, timeWindow);

    // Configure endpoints - will work for both local development and production
    this.config = {
      baseUrl: this.getBaseUrl(),
      generateGameDataEndpoint: '/.netlify/functions/generateGameData',
      generateCompleteGameEndpoint: '/.netlify/functions/generateCompleteGame',
    };
  }

  /**
   * Get the appropriate base URL for API calls
   */
  private getBaseUrl(): string {
    // In development, use localhost
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
      return 'http://localhost:8888';
    }
    // In production, use the current origin
    return typeof window !== 'undefined' ? window.location.origin : '';
  }

  /**
   * Initialize the LLM service
   */
  private initialize(): void {
    if (this.initialized) return;
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
      resetTime: this.rateLimiter.getResetTime(),
    };
  }

  /**
   * Check if the LLM service is available and properly configured
   */
  public isAvailable(): boolean {
    this.initialize();
    return true; // Service is available if serverless functions are deployed
  }

  /**
   * Generate game data based on partial input with rate limiting
   */
  public async generateGameData(
    partialGameData: PartialGameData,
    systemPrompt: string
  ): Promise<GeneratedGameData> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available.');
    }

    // Check rate limits before making API call
    this.checkRateLimit();

    try {
      const response = await fetch(
        `${this.config.baseUrl}${this.config.generateGameDataEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partialGameData,
            systemPrompt,
          }),
        }
      );

      // Record successful request for rate limiting
      this.rateLimiter.recordRequest();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Validate response structure before returning
      if (!result || typeof result !== 'object' || !('data' in result)) {
        throw new Error('Invalid API response structure');
      }

      const gameData = result.data as unknown;

      // Runtime validation to ensure type safety
      if (!isValidGameData(gameData)) {
        throw new Error('Invalid game data structure received from API');
      }

      return gameData;
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
  ): Promise<GeneratedGameData> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available.');
    }

    // Check rate limits before making API call
    this.checkRateLimit();

    try {
      const response = await fetch(
        `${this.config.baseUrl}${this.config.generateCompleteGameEndpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userPrompt,
            systemPrompt,
          }),
        }
      );

      // Record successful request for rate limiting
      this.rateLimiter.recordRequest();

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      // Validate response structure before returning
      if (!result || typeof result !== 'object' || !('data' in result)) {
        throw new Error('Invalid API response structure');
      }

      const gameData = result.data as unknown;

      // Runtime validation to ensure type safety
      if (!isValidGameData(gameData)) {
        throw new Error('Invalid game data structure received from API');
      }

      return gameData;
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
    baseUrl: string;
    rateLimit: { remaining: number; resetTime: number };
  } {
    this.initialize();

    return {
      available: this.isAvailable(),
      hasApiKey: !!getEnvVar('VITE_HF_ACCESS_TOKEN'),
      baseUrl: this.config.baseUrl,
      rateLimit: this.getRateLimitStatus(),
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;
