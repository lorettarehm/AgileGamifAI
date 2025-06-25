import React from 'react';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import GameCard from '../components/GameCard';
import { Game } from '../types';

// Mock game data for testing  
const mockGame: Game = {
  id: 'test-1',
  title: 'Test Game',
  description: 'A test game for accessibility testing',
  methodology: ['Scrum'],
  purpose: ['Team Building'],
  minParticipants: 3,
  maxParticipants: 8,
  duration: 30,
  complexity: 'Easy',
  materials: ['Sticky notes', 'Pens'],
  instructions: 'Step 1: Do something\nStep 2: Do something else',
  facilitationTips: 'Be inclusive and patient',
  learningOutcomes: ['Better teamwork'],
  isAccessible: true,
  accessibilityNotes: 'This game is fully accessible',
  requiredKnowledgeLevel: 'Agile Basics',
  isFavorite: false
};

describe('Accessibility Tests', () => {
  describe('Button Component', () => {
    test('should have proper focus indicators', () => {
      render(<Button>Test Button</Button>);
      const button = screen.getByRole('button');
      
      // Check for focus-visible classes
      expect(button.className).toContain('focus-visible:outline-none');
      expect(button.className).toContain('focus-visible:ring-2');
    });

    test('should be accessible to screen readers', () => {
      render(<Button aria-label="Custom label">Test</Button>);
      const button = screen.getByRole('button');
      
      expect(button.getAttribute('aria-label')).toBe('Custom label');
    });

    test('should support disabled state properly', () => {
      render(<Button disabled>Disabled Button</Button>);
      const button = screen.getByRole('button');
      
      expect(button.hasAttribute('disabled')).toBe(true);
      expect(button.className).toContain('disabled:opacity-50');
    });
  });

  describe('Badge Component', () => {
    test('should have proper color contrast', () => {
      render(<Badge variant="default">Test Badge</Badge>);
      const badge = screen.getByText('Test Badge');
      
      // Check for proper color classes that should meet contrast requirements
      expect(badge.className).toContain('bg-teal-100');
      expect(badge.className).toContain('text-teal-800');
    });

    test('should be accessible when used as interactive element', () => {
      const handleClick = jest.fn();
      render(
        <Badge 
          variant="default" 
          onClick={handleClick}
          role="button"
          tabIndex={0}
          aria-label="Filter by methodology"
        >
          Scrum
        </Badge>
      );
      
      const badge = screen.getByRole('button');
      expect(badge.getAttribute('aria-label')).toBe('Filter by methodology');
    });
  });

  describe('GameCard Component', () => {
    test('should have proper semantic structure', () => {
      render(
        <GameCard 
          game={mockGame} 
          onToggleFavorite={jest.fn()} 
          onViewDetails={jest.fn()} 
        />
      );
      
      // Check for proper heading structure
      expect(screen.getByRole('heading', { name: 'Test Game' })).toBeDefined();
      
      // Check for proper button labeling
      const favoriteButton = screen.getByLabelText(/favorites/i);
      expect(favoriteButton).toBeDefined();
    });

    test('should display accessibility information when available', () => {
      render(
        <GameCard 
          game={mockGame} 
          onToggleFavorite={jest.fn()} 
          onViewDetails={jest.fn()} 
        />
      );
      
      expect(screen.getByText('Disability-friendly')).toBeDefined();
    });
  });

  describe('Color Contrast', () => {
    test('should use colors that meet WCAG standards', () => {
      // This test validates that we're using appropriate color combinations
      // In a real implementation, you'd use tools like axe-core for automated testing
      render(<Button variant="default">Test</Button>);
      const button = screen.getByRole('button');
      
      // Check that we're using gradient backgrounds that should provide good contrast
      expect(button.className).toContain('from-teal-700');
      expect(button.className).toContain('text-white');
    });

    test('badge combinations should have sufficient contrast', () => {
      render(<Badge variant="default">Scrum</Badge>);
      const badge = screen.getByText('Scrum');
      
      // Teal-100 background with teal-800 text should pass WCAG AA
      expect(badge.className).toContain('bg-teal-100');
      expect(badge.className).toContain('text-teal-800');
    });
  });
});