/**
 * API Key Management Service
 * 
 * Handles secure management of API keys including user-provided keys,
 * storage, and validation with security best practices.
 */

import { getEnvironmentVariable } from '../utils/environment';

export interface APIKeyConfig {
  key: string;
  source: 'environment' | 'user-provided';
  createdAt: Date;
  lastUsed?: Date;
}

class APIKeyService {
  private static readonly STORAGE_KEY = 'agilgamifai_user_api_key';
  private static readonly STORAGE_CONFIG_KEY = 'agilgamifai_api_config';

  /**
   * Get the current API key configuration
   */
  public getAPIKeyConfig(): APIKeyConfig | null {
    // First check for user-provided key
    const userKey = this.getUserProvidedKey();
    if (userKey) {
      return {
        key: userKey,
        source: 'user-provided',
        createdAt: this.getUserKeyCreationDate(),
        lastUsed: this.getUserKeyLastUsed()
      };
    }

    // Fall back to environment key
    let envKey = getEnvironmentVariable('VITE_HF_ACCESS_TOKEN');
    
    // In browser/Vite environment, try import.meta.env
    if (!envKey && typeof window !== 'undefined') {
      try {
        // Use dynamic access to avoid TypeScript errors in test environment
        const importMeta = (globalThis as Record<string, unknown>)?.import;
        const metaObj = importMeta as Record<string, unknown>;
        const envObj = metaObj?.meta as Record<string, unknown>;
        const env = envObj?.env as Record<string, unknown>;
        envKey = env?.VITE_HF_ACCESS_TOKEN as string;
      } catch {
        // Ignore error in test environment
      }
    }
    
    if (envKey) {
      return {
        key: envKey,
        source: 'environment',
        createdAt: new Date(), // We don't track env key creation
        lastUsed: undefined
      };
    }

    return null;
  }

  /**
   * Set a user-provided API key
   */
  public setUserProvidedKey(apiKey: string): void {
    if (!this.validateAPIKey(apiKey)) {
      throw new Error('Invalid API key format');
    }

    const config = {
      createdAt: new Date().toISOString(),
      lastUsed: null
    };

    localStorage.setItem(APIKeyService.STORAGE_KEY, apiKey);
    localStorage.setItem(APIKeyService.STORAGE_CONFIG_KEY, JSON.stringify(config));
  }

  /**
   * Remove user-provided API key
   */
  public clearUserProvidedKey(): void {
    localStorage.removeItem(APIKeyService.STORAGE_KEY);
    localStorage.removeItem(APIKeyService.STORAGE_CONFIG_KEY);
  }

  /**
   * Check if user has provided their own API key
   */
  public hasUserProvidedKey(): boolean {
    return !!this.getUserProvidedKey();
  }

  /**
   * Update last used timestamp for user-provided key
   */
  public updateLastUsed(): void {
    if (!this.hasUserProvidedKey()) return;

    try {
      const configStr = localStorage.getItem(APIKeyService.STORAGE_CONFIG_KEY);
      if (configStr) {
        const config = JSON.parse(configStr);
        config.lastUsed = new Date().toISOString();
        localStorage.setItem(APIKeyService.STORAGE_CONFIG_KEY, JSON.stringify(config));
      }
    } catch (error) {
      console.warn('Failed to update API key last used timestamp:', error);
    }
  }

  /**
   * Get API key usage statistics
   */
  public getUsageStats(): { hasKey: boolean; source: string; daysOld?: number; lastUsed?: string } {
    const config = this.getAPIKeyConfig();
    if (!config) {
      return { hasKey: false, source: 'none' };
    }

    const daysOld = Math.floor((Date.now() - config.createdAt.getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      hasKey: true,
      source: config.source,
      daysOld,
      lastUsed: config.lastUsed?.toISOString()
    };
  }

  private getUserProvidedKey(): string | null {
    try {
      return localStorage.getItem(APIKeyService.STORAGE_KEY);
    } catch (error) {
      console.warn('Failed to access localStorage for API key:', error);
      return null;
    }
  }

  private getUserKeyCreationDate(): Date {
    try {
      const configStr = localStorage.getItem(APIKeyService.STORAGE_CONFIG_KEY);
      if (configStr) {
        const config = JSON.parse(configStr);
        return new Date(config.createdAt);
      }
    } catch (error) {
      console.warn('Failed to get API key creation date:', error);
    }
    return new Date();
  }

  private getUserKeyLastUsed(): Date | undefined {
    try {
      const configStr = localStorage.getItem(APIKeyService.STORAGE_CONFIG_KEY);
      if (configStr) {
        const config = JSON.parse(configStr);
        return config.lastUsed ? new Date(config.lastUsed) : undefined;
      }
    } catch (error) {
      console.warn('Failed to get API key last used date:', error);
    }
    return undefined;
  }

  private validateAPIKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    const trimmed = key.trim();
    return trimmed.length > 10 && trimmed.startsWith('hf_');
  }
}

export const apiKeyService = new APIKeyService();
export default apiKeyService;