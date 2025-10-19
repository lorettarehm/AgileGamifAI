import { Game, GameFilters } from '../types';

// Test utilities for creating mock data
export const createMockGame = (overrides: Partial<Game> = {}): Game => ({
  id: '1',
  title: 'Test Game',
  description: 'A test game for testing',
  framework: ['Scrum'],
  purpose: ['Team Building'],
  minParticipants: 3,
  maxParticipants: 10,
  duration: 30,
  materials: ['Whiteboard', 'Sticky notes'],
  instructions: 'Test instructions',
  facilitationTips: 'Test facilitation tips',
  complexity: 'Easy',
  isFavorite: false,
  learningOutcomes: ['Test outcome'],
  isAccessible: true,
  accessibilityNotes: 'Test accessibility notes',
  requiredKnowledgeLevel: 'Agile Basics',
  ...overrides,
});

export const createMockFilters = (overrides: Partial<GameFilters> = {}): GameFilters => ({
  framework: [],
  purpose: [],
  participants: 0,
  maxDuration: 120,
  complexity: [],
  searchTerm: '',
  knowledgeLevel: [],
  accessibleOnly: false,
  ...overrides,
});

export const mockGames: Game[] = [
  createMockGame({
    id: '1',
    title: 'Scrum Team Building',
    framework: ['Scrum'],
    purpose: ['Team Building'],
    complexity: 'Easy',
    duration: 30,
    minParticipants: 5,
    maxParticipants: 10,
  }),
  createMockGame({
    id: '2',
    title: 'Kanban Retrospective',
    framework: ['Kanban'],
    purpose: ['Retrospective'],
    complexity: 'Medium',
    duration: 45,
    minParticipants: 3,
    maxParticipants: 8,
  }),
  createMockGame({
    id: '3',
    title: 'Estimation Planning Poker',
    framework: ['Scrum', 'General'],
    purpose: ['Estimation', 'Planning'],
    complexity: 'Hard',
    duration: 60,
    minParticipants: 4,
    maxParticipants: 12,
  }),
];

// Mock Supabase client
export const mockSupabaseClient = {
  from: jest.fn(() => ({
    select: jest.fn(() => ({
      data: mockGames,
      error: null,
    })),
    insert: jest.fn(() => ({
      data: [],
      error: null,
    })),
    update: jest.fn(() => ({
      eq: jest.fn(() => ({
        data: [],
        error: null,
      })),
    })),
  })),
};

// Mock environment variables
export const mockEnvVars = {
  VITE_SUPABASE_URL: 'https://test.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'test-key',
  // Note: VITE_HF_ACCESS_TOKEN removed - API keys now handled server-side
};
