/**
 * LLM Service - Secure API layer for Language Model interactions
 * 
 * SECURITY FEATURES:
 * - User-provided API key support with secure localStorage storage
 * - Client-side rate limiting to prevent abuse
 * - Usage monitoring and anomaly detection
 * - Comprehensive error handling and logging
 * 
 * SECURITY NOTE: In client-side applications using Vite, environment variables 
 * prefixed with VITE_ are exposed in the built bundle. This service now supports
 * user-provided API keys as a more secure alternative.
 * 
 * For production environments, still consider:
 * 1. Moving to a backend API that handles LLM calls server-side
 * 2. Using serverless functions as a proxy
 * 3. User-provided API keys (now supported!)
 */

import { HfInference } from '@huggingface/inference';
import { apiKeyService } from './apiKeyService';
import { rateLimitService } from './rateLimitService';
import { usageMonitoringService } from './usageMonitoringService';

// Environment configuration with validation
interface LLMConfig {
  apiKey: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
  keySource: 'environment' | 'user-provided';
}

class LLMService {
  private hf: HfInference | null = null;
  private config: LLMConfig | null = null;
  private initialized = false;

  /**
   * Initialize the LLM service with secure configuration
   */
  private initialize(): void {
    if (this.initialized) return;

    const keyConfig = apiKeyService.getAPIKeyConfig();
    
    if (!keyConfig) {
      console.warn('LLM Service: No API key available. AI features will be disabled.');
      console.warn('Either set VITE_HF_ACCESS_TOKEN in environment or provide your own API key in settings.');
      return;
    }

    if (!this.validateAPIKey(keyConfig.key)) {
      console.error('LLM Service: Invalid API key format.');
      return;
    }

    this.config = {
      apiKey: keyConfig.key,
      defaultModel: 'deepseek-ai/deepseek-v2-lite-chat',
      maxTokens: 1000,
      temperature: 0.7,
      keySource: keyConfig.source
    };

    this.hf = new HfInference(this.config.apiKey);
    this.initialized = true;

    // Log key change if switching sources
    if (keyConfig.source === 'user-provided') {
      usageMonitoringService.logKeyChange('user-provided');
    }
  }

  /**
   * Check if the LLM service is available and properly configured
   */
  public isAvailable(): boolean {
    this.initialize();
    return this.hf !== null && this.config !== null;
  }

  /**
   * Generate game data based on partial input
   */
  public async generateGameData(
    partialGameData: Record<string, unknown>,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    return this.executeWithSecurity('generateGameData', async () => {
      if (!this.isAvailable()) {
        throw new Error('LLM service is not available. Please check your API key configuration.');
      }

      const prompt = `${systemPrompt}\n\nPartial game data: ${JSON.stringify(partialGameData, null, 2)}\n\nComplete the game data, maintaining any existing values and generating appropriate values for missing fields. Return only the JSON object.`;

      const startTime = Date.now();
      const response = await this.hf!.textGeneration({
        model: this.config!.defaultModel,
        inputs: prompt,
        parameters: {
          max_new_tokens: this.config!.maxTokens,
          temperature: this.config!.temperature,
          return_full_text: false
        }
      });

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      // Update usage tracking
      const duration = Date.now() - startTime;
      usageMonitoringService.logAPICall(
        'generateGameData', 
        duration, 
        this.config!.keySource,
        this.config!.defaultModel
      );
      
      if (this.config!.keySource === 'user-provided') {
        apiKeyService.updateLastUsed();
      }

      return JSON.parse(response.generated_text);
    });
  }

  /**
   * Generate a complete game based on user prompt
   */
  public async generateCompleteGame(
    userPrompt: string,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    return this.executeWithSecurity('generateCompleteGame', async () => {
      if (!this.isAvailable()) {
        throw new Error('LLM service is not available. Please check your API key configuration.');
      }

      const fullPrompt = `${systemPrompt}\n\nUser request: ${userPrompt}\n\nResponse:`;

      const startTime = Date.now();
      const response = await this.hf!.textGeneration({
        model: this.config!.defaultModel,
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: this.config!.maxTokens,
          temperature: this.config!.temperature
        }
      });

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      // Update usage tracking
      const duration = Date.now() - startTime;
      usageMonitoringService.logAPICall(
        'generateCompleteGame', 
        duration, 
        this.config!.keySource,
        this.config!.defaultModel
      );
      
      if (this.config!.keySource === 'user-provided') {
        apiKeyService.updateLastUsed();
      }

      return JSON.parse(response.generated_text);
    });
  }

  /**
   * Get service status and configuration (for debugging)
   */
  public getStatus(): { 
    available: boolean; 
    hasApiKey: boolean; 
    keySource?: string;
    model?: string;
    rateLimitStatus?: Record<string, unknown>;
    usageStats?: Record<string, unknown>;
  } {
    this.initialize();
    const keyConfig = apiKeyService.getAPIKeyConfig();
    
    return {
      available: this.isAvailable(),
      hasApiKey: !!keyConfig,
      keySource: keyConfig?.source,
      model: this.config?.defaultModel,
      rateLimitStatus: rateLimitService.getRateLimitStatus() as Record<string, unknown>,
      usageStats: usageMonitoringService.getUsageStats() as Record<string, unknown>
    };
  }

  /**
   * Security wrapper for API calls with rate limiting and error handling
   */
  private async executeWithSecurity<T>(
    endpoint: string, 
    operation: () => Promise<T>
  ): Promise<T> {
    // Check rate limiting
    if (!rateLimitService.isRequestAllowed()) {
      const resetSeconds = rateLimitService.getResetTimeSeconds();
      usageMonitoringService.logRateLimit(endpoint);
      throw new Error(`Rate limit exceeded. Try again in ${resetSeconds} seconds.`);
    }

    try {
      // Record the request
      rateLimitService.recordRequest();
      
      // Execute the operation
      const result = await operation();
      return result;
    } catch (error) {
      // Log the error
      const keyConfig = apiKeyService.getAPIKeyConfig();
      usageMonitoringService.logError(
        endpoint, 
        error instanceof Error ? error.message : 'Unknown error',
        keyConfig?.source
      );
      
      // Re-throw with enhanced error message
      if (error instanceof Error) {
        if (error.message.includes('Rate limit')) {
          throw error; // Don't modify rate limit errors
        }
        throw new Error(`Failed to ${endpoint.replace(/([A-Z])/g, ' $1').toLowerCase()}. Please try again.`);
      }
      throw error;
    }
  }

  private validateAPIKey(key: string): boolean {
    if (!key || typeof key !== 'string') return false;
    const trimmed = key.trim();
    return trimmed.length > 10; // Basic validation
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;