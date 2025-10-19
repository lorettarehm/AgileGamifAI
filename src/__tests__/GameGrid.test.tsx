import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameGrid from '../components/GameGrid';
import { mockGames, createMockGame } from '../test-utils/testUtils';

describe('GameGrid', () => {
  const mockOnToggleFavorite = jest.fn();
  const mockOnViewDetails = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should display games in responsive grid', () => {
    render(
      <GameGrid
        games={mockGames}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />
    );

    // Verify game cards are rendered
    expect(screen.getByText('Scrum Team Building')).toBeInTheDocument();
    expect(screen.getByText('Kanban Retrospective')).toBeInTheDocument();
    expect(screen.getByText('Estimation Planning Poker')).toBeInTheDocument();
  });

  test('should handle empty states', () => {
    render(
      <GameGrid
        games={[]}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />
    );

    // Verify empty state is shown
    expect(screen.getByText(/No games found/i)).toBeInTheDocument();
    expect(screen.getByText(/Try adjusting your filters/i)).toBeInTheDocument();
  });

  test('should display single game correctly', () => {
    const singleGame = createMockGame({
      id: '1',
      title: 'Single Game Test',
      description: 'Test description',
    });

    render(
      <GameGrid
        games={[singleGame]}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />
    );

    expect(screen.getByText('Single Game Test')).toBeInTheDocument();
  });

  test('should render correct number of game cards', () => {
    render(
      <GameGrid
        games={mockGames}
        onToggleFavorite={mockOnToggleFavorite}
        onViewDetails={mockOnViewDetails}
      />
    );

    // Check that we have the expected number of game titles
    expect(screen.getByText('Scrum Team Building')).toBeInTheDocument();
    expect(screen.getByText('Kanban Retrospective')).toBeInTheDocument();
    expect(screen.getByText('Estimation Planning Poker')).toBeInTheDocument();
  });
});
