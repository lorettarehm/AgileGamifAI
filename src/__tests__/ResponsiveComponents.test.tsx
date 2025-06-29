import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameCard from '../components/GameCard';
import Header from '../components/Header';
import { Game } from '../types';

const mockGame: Game = {
  id: '1',
  title: 'Test Game',
  description: 'Test Description',
  framework: ['Scrum'],
  purpose: ['Team Building'],
  minParticipants: 5,
  maxParticipants: 10,
  duration: 30,
  materials: ['Sticky notes'],
  instructions: 'Test instructions',
  facilitationTips: 'Test tips',
  complexity: 'Medium',
  isFavorite: false,
  learningOutcomes: ['Test outcome'],
  isAccessible: true,
  accessibilityNotes: 'Test accessibility notes',
  requiredKnowledgeLevel: 'Agile Basics'
};

describe('Responsive Components', () => {
  test('GameCard renders with responsive classes', () => {
    const mockToggleFavorite = jest.fn();
    const mockViewDetails = jest.fn();
    
    render(
      <GameCard 
        game={mockGame} 
        onToggleFavorite={mockToggleFavorite}
        onViewDetails={mockViewDetails}
      />
    );
    
    // Check that title has responsive text sizing
    const title = screen.getByText('Test Game');
    expect(title).toHaveClass('text-lg', 'sm:text-xl');
    
    // Check that description has responsive text sizing
    const description = screen.getByText('Test Description');
    expect(description).toHaveClass('text-sm', 'sm:text-base');
    
    // Verify button has responsive text sizing
    const viewDetailsButton = screen.getByText('View Details');
    expect(viewDetailsButton).toHaveClass('text-sm', 'sm:text-base');
  });

  test('Header renders with responsive classes', () => {
    const mockViewChange = jest.fn();
    
    render(
      <Header 
        currentView="library" 
        onViewChange={mockViewChange}
      />
    );
    
    // Check that header has responsive padding
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('px-4', 'sm:px-6');
    
    // Check that title has responsive text sizing
    const title = screen.getByText('Agile Games');
    expect(title).toHaveClass('text-lg', 'sm:text-xl');
  });

  test('GameCard participant info has responsive text sizing', () => {
    const mockToggleFavorite = jest.fn();
    const mockViewDetails = jest.fn();
    
    render(
      <GameCard 
        game={mockGame} 
        onToggleFavorite={mockToggleFavorite}
        onViewDetails={mockViewDetails}
      />
    );
    
    // Check that participant info has responsive text sizing
    const participantInfo = screen.getByText('5 - 10 participants');
    expect(participantInfo).toHaveClass('text-xs', 'sm:text-sm');
    
    // Check that duration info has responsive text sizing
    const durationInfo = screen.getByText('30 minutes');
    expect(durationInfo).toHaveClass('text-xs', 'sm:text-sm');
  });

  test('Accessibility friendly game displays correctly on mobile', () => {
    const mockToggleFavorite = jest.fn();
    const mockViewDetails = jest.fn();
    
    render(
      <GameCard 
        game={mockGame} 
        onToggleFavorite={mockToggleFavorite}
        onViewDetails={mockViewDetails}
      />
    );
    
    // Check that accessibility info has responsive text sizing
    const accessibilityInfo = screen.getByText('Disability-friendly');
    expect(accessibilityInfo).toHaveClass('text-xs', 'sm:text-sm');
  });
});