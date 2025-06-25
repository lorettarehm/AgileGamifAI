/**
 * Usage Monitoring Service
 * 
 * Tracks API usage patterns, errors, and performance metrics
 * for security monitoring and optimization.
 */

interface UsageEvent {
  timestamp: number;
  type: 'api_call' | 'error' | 'rate_limit' | 'key_change';
  details: {
    endpoint?: string;
    duration?: number;
    error?: string;
    keySource?: 'environment' | 'user-provided';
    model?: string;
  };
}

interface UsageStats {
  totalCalls: number;
  errors: number;
  rateLimitHits: number;
  averageResponseTime: number;
  lastWeekCalls: number;
  keyChanges: number;
}

class UsageMonitoringService {
  private static readonly STORAGE_KEY = 'agilgamifai_usage_log';
  private static readonly MAX_LOG_ENTRIES = 1000; // Keep last 1000 entries
  private static readonly CLEANUP_THRESHOLD = 1200; // Clean up when exceeding this

  /**
   * Log an API call
   */
  public logAPICall(
    endpoint: string, 
    duration: number, 
    keySource: 'environment' | 'user-provided',
    model?: string
  ): void {
    this.addEvent({
      timestamp: Date.now(),
      type: 'api_call',
      details: {
        endpoint,
        duration,
        keySource,
        model
      }
    });
  }

  /**
   * Log an error
   */
  public logError(endpoint: string, error: string, keySource?: 'environment' | 'user-provided'): void {
    this.addEvent({
      timestamp: Date.now(),
      type: 'error',
      details: {
        endpoint,
        error,
        keySource
      }
    });
  }

  /**
   * Log a rate limit hit
   */
  public logRateLimit(endpoint: string): void {
    this.addEvent({
      timestamp: Date.now(),
      type: 'rate_limit',
      details: {
        endpoint
      }
    });
  }

  /**
   * Log API key change
   */
  public logKeyChange(newKeySource: 'environment' | 'user-provided'): void {
    this.addEvent({
      timestamp: Date.now(),
      type: 'key_change',
      details: {
        keySource: newKeySource
      }
    });
  }

  /**
   * Get usage statistics
   */
  public getUsageStats(): UsageStats {
    const events = this.getEvents();
    const now = Date.now();
    const oneWeekAgo = now - (7 * 24 * 60 * 60 * 1000);

    const apiCalls = events.filter(e => e.type === 'api_call');
    const errors = events.filter(e => e.type === 'error');
    const rateLimitHits = events.filter(e => e.type === 'rate_limit');
    const keyChanges = events.filter(e => e.type === 'key_change');

    const recentCalls = apiCalls.filter(e => e.timestamp >= oneWeekAgo);
    
    const totalDuration = apiCalls.reduce((sum, event) => 
      sum + (event.details.duration || 0), 0
    );
    const averageResponseTime = apiCalls.length > 0 ? totalDuration / apiCalls.length : 0;

    return {
      totalCalls: apiCalls.length,
      errors: errors.length,
      rateLimitHits: rateLimitHits.length,
      averageResponseTime: Math.round(averageResponseTime),
      lastWeekCalls: recentCalls.length,
      keyChanges: keyChanges.length
    };
  }

  /**
   * Get recent events for debugging
   */
  public getRecentEvents(limit: number = 50): UsageEvent[] {
    const events = this.getEvents();
    return events
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  /**
   * Check for suspicious activity patterns
   */
  public detectAnomalies(): {
    highErrorRate: boolean;
    unusualUsageSpike: boolean;
    frequentKeyChanges: boolean;
    warnings: string[];
  } {
    const stats = this.getUsageStats();
    const warnings: string[] = [];
    
    // High error rate (>20%)
    const errorRate = stats.totalCalls > 0 ? stats.errors / stats.totalCalls : 0;
    const highErrorRate = errorRate > 0.2;
    if (highErrorRate) {
      warnings.push(`High error rate detected: ${Math.round(errorRate * 100)}%`);
    }

    // Unusual usage spike (>50 calls in last week)
    const unusualUsageSpike = stats.lastWeekCalls > 50;
    if (unusualUsageSpike) {
      warnings.push(`High usage detected: ${stats.lastWeekCalls} calls in the last week`);
    }

    // Frequent key changes (>5)
    const frequentKeyChanges = stats.keyChanges > 5;
    if (frequentKeyChanges) {
      warnings.push(`Frequent API key changes: ${stats.keyChanges} changes recorded`);
    }

    return {
      highErrorRate,
      unusualUsageSpike,
      frequentKeyChanges,
      warnings
    };
  }

  /**
   * Clear all usage data (for privacy)
   */
  public clearUsageData(): void {
    try {
      localStorage.removeItem(UsageMonitoringService.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to clear usage data:', error);
    }
  }

  private addEvent(event: UsageEvent): void {
    try {
      const events = this.getEvents();
      events.push(event);

      // Clean up old entries if needed
      if (events.length > UsageMonitoringService.CLEANUP_THRESHOLD) {
        const keepEvents = events
          .sort((a, b) => b.timestamp - a.timestamp)
          .slice(0, UsageMonitoringService.MAX_LOG_ENTRIES);
        this.saveEvents(keepEvents);
      } else {
        this.saveEvents(events);
      }
    } catch (error) {
      console.warn('Failed to log usage event:', error);
    }
  }

  private getEvents(): UsageEvent[] {
    try {
      const stored = localStorage.getItem(UsageMonitoringService.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as UsageEvent[];
      }
    } catch (error) {
      console.warn('Failed to parse usage data:', error);
    }
    return [];
  }

  private saveEvents(events: UsageEvent[]): void {
    try {
      localStorage.setItem(UsageMonitoringService.STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.warn('Failed to save usage data:', error);
    }
  }
}

export const usageMonitoringService = new UsageMonitoringService();
export default usageMonitoringService;