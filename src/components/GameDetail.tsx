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

const GameDetail: React.FC<GameDetailProps> = ({ game, onBack, onStartGame }) => {
  const complexityColor = {
    Easy: 'success',
    Medium: 'warning',
    Hard: 'danger'
  }[game.complexity];

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-purple-400 p-6 text-white">
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
            <Badge key={method} variant={methodologyColorMap[method] || 'default'} className="bg-white/20 text-white border-white/30">
              {method}
            </Badge>
          ))}
          {game.purpose.map((purpose) => (
            <Badge key={purpose} variant="secondary" className="bg-white/20 text-white border-white/30">
              {purpose}
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="flex items-center p-4 bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg border border-teal-200">
            <Users className="h-5 w-5 text-teal-600 mr-3" />
            <div>
              <p className="text-sm text-teal-600">Participants</p>
              <p className="font-medium text-teal-800">{game.minParticipants} - {game.maxParticipants} people</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
            <Clock className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600">Duration</p>
              <p className="font-medium text-purple-800">{game.duration} minutes</p>
            </div>
          </div>
          
          <div className="flex items-center p-4 bg-gradient-to-br from-teal-50 to-purple-50 rounded-lg border border-teal-200">
            <Award className="h-5 w-5 text-teal-600 mr-3" />
            <div>
              <p className="text-sm text-teal-600">Complexity</p>
              <p className="font-medium flex items-center">
                <Badge variant={complexityColor as any}>{game.complexity}</Badge>
              </p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gradient-to-br from-purple-50 to-teal-50 rounded-lg border border-purple-200">
            <GraduationCap className="h-5 w-5 text-purple-600 mr-3" />
            <div>
              <p className="text-sm text-purple-600">Required Level</p>
              <p className="font-medium flex items-center">
                <Badge variant={knowledgeLevelColor[game.requiredKnowledgeLevel]}>
                  {game.requiredKnowledgeLevel}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-teal-800">
            <Target className="h-5 w-5 text-teal-600 mr-2" />
            Learning Outcomes
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {game.learningOutcomes.map((outcome, index) => (
              <li key={index} className="text-teal-700">{outcome}</li>
            ))}
          </ul>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 flex items-center text-teal-800">
            <Package className="h-5 w-5 text-teal-600 mr-2" />
            Materials Needed
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            {game.materials.map((material, index) =>
              <li key={index} className="text-teal-700">{material}</li>
            )}
          </ul>
        </div>
        
        {game.isAccessible && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-3 flex items-center text-emerald-600">
              <Accessibility className="h-5 w-5 mr-2" />
              Accessibility Notes
            </h2>
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4 text-emerald-800">
              {game.accessibilityNotes}
            </div>
          </div>
        )}
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-teal-800">Instructions</h2>
          <div className="prose prose-teal max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-teal-700 bg-gradient-to-br from-teal-50 to-purple-50 p-4 rounded-lg border border-teal-200">
              {game.instructions}
            </pre>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-teal-800">Facilitation Tips</h2>
          <div className="prose prose-teal max-w-none">
            <pre className="whitespace-pre-wrap font-sans text-teal-700 bg-gradient-to-br from-purple-50 to-teal-50 p-4 rounded-lg border border-purple-200">
              {game.facilitationTips}
            </pre>
          </div>
        </div>
        
        <div className="flex justify-center">
          <Button 
            size="lg"
            className="min-w-[200px] bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 shadow-lg hover:shadow-xl"
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