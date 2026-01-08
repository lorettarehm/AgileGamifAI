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
        hasApiKey: false, // No API key needed client-side in serverless architecture
        baseUrl: 'http://localhost:8888',
        rateLimit: {
          remaining: expect.any(Number),
          resetTime: expect.any(Number),
        },
      });
    });
  });

  describe('generateGameData', () => {
    it('should call serverless function endpoint', async () => {
      const validGameData = {
        title: 'Test Game',
        description: 'Test description',
        framework: ['Scrum'],
        purpose: ['Team Building'],
        minParticipants: 5,
        maxParticipants: 10,
        duration: 30,
        materials: ['Cards'],
        instructions: 'Test instructions',
        facilitationTips: 'Test tips',
        complexity: 'Medium',
        learningOutcomes: ['Outcome 1'],
        isAccessible: true,
        accessibilityNotes: 'Accessible',
        requiredKnowledgeLevel: 'Agile Basics',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: validGameData }),
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
            systemPrompt,
          }),
        }
      );

      expect(result).toEqual(validGameData);
    });

    it('should handle fetch errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      const partialGameData = { title: 'Test' };
      const systemPrompt = 'Test prompt';

      await expect(llmService.generateGameData(partialGameData, systemPrompt)).rejects.toThrow(
        'Failed to generate game data. Please try again.'
      );
    });
  });

  describe('generateCompleteGame', () => {
    it('should call serverless function endpoint', async () => {
      const validCompleteGame = {
        title: 'Complete Game',
        description: 'Complete description',
        framework: ['Kanban'],
        purpose: ['Problem Solving'],
        minParticipants: 3,
        maxParticipants: 8,
        duration: 45,
        materials: ['Whiteboard', 'Markers'],
        instructions: 'Complete instructions',
        facilitationTips: 'Complete tips',
        complexity: 'Hard',
        learningOutcomes: ['Outcome 1', 'Outcome 2'],
        isAccessible: false,
        accessibilityNotes: '',
        requiredKnowledgeLevel: 'Agile Practitioner',
      };

      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ data: validCompleteGame }),
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
            systemPrompt,
          }),
        }
      );

      expect(result).toEqual(validCompleteGame);
    });
  });
});
