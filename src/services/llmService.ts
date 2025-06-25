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

// Configuration for serverless function endpoints
interface LLMConfig {
  baseUrl: string;
  generateGameDataEndpoint: string;
  generateCompleteGameEndpoint: string;
}

class LLMService {
  private config: LLMConfig;
  private initialized = false;

  constructor() {
    // Configure endpoints - will work for both local development and production
    this.config = {
      baseUrl: this.getBaseUrl(),
      generateGameDataEndpoint: '/.netlify/functions/generateGameData',
      generateCompleteGameEndpoint: '/.netlify/functions/generateCompleteGame'
    };
  }

  /**
   * Get the appropriate base URL for API calls
   */
  private getBaseUrl(): string {
    // In production, use the current origin
    // In development, could be configured via environment variable
    if (typeof window !== 'undefined') {
      return window.location.origin;
    }
    return '';
  }

  /**
   * Initialize the LLM service
   */
  private initialize(): void {
    if (this.initialized) return;
    this.initialized = true;
  }

  /**
   * Check if the LLM service is available
   * Now always returns true since we don't need client-side API keys
   */
  public isAvailable(): boolean {
    this.initialize();
    return true; // Service is available if serverless functions are deployed
  }

  /**
   * Generate game data based on partial input
   */
  public async generateGameData(
    partialGameData: Record<string, unknown>,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available.');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.generateGameDataEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partialGameData,
          systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('LLM Service: Error generating game data:', error);
      throw new Error('Failed to generate game data. Please try again.');
    }
  }

  /**
   * Generate a complete game based on user prompt
   */
  public async generateCompleteGame(
    userPrompt: string,
    systemPrompt: string
  ): Promise<Record<string, unknown>> {
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available.');
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.generateCompleteGameEndpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userPrompt,
          systemPrompt
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result.data;
    } catch (error) {
      console.error('LLM Service: Error generating complete game:', error);
      throw new Error('Failed to generate game suggestion. Please try again.');
    }
  }

  /**
   * Get service status and configuration (for debugging)
   */
  public getStatus(): { available: boolean; hasApiKey: boolean; model?: string } {
    this.initialize();
    return {
      available: this.isAvailable(),
      hasApiKey: true, // API keys are now handled server-side
      model: 'deepseek-ai/deepseek-v2-lite-chat' // Model is configured in serverless functions
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;