import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../components/Header';

describe('Header Component', () => {
  const defaultProps = {
    currentView: 'library' as const,
    onViewChange: jest.fn(),
  };

  test('renders logo with responsive classes', () => {
    render(<Header {...defaultProps} />);
    
    const logo = screen.getByAltText('Agile GamifAI Logo');
    
    // Check that the logo element exists
    expect(logo).toBeInTheDocument();
    
    // Check that responsive classes are applied
    expect(logo).toHaveClass('h-8', 'w-8');
    expect(logo).toHaveClass('sm:h-10', 'sm:w-10');
    expect(logo).toHaveClass('md:h-12', 'md:w-12');
    expect(logo).toHaveClass('lg:h-14', 'lg:w-14');
    
    // Check other styling classes are preserved
    expect(logo).toHaveClass('mr-3', 'rounded-lg', 'shadow-md');
    
    // Check correct image source
    expect(logo).toHaveAttribute('src', '/1749172667026.png');
  });

  test('logo maintains accessibility attributes', () => {
    render(<Header {...defaultProps} />);
    
    const logo = screen.getByAltText('Agile GamifAI Logo');
    
    // Check alt text for accessibility
    expect(logo).toHaveAttribute('alt', 'Agile GamifAI Logo');
  });
});