import llmService from '../services/llmService';

// Mock fetch for testing
global.fetch = jest.fn();

describe('LLMService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('isAvailable', () => {
    it('should return true (service is always available now)', () => {
      expect(llmService.isAvailable()).toBe(true);
    });
  });

  describe('getStatus', () => {
    it('should return status with secure configuration', () => {
      const status = llmService.getStatus();
      expect(status).toEqual({
        available: true,
        hasApiKey: true, // API keys handled server-side
        model: 'deepseek-ai/deepseek-v2-lite-chat'
      });
    });
  });

  describe('generateGameData', () => {
    it('should call serverless function endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { title: 'Test Game' } })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const partialGameData = { title: 'Partial Game' };
      const systemPrompt = 'Test prompt';

      const result = await llmService.generateGameData(partialGameData, systemPrompt);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/.netlify/functions/generateGameData'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            partialGameData,
            systemPrompt
          })
        }
      );

      expect(result).toEqual({ title: 'Test Game' });
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const partialGameData = { title: 'Test' };
      const systemPrompt = 'Test prompt';

      await expect(
        llmService.generateGameData(partialGameData, systemPrompt)
      ).rejects.toThrow('Failed to generate game data. Please try again.');
    });
  });

  describe('generateCompleteGame', () => {
    it('should call serverless function endpoint', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: { title: 'Complete Game' } })
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const userPrompt = 'Create a game';
      const systemPrompt = 'System prompt';

      const result = await llmService.generateCompleteGame(userPrompt, systemPrompt);

      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/.netlify/functions/generateCompleteGame'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userPrompt,
            systemPrompt
          })
        }
      );

      expect(result).toEqual({ title: 'Complete Game' });
    });
  });
});