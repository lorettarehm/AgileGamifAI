import React from 'react';
import { ArrowLeft, Clock, Users, Award, Package, GraduationCap, Accessibility, Target } from 'lucide-react';
import { Game } from '../types';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';

interface GameDetailProps {
  game: Game;
  onBack: () => void;
  onStartGame: (id: string) => void;
}

const methodologyColorMap: Record<string, string> = {
  Scrum: 'default', // blue
  Kanban: 'secondary', // teal
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

const GameDetail: React.FC<GameDetailProps> = ({ game, onBack, onStartGame }) => {
  const complexityColor = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger'
  }[game.complexity];

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white mr-3"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">{game.title}</h1>
        </div>
        
        <p className="text-white/90 mb-4">{game.description}</p>
        
        <div className="flex flex-wrap gap-2">
          {game.methodology.map((method) => (
            <Badge key={method} variant={methodologyColorMap[method] || 'default'} className="bg-white/20 text-white">
              {method}
            </Badge>
          ))}
          {game.purpose.map((purpose) => (
            <Badge key={purpose} variant="secondary" className="bg-white/20 text-white">
              {purpose}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Users className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Participants</p>
              <p className="font-medium">{game.minParticipants} - {game.maxParticipants} people</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Duration</p>
              <p className="font-medium">{game.duration} minutes</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <Award className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Complexity</p>
              <p className="font-medium flex items-center">
                <Badge variant={complexityColor as any}>{game.complexity}</Badge>
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-50 rounded-lg">
            <GraduationCap className="h-5 w-5 text-blue-600 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Required Level</p>
              <p className="font-medium flex items-center">
                <Badge variant={knowledgeLevelColor[game.requiredKnowledgeLevel]}>
                  {game.requiredKnowledgeLevel}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Target className="h-5 w-5 text-blue-600 mr-2" />
            Learning Outcomes
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {game.learningOutcomes.map((outcome, index) => (
              <li key={index} className="text-gray-700">{outcome}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            Materials Needed
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {game.materials.map((material, index) =>
              <li key={index} className="text-gray-700">{material}</li>
            )}
          </ul>
        </div>
        
        {game.isAccessible && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-green-600">
              <Accessibility className="h-5 w-5 mr-2" />
              Accessibility Notes
            </h2>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-800">
              {game.accessibilityNotes}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Instructions</h2>
          <div className="prose prose-blue max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
              {game.instructions}
            </pre>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Facilitation Tips</h2>
          <div className="prose prose-blue max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-gray-700 bg-gray-50 p-4 rounded-lg">
              {game.facilitationTips}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="min-w-[200px]"
            onClick={() => onStartGame(game.id)}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GameDetail;