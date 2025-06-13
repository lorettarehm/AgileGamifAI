import React from 'react';
import { LayoutGrid, PlusCircle, Heart, Menu } from 'lucide-react';
import { Button } from './ui/Button';

interface HeaderProps {
  currentView: 'library' | 'create' | 'favorites' | 'detail' | 'facilitator';
  onViewChange: (view: 'library' | 'create' | 'favorites') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="bg-gradient-to-r from-teal-500 to-purple-400 shadow-lg py-4 px-6 mb-6">
      <div className="container mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <img 
              src="/1749172667026.png" 
              alt="Agile GamifAI Logo" 
              className="h-12 w-12 mr-3 rounded-lg shadow-md"
            />
            <h1 className="text-xl font-bold text-white">Agile Games</h1>
          </div>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/20"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-2">
            <Button
              variant={currentView === 'library' ? 'secondary' : 'ghost'}
              className={`flex items-center ${
                currentView === 'library' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => onViewChange('library')}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Library
            </Button>
            
            <Button
              variant={currentView === 'favorites' ? 'secondary' : 'ghost'}
              className={`flex items-center ${
                currentView === 'favorites' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => onViewChange('favorites')}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            
            <Button
              variant={currentView === 'create' ? 'secondary' : 'ghost'}
              className={`flex items-center ${
                currentView === 'create' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => onViewChange('create')}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create
            </Button>
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Button
              variant={currentView === 'library' ? 'secondary' : 'ghost'}
              className={`flex items-center w-full justify-start ${
                currentView === 'library' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => {
                onViewChange('library');
                setIsMenuOpen(false);
              }}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Library
            </Button>
            
            <Button
              variant={currentView === 'favorites' ? 'secondary' : 'ghost'}
              className={`flex items-center w-full justify-start ${
                currentView === 'favorites' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => {
                onViewChange('favorites');
                setIsMenuOpen(false);
              }}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <Heart className="h-4 w-4 mr-2" />
              Favorites
            </Button>
            
            <Button
              variant={currentView === 'create' ? 'secondary' : 'ghost'}
              className={`flex items-center w-full justify-start ${
                currentView === 'create' 
                  ? 'bg-white/20 text-white hover:bg-white/30' 
                  : 'text-white hover:bg-white/20'
              }`}
              onClick={() => {
                onViewChange('create');
                setIsMenuOpen(false);
              }}
              disabled={currentView === 'detail' || currentView === 'facilitator'}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Create
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;