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

// Environment configuration with validation
interface LLMConfig {
  apiKey: string;
  defaultModel: string;
  maxTokens: number;
  temperature: number;
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

    const apiKey = import.meta.env.VITE_HF_ACCESS_TOKEN;
    
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
    if (!this.isAvailable()) {
      throw new Error('LLM service is not available. Please check your API key configuration.');
    }

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

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      return JSON.parse(response.generated_text);
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
      throw new Error('LLM service is not available. Please check your API key configuration.');
    }

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

      if (!response.generated_text) {
        throw new Error('No response generated from LLM service');
      }

      return JSON.parse(response.generated_text);
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
      hasApiKey: !!import.meta.env.VITE_HF_ACCESS_TOKEN,
      model: this.config?.defaultModel
    };
  }
}

// Export singleton instance
export const llmService = new LLMService();
export default llmService;