/**
 * Tests for security services
 */

import { apiKeyService } from '../services/apiKeyService';
import { rateLimitService } from '../services/rateLimitService';
import { usageMonitoringService } from '../services/usageMonitoringService';

// Mock localStorage
interface MockStorage {
  getItem: jest.MockedFunction<(key: string) => string | null>;
  setItem: jest.MockedFunction<(key: string, value: string) => void>;
  removeItem: jest.MockedFunction<(key: string) => void>;
  clear: jest.MockedFunction<() => void>;
}

const localStorageMock: MockStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('API Key Service', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    localStorageMock.removeItem.mockClear();
    localStorageMock.clear.mockClear();
  });

  it('should validate API keys correctly', () => {
    expect(() => apiKeyService.setUserProvidedKey('')).toThrow('Invalid API key format');
    expect(() => apiKeyService.setUserProvidedKey('invalid')).toThrow('Invalid API key format');
    expect(() => apiKeyService.setUserProvidedKey('hf_valid_key_123')).not.toThrow();
  });

  it('should store and retrieve user-provided keys', () => {
    // Mock the config storage
    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'agilgamifai_user_api_key') {
        return 'hf_test_key';
      }
      if (key === 'agilgamifai_api_config') {
        return JSON.stringify({
          createdAt: new Date().toISOString(),
          lastUsed: null
        });
      }
      return null;
    });
    
    expect(apiKeyService.hasUserProvidedKey()).toBe(true);
    
    const config = apiKeyService.getAPIKeyConfig();
    expect(config?.source).toBe('user-provided');
    expect(config?.key).toBe('hf_test_key');
  });

  it('should fall back to environment keys', () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    const config = apiKeyService.getAPIKeyConfig();
    expect(config?.source).toBe('environment');
    expect(config?.key).toBe('test-token'); // From setupTests.ts
  });

  it('should clear user-provided keys', () => {
    apiKeyService.clearUserProvidedKey();
    
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('agilgamifai_user_api_key');
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('agilgamifai_api_config');
  });
});

describe('Rate Limiting Service', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    rateLimitService.reset();
  });

  it('should allow requests under limit', () => {
    expect(rateLimitService.isRequestAllowed()).toBe(true);
    
    rateLimitService.recordRequest();
    expect(rateLimitService.isRequestAllowed()).toBe(true);
  });

  it('should block requests over limit', () => {
    // Mock localStorage to return a rate limit entry at the limit
    localStorageMock.getItem.mockReturnValue(JSON.stringify({
      count: 10,
      resetTime: Date.now() + 60000
    }));
    
    expect(rateLimitService.isRequestAllowed()).toBe(false);
  });

  it('should provide rate limit status', () => {
    const status = rateLimitService.getRateLimitStatus();
    
    expect(status).toHaveProperty('remaining');
    expect(status).toHaveProperty('resetTime');
    expect(status).toHaveProperty('isLimited');
    expect(typeof status.remaining).toBe('number');
  });

  it('should reset after time window', () => {
    const resetTime = rateLimitService.getResetTimeSeconds();
    expect(typeof resetTime).toBe('number');
    expect(resetTime).toBeGreaterThanOrEqual(0);
  });
});

describe('Usage Monitoring Service', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockClear();
    localStorageMock.setItem.mockClear();
    usageMonitoringService.clearUsageData();
    
    // Mock localStorage to start with empty data
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should log API calls', () => {
    // Mock localStorage to store and retrieve events
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    usageMonitoringService.logAPICall('test-endpoint', 1000, 'user-provided', 'test-model');
    
    const stats = usageMonitoringService.getUsageStats();
    expect(stats.totalCalls).toBe(1);
    expect(stats.averageResponseTime).toBe(1000);
  });

  it('should log errors', () => {
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    usageMonitoringService.logError('test-endpoint', 'Test error', 'environment');
    
    const stats = usageMonitoringService.getUsageStats();
    expect(stats.errors).toBe(1);
  });

  it('should log rate limit hits', () => {
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    usageMonitoringService.logRateLimit('test-endpoint');
    
    const stats = usageMonitoringService.getUsageStats();
    expect(stats.rateLimitHits).toBe(1);
  });

  it('should detect anomalies', () => {
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    // Log many errors to trigger high error rate
    for (let i = 0; i < 3; i++) {
      usageMonitoringService.logAPICall('test', 100, 'user-provided');
      usageMonitoringService.logError('test', 'error', 'user-provided');
    }
    
    const anomalies = usageMonitoringService.detectAnomalies();
    expect(anomalies.highErrorRate).toBe(true);
    expect(anomalies.warnings.length).toBeGreaterThan(0);
  });

  it('should provide recent events', () => {
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    usageMonitoringService.logAPICall('test', 100, 'user-provided');
    usageMonitoringService.logError('test', 'error', 'user-provided');
    
    const recentEvents = usageMonitoringService.getRecentEvents(10);
    expect(recentEvents.length).toBe(2);
    
    // Check that both event types are present
    const eventTypes = recentEvents.map(e => e.type);
    expect(eventTypes).toContain('api_call');
    expect(eventTypes).toContain('error');
  });

  it('should clear usage data', () => {
    const events: Array<Record<string, unknown>> = [];
    localStorageMock.getItem.mockImplementation(() => JSON.stringify(events));
    localStorageMock.setItem.mockImplementation((key, value) => {
      if (key === 'agilgamifai_usage_log') {
        const parsedEvents = JSON.parse(value) as Array<Record<string, unknown>>;
        events.length = 0;
        events.push(...parsedEvents);
      }
    });
    
    usageMonitoringService.logAPICall('test', 100, 'user-provided');
    expect(events.length).toBe(1);
    
    usageMonitoringService.clearUsageData();
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('agilgamifai_usage_log');
  });
});