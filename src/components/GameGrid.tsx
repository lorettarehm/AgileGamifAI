import React from 'react';
import { Game } from '../types';
import GameCard from './GameCard';

interface GameGridProps {
  games: Game[];
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const GameGrid: React.FC<GameGridProps> = ({ games, onToggleFavorite, onViewDetails }) => {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="bg-gray-100 rounded-full p-6 mb-4">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-12 w-12 text-gray-400" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" 
            />
          </svg>
        </div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">No games found</h3>
        <p className="text-gray-500 max-w-md">
          Try adjusting your filters or search term to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {games.map(game => (
        <GameCard 
          key={game.id} 
          game={game} 
          onToggleFavorite={onToggleFavorite}
          onViewDetails={onViewDetails}
        />
      ))}
    </div>
  );
};

export default GameGrid;