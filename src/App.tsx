import React, { useState, useEffect } from 'react';
import { Game, GameFilters } from './types';
import Header from './components/Header';
import GameFilter from './components/GameFilter';
import GameGrid from './components/GameGrid';
import GameDetail from './components/GameDetail';
import GameCreate from './components/GameCreate';
import GameFacilitator from './components/GameFacilitator';
import { Button } from './components/ui/Button';
import { BookOpenText, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

function App() {
  // State
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [filters, setFilters] = useState<GameFilters>({
    framework: [],
    purpose: [],
    participants: 0,
    maxDuration: 120,
    complexity: [],
    searchTerm: '',
    knowledgeLevel: [],
    accessibleOnly: false
  });
  const [currentView, setCurrentView] = useState<'library' | 'create' | 'favorites' | 'detail' | 'facilitator'>('library');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Calculate items per page based on screen size
  const getItemsPerPage = () => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768 ? 3 : 6;
    }
    return 6;
  };
  const [itemsPerPage, setItemsPerPage] = useState(getItemsPerPage());

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(getItemsPerPage());
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fetch games from database
  useEffect(() => {
    const fetchGames = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('liked_games')
          .select('*')
          .order('popularity', { ascending: false });

        if (error) throw error;

        const formattedGames = data.map(item => ({
          ...item.game_data,
          id: item.id,
          isFavorite: false
        }));

        setGames(formattedGames);
      } catch (err) {
        console.error('Error fetching games:', err);
        setError('Failed to load games. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGames();
  }, []);

  // Get selected game if any
  const selectedGame = selectedGameId 
    ? games.find(game => game.id === selectedGameId) 
    : null;

  // Filter games based on current filters
  const filteredGames = games.filter(game => {
    if (filters.searchTerm && !game.title.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
      return false;
    }
    
    if (filters.framework.length > 0 && !game.framework.some(m => filters.framework.includes(m))) {
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

  // Pagination
  const totalPages = Math.ceil(filteredGames.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGames = filteredGames.slice(startIndex, startIndex + itemsPerPage);

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
    setCurrentView('library');
  };

  const handleStartGame = () => {
    setCurrentView('facilitator');
  };

  const handleCompleteGame = () => {
    setCurrentView('detail');
  };

  const handleViewChange = (view: 'library' | 'create' | 'favorites') => {
    setCurrentView(view);
    setSelectedGameId(null);
    setCurrentPage(1);
  };

  const handleSaveGame = (newGame: Omit<Game, 'id'>) => {
    const id = `${games.length + 1}`;
    setGames([...games, { ...newGame, id }]);
    setCurrentView('library');
  };

  const Footer = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-teal-200 p-4">
      <div className="container mx-auto flex justify-center">
        <Button
          variant="outline"
          className="flex items-center gap-2 border-teal-300 text-teal-700 hover:bg-teal-50"
          onClick={() => window.open('https://coff.ee/AgileGamifAI', '_blank')}
        >
          <BookOpenText className="h-4 w-4" />
          Buy me a Book 📚
        </Button>
      </div>
    </div>
  );

  const Pagination = () => (
    <div className="flex justify-center items-center gap-4 mt-6">
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={currentPage === 1}
        className="border-teal-300 text-teal-700 hover:bg-teal-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      <span className="text-sm text-teal-700">
        Page {currentPage} of {totalPages}
      </span>
      <Button
        variant="outline"
        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        disabled={currentPage === totalPages}
        className="border-teal-300 text-teal-700 hover:bg-teal-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-purple-50">
      <Header currentView={currentView} onViewChange={handleViewChange} />
      
      <main className="container mx-auto px-4 pb-24">
        {currentView === 'library' && (
          <>
            <GameFilter filters={filters} onFilterChange={setFilters} />
            {isLoading ? (
              <div className="text-center py-8 text-teal-600">Loading games...</div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">{error}</div>
            ) : (
              <>
                <GameGrid 
                  games={paginatedGames} 
                  onToggleFavorite={handleToggleFavorite} 
                  onViewDetails={handleViewDetails}
                />
                {filteredGames.length > itemsPerPage && <Pagination />}
              </>
            )}
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
