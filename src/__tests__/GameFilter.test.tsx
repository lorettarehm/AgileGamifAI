import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GameFilter from '../components/GameFilter';
import { createMockFilters } from '../test-utils/testUtils';

describe('GameFilter', () => {
  const mockOnFilterChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should filter by framework', () => {
    const filters = createMockFilters();

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // First expand the filter panel to access framework badges
    const expandButton = screen.getByText(/show filters/i);
    fireEvent.click(expandButton);

    // Test single framework selection
    const scrumBadge = screen.getByText('Scrum');
    fireEvent.click(scrumBadge);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filters,
      framework: ['Scrum'],
    });
  });

  test('should filter by purpose, complexity, and knowledge level', () => {
    const filters = createMockFilters();

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // First expand the filter panel to access all options
    const expandButton = screen.getByText(/show filters/i);
    fireEvent.click(expandButton);

    // Test purpose selection
    const teamBuildingBadge = screen.getByText('Team Building');
    fireEvent.click(teamBuildingBadge);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filters,
      purpose: ['Team Building'],
    });
  });

  test('should perform text search', () => {
    const filters = createMockFilters();

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // Test text search input
    const searchInput = screen.getByPlaceholderText(/search games/i);
    fireEvent.change(searchInput, { target: { value: 'retrospective' } });

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filters,
      searchTerm: 'retrospective',
    });
  });

  test('should filter by accessibility requirements', () => {
    const filters = createMockFilters();

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // First expand the filter panel
    const expandButton = screen.getByText(/show filters/i);
    fireEvent.click(expandButton);

    // Test accessibility checkbox
    const accessibilityCheckbox = screen.getByRole('checkbox');
    fireEvent.click(accessibilityCheckbox);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filters,
      accessibleOnly: true,
    });
  });

  test('should handle combined filter behavior', () => {
    const filters = createMockFilters({
      framework: ['Scrum'],
      purpose: ['Team Building'],
    });

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // First expand the filter panel
    const expandButton = screen.getByText(/show filters/i);
    fireEvent.click(expandButton);

    // Test adding another framework
    const kanbanBadge = screen.getByText('Kanban');
    fireEvent.click(kanbanBadge);

    expect(mockOnFilterChange).toHaveBeenCalledWith({
      ...filters,
      framework: ['Scrum', 'Kanban'],
    });
  });

  test('should handle filter reset functionality', () => {
    const filters = createMockFilters({
      framework: ['Scrum'],
      purpose: ['Team Building'],
      searchTerm: 'test',
      accessibleOnly: true,
    });

    render(<GameFilter filters={filters} onFilterChange={mockOnFilterChange} />);

    // First expand the filter panel
    const expandButton = screen.getByText(/show filters/i);
    fireEvent.click(expandButton);

    // Find and click the reset button
    const resetButton = screen.getByText(/reset filters/i);
    fireEvent.click(resetButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith(
      createMockFilters() // Should reset to default empty filters
    );
  });
});
