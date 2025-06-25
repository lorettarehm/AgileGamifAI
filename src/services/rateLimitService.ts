/**
 * Rate Limiting Service
 * 
 * Implements client-side rate limiting to prevent API abuse and 
 * provide basic protection against excessive usage.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number; // Time window in milliseconds
}

class RateLimitService {
  private static readonly STORAGE_KEY = 'agilgamifai_rate_limit';
  private static readonly DEFAULT_CONFIG: RateLimitConfig = {
    maxRequests: 10, // 10 requests per window
    windowMs: 60000, // 1 minute window
  };

  private config: RateLimitConfig;

  constructor(config?: Partial<RateLimitConfig>) {
    this.config = { ...RateLimitService.DEFAULT_CONFIG, ...config };
  }

  /**
   * Check if a request is allowed based on rate limiting
   */
  public isRequestAllowed(): boolean {
    const now = Date.now();
    const entry = this.getRateLimitEntry();

    // Reset if window has expired
    if (now >= entry.resetTime) {
      this.resetRateLimit(now);
      return true;
    }

    // Check if under limit
    return entry.count < this.config.maxRequests;
  }

  /**
   * Record a request and update rate limit counters
   */
  public recordRequest(): void {
    const now = Date.now();
    const entry = this.getRateLimitEntry();

    // Reset if window has expired
    if (now >= entry.resetTime) {
      this.resetRateLimit(now);
      entry.count = 0;
      entry.resetTime = now + this.config.windowMs;
    }

    entry.count += 1;
    this.saveRateLimitEntry(entry);
  }

  /**
   * Get current rate limit status
   */
  public getRateLimitStatus(): {
    remaining: number;
    resetTime: number;
    isLimited: boolean;
  } {
    const now = Date.now();
    const entry = this.getRateLimitEntry();

    // Reset if window has expired
    if (now >= entry.resetTime) {
      return {
        remaining: this.config.maxRequests,
        resetTime: now + this.config.windowMs,
        isLimited: false
      };
    }

    const remaining = Math.max(0, this.config.maxRequests - entry.count);
    return {
      remaining,
      resetTime: entry.resetTime,
      isLimited: remaining === 0
    };
  }

  /**
   * Get time until rate limit resets (in seconds)
   */
  public getResetTimeSeconds(): number {
    const status = this.getRateLimitStatus();
    return Math.max(0, Math.ceil((status.resetTime - Date.now()) / 1000));
  }

  /**
   * Reset rate limiting (useful for testing or manual reset)
   */
  public reset(): void {
    this.resetRateLimit(Date.now());
  }

  private getRateLimitEntry(): RateLimitEntry {
    try {
      const stored = localStorage.getItem(RateLimitService.STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          count: parsed.count || 0,
          resetTime: parsed.resetTime || Date.now() + this.config.windowMs
        };
      }
    } catch (error) {
      console.warn('Failed to parse rate limit data:', error);
    }

    // Return default entry
    return {
      count: 0,
      resetTime: Date.now() + this.config.windowMs
    };
  }

  private saveRateLimitEntry(entry: RateLimitEntry): void {
    try {
      localStorage.setItem(RateLimitService.STORAGE_KEY, JSON.stringify(entry));
    } catch (error) {
      console.warn('Failed to save rate limit data:', error);
    }
  }

  private resetRateLimit(now: number): void {
    const entry: RateLimitEntry = {
      count: 0,
      resetTime: now + this.config.windowMs
    };
    this.saveRateLimitEntry(entry);
  }
}

export const rateLimitService = new RateLimitService();
export default rateLimitService;