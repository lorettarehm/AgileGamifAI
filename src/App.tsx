import React, { useState, useEffect } from 'react';
import { Game, GameFilters } from './types';
import { sampleGames } from './data/games';
import Header from './components/Header';
import GameFilter from './components/GameFilter';
import GameGrid from './components/GameGrid';
import GameDetail from './components/GameDetail';
import GameCreate from './components/GameCreate';
import GameFacilitator from './components/GameFacilitator';
import { Button } from './components/ui/Button';
import { Coffee } from 'lucide-react';

function App() {
  // State
  const [games, setGames] = useState<Game[]>(sampleGames);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filters, setFilters] = useState<GameFilters>({
    methodology: [],
    purpose: [],
    participants: 0,
    maxDuration: 120,
    complexity: [],
    searchTerm: '',
    knowledgeLevel: [],
    accessibleOnly: false
  });
  const [currentView, setCurrentView] = useState<'library' | 'create' | 'favorites' | 'detail' | 'facilitator'>('library');
  const [facilitation, setFacilitation] = useState<boolean>(false);

  // Get selected game if any
  const selectedGame = selectedGameId 
    ? games.find(game => game.id === selectedGameId) 
    : null;

  // Filter games based on current filters
  const filteredGames = games.filter(game => {
    if (filters.searchTerm && !game.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.methodology.length > 0 && !game.methodology.some(m => filters.methodology.includes(m))) {
      return false;
    }
    
    if (filters.purpose.length > 0 && !game.purpose.some(p => filters.purpose.includes(p))) {
      return false;
    }
    
    if (filters.participants > 0 && (game.minParticipants > filters.participants || game.maxParticipants < filters.participants)) {
      return false;
    }
    
    if (game.duration > filters.maxDuration) {
      return false;
    }
    
    if (filters.complexity.length > 0 && !filters.complexity.includes(game.complexity)) {
      return false;
    }

    if (filters.knowledgeLevel.length > 0 && !filters.knowledgeLevel.includes(game.requiredKnowledgeLevel)) {
      return false;
    }

    if (filters.accessibleOnly && !game.isAccessible) {
      return false;
    }
    
    return true;
  });

  // Get only favorite games
  const favoriteGames = games.filter(game => game.isFavorite);

  // Handler functions
  const handleToggleFavorite = (id: string) => {
    setGames(games.map(game => 
      game.id === id ? { ...game, isFavorite: !game.isFavorite } : game
    ));
  };

  const handleViewDetails = (id: string) => {
    setSelectedGameId(id);
    setCurrentView('detail');
  };

  const handleBackToLibrary = () => {
    setSelectedGameId(null);
    setFacilitation(false);
    setCurrentView('library');
  };

  const handleStartGame = (id: string) => {
    setFacilitation(true);
    setCurrentView('facilitator');
  };

  const handleCompleteGame = () => {
    setFacilitation(false);
    setCurrentView('detail');
  };

  const handleViewChange = (view: 'library' | 'create' | 'favorites') => {
    setCurrentView(view);
    setSelectedGameId(null);
    setFacilitation(false);
  };

  const handleSaveGame = (newGame: Omit<Game, 'id'>) => {
    const id = `${games.length + 1}`;
    setGames([...games, { ...newGame, id }]);
    setCurrentView('library');
  };

  const Footer = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4">
      <div className="container mx-auto flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => window.open('https://coff.ee/AgileGamifAI', '_blank')}
        >
          <Coffee className="h-4 w-4" />
          Buy me a ☕️
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-4 pb-24">
        {currentView === 'library' && (
          <>
            <GameFilter filters={filters} onFilterChange={setFilters} />
            <GameGrid 
              games={filteredGames} 
              onToggleFavorite={handleToggleFavorite} 
              onViewDetails={handleViewDetails}
            />
          </>
        )}
        
        {currentView === 'favorites' && (
          <>
            <GameFilter filters={filters} onFilterChange={setFilters} />
            <GameGrid 
              games={favoriteGames} 
              onToggleFavorite={handleToggleFavorite} 
              onViewDetails={handleViewDetails}
            />
          </>
        )}
        
        {currentView === 'create' && (
          <GameCreate onBack={handleBackToLibrary} onSaveGame={handleSaveGame} />
        )}
        
        {currentView === 'detail' && selectedGame && (
          <GameDetail 
            game={selectedGame} 
            onBack={handleBackToLibrary}
            onStartGame={handleStartGame}
          />
        )}
        
        {currentView === 'facilitator' && selectedGame && (
          <GameFacilitator 
            game={selectedGame} 
            onBack={() => setCurrentView('detail')}
            onComplete={handleCompleteGame}
          />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;