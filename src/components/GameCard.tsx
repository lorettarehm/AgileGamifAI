import React from 'react';
import { Clock, Users, Heart, GraduationCap, Accessibility } from 'lucide-react';
import { Game } from '../types';
import { Badge } from './ui/Badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

interface GameCardProps {
  game: Game;
  onToggleFavorite: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const methodologyColorMap: Record<string, string> = {
  Scrum: 'default', // teal
  Kanban: 'secondary', // purple
  XP: 'purple',
  Lean: 'success',
  LeSS: 'warning',
  Nexus: 'danger',
  General: 'outline'
};

const knowledgeLevelColor: Record<string, string> = {
  'New to Agile': 'success',
  'Agile Basics': 'default',
  'Agile Practitioner': 'warning',
  'Agile Master': 'purple'
};

const GameCard: React.FC<GameCardProps> = ({ game, onToggleFavorite, onViewDetails }) => {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:shadow-teal-100/50 border border-teal-100">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-teal-800">{game.title}</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full hover:bg-purple-100" 
            onClick={() => onToggleFavorite(game.id)}
            aria-label={game.isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart 
              className={`h-5 w-5 ${game.isFavorite ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} 
            />
          </Button>
        </div>
        <CardDescription className="text-teal-600">{game.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <div className="flex flex-wrap gap-2 mb-4">
          {game.methodology.map((method) => (
            <Badge key={method} variant={methodologyColorMap[method] || 'default'}>
              {method}
            </Badge>
          ))}
        </div>
        
        <div className="flex flex-col gap-2 text-sm text-teal-700">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-500" />
            <span>{game.minParticipants} - {game.maxParticipants} participants</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-500" />
            <span>{game.duration} minutes</span>
          </div>
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-teal-500" />
            <Badge variant={knowledgeLevelColor[game.requiredKnowledgeLevel]}>
              {game.requiredKnowledgeLevel}
            </Badge>
          </div>
          {game.isAccessible && (
            <div className="flex items-center gap-2 text-emerald-600">
              <Accessibility className="h-4 w-4" />
              <span>Disability-friendly</span>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2 bg-gradient-to-r from-teal-50 to-purple-50">
        <Button 
          variant="default" 
          className="w-full"
          onClick={() => onViewDetails(game.id)}
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GameCard;