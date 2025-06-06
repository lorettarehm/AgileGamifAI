import React, { useState } from 'react';
import { ArrowLeft, Plus, Minus, Loader2, Coffee } from 'lucide-react';
import { Button } from './ui/Button';
import { Game, AgileMethodology, GamePurpose, GameComplexity, AgileKnowledgeLevel } from '../types';
import { Badge } from './ui/Badge';
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_HF_ACCESS_TOKEN);

interface GameCreateProps {
  onBack: () => void;
  onSaveGame: (game: Omit<Game, 'id'>) => void;
}

const DEFAULT_GAME: Omit<Game, 'id'> = {
  title: '',
  description: '',
  methodology: [],
  purpose: [],
  minParticipants: 3,
  maxParticipants: 10,
  duration: 30,
  materials: [''],
  instructions: '',
  facilitationTips: '',
  complexity: 'Medium',
  isFavorite: false,
  learningOutcomes: [''],
  isAccessible: false,
  accessibilityNotes: '',
  requiredKnowledgeLevel: 'Agile Basics'
};

const GameCreate: React.FC<GameCreateProps> = ({ onBack, onSaveGame }) => {
  const [game, setGame] = useState<Omit<Game, 'id'>>(DEFAULT_GAME);
  const [errors, setErrors] = useState<Partial<Record<keyof Game, string>>>({});
  const [isGenerating, setIsGenerating] = useState(false);

  const methodologies: AgileMethodology[] = ['Scrum', 'Kanban', 'XP', 'Lean', 'LeSS', 'Nexus', 'General'];
  const purposes: GamePurpose[] = [
    'Team Building', 
    'Problem Solving', 
    'Retrospective', 
    'Estimation', 
    'Planning', 
    'Prioritization',
    'Process Improvement'
  ];
  const complexities: GameComplexity[] = ['Easy', 'Medium', 'Hard'];
  const knowledgeLevels: AgileKnowledgeLevel[] = [
    'New to Agile',
    'Agile Basics',
    'Agile Practitioner',
    'Agile Master'
  ];

  const generateMissingFields = async () => {
    setIsGenerating(true);
    try {
      const filledFields = Object.entries(game).reduce((acc, [key, value]) => {
        if (Array.isArray(value) && value.length > 0 && value.every(v => v !== '')) {
          acc[key] = value;
        } else if (value !== '' && value !== false && value !== 0) {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, any>);

      const systemPrompt = `You are an expert Agile coach. Based on the following partial game information, complete the missing fields to create a cohesive Agile game. Return ONLY a JSON object with all fields.

      Required format:
      {
        "title": "string",
        "description": "string",
        "methodology": ["Choose from: Scrum, Kanban, XP, Lean, LeSS, Nexus, General"],
        "purpose": ["Choose from: Team Building, Problem Solving, Retrospective, Estimation, Planning, Prioritization, Process Improvement"],
        "minParticipants": number,
        "maxParticipants": number,
        "duration": number,
        "materials": ["string"],
        "instructions": "string",
        "facilitationTips": "string",
        "complexity": "Easy/Medium/Hard",
        "learningOutcomes": ["string"],
        "isAccessible": boolean,
        "accessibilityNotes": "string if isAccessible is true, empty string otherwise",
        "requiredKnowledgeLevel": "New to Agile/Agile Basics/Agile Practitioner/Agile Master"
      }`;

      const response = await hf.textGeneration({
        model: "deepseek-ai/deepseek-v2-lite-chat",
        inputs: `${systemPrompt}\n\nPartial game data: ${JSON.stringify(filledFields, null, 2)}\n\nComplete the game data, maintaining any existing values and generating appropriate values for missing fields. Return only the JSON object.`,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false
        }
      });

      const generatedGame = JSON.parse(response.generated_text);
      
      const mergedGame = {
        ...DEFAULT_GAME,
        ...generatedGame,
        ...filledFields
      };

      setGame(mergedGame);
      setErrors({});
    } catch (error) {
      console.error('Error generating game:', error);
      setErrors({ 
        ...errors, 
        title: 'Failed to generate game. Please try again or fill in the fields manually.' 
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleMethodology = (methodology: AgileMethodology) => {
    const current = game.methodology;
    const updated = current.includes(methodology)
      ? current.filter(m => m !== methodology)
      : [...current, methodology];
    
    setGame({ ...game, methodology: updated });
    if (errors.methodology) {
      setErrors({ ...errors, methodology: undefined });
    }
  };

  const togglePurpose = (purpose: GamePurpose) => {
    const current = game.purpose;
    const updated = current.includes(purpose)
      ? current.filter(p => p !== purpose)
      : [...current, purpose];
    
    setGame({ ...game, purpose: updated });
    if (errors.purpose) {
      setErrors({ ...errors, purpose: undefined });
    }
  };

  const updateMaterial = (index: number, value: string) => {
    const updatedMaterials = [...game.materials];
    updatedMaterials[index] = value;
    setGame({ ...game, materials: updatedMaterials });
  };

  const addMaterial = () => {
    setGame({ ...game, materials: [...game.materials, ''] });
  };

  const removeMaterial = (index: number) => {
    if (game.materials.length === 1) return;
    const updatedMaterials = [...game.materials];
    updatedMaterials.splice(index, 1);
    setGame({ ...game, materials: updatedMaterials });
  };

  const updateLearningOutcome = (index: number, value: string) => {
    const updatedOutcomes = [...game.learningOutcomes];
    updatedOutcomes[index] = value;
    setGame({ ...game, learningOutcomes: updatedOutcomes });
  };

  const addLearningOutcome = () => {
    setGame({ ...game, learningOutcomes: [...game.learningOutcomes, ''] });
  };

  const removeLearningOutcome = (index: number) => {
    if (game.learningOutcomes.length === 1) return;
    const updatedOutcomes = [...game.learningOutcomes];
    updatedOutcomes.splice(index, 1);
    setGame({ ...game, learningOutcomes: updatedOutcomes });
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof Game, string>> = {};
    
    if (!game.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!game.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (game.methodology.length === 0) {
      newErrors.methodology = 'At least one methodology is required';
    }
    
    if (game.purpose.length === 0) {
      newErrors.purpose = 'At least one purpose is required';
    }
    
    if (!game.instructions.trim()) {
      newErrors.instructions = 'Instructions are required';
    }
    
    if (game.minParticipants > game.maxParticipants) {
      newErrors.minParticipants = 'Min participants must be less than or equal to max participants';
    }

    if (game.learningOutcomes.some(outcome => !outcome.trim())) {
      newErrors.learningOutcomes = 'All learning outcomes must be filled out';
    }

    if (game.isAccessible && !game.accessibilityNotes?.trim()) {
      newErrors.accessibilityNotes = 'Accessibility notes are required when game is marked as accessible';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSaveGame(game);
    }
  };

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
          <h1 className="text-2xl font-bold">Create New Agile Game</h1>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        <div className="mb-6">
          <Button
            type="button"
            onClick={generateMissingFields}
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Game Details...
              </>
            ) : (
              'Generate Missing Details with AI'
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Game Title
            </label>
            <input
              type="text"
              value={game.title}
              onChange={(e) => {
                setGame({ ...game, title: e.target.value });
                if (errors.title) setErrors({ ...errors, title: undefined });
              }}
              className={`w-full p-2 border rounded-md ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="e.g., Sailboat Retrospective"
            />
            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Complexity
            </label>
            <div className="flex gap-2">
              {complexities.map((complexity) => (
                <Button
                  key={complexity}
                  type="button"
                  variant={game.complexity === complexity ? "default" : "outline"}
                  onClick={() => setGame({ ...game, complexity })}
                  className="flex-1"
                >
                  {complexity}
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            value={game.description}
            onChange={(e) => {
              setGame({ ...game, description: e.target.value });
              if (errors.description) setErrors({ ...errors, description: undefined });
            }}
            className={`w-full p-2 border rounded-md ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            rows={2}
            placeholder="Brief description of the game and its purpose"
          />
          {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description}</p>}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Required Knowledge Level
          </label>
          <div className="flex gap-2">
            {knowledgeLevels.map((level) => (
              <Button
                key={level}
                type="button"
                variant={game.requiredKnowledgeLevel === level ? "default" : "outline"}
                onClick={() => setGame({ ...game, requiredKnowledgeLevel: level })}
                className="flex-1"
              >
                {level}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Methodology {errors.methodology && <span className="text-red-500">(Select at least one)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {methodologies.map((methodology) => (
                <Badge
                  key={methodology}
                  variant={game.methodology.includes(methodology) ? "default" : "outline"}
                  className={`cursor-pointer ${
                    game.methodology.includes(methodology) ? '' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => toggleMethodology(methodology)}
                >
                  {methodology}
                </Badge>
              ))}
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Purpose {errors.purpose && <span className="text-red-500">(Select at least one)</span>}
            </label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <Badge
                  key={purpose}
                  variant={game.purpose.includes(purpose) ? "secondary" : "outline"}
                  className={`cursor-pointer ${
                    game.purpose.includes(purpose) ? '' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => togglePurpose(purpose)}
                >
                  {purpose}
                </Badge>
              ))}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min Participants
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={game.minParticipants}
              onChange={(e) => {
                setGame({ ...game, minParticipants: parseInt(e.target.value) });
                if (errors.minParticipants) setErrors({ ...errors, minParticipants: undefined });
              }}
              className={`w-full p-2 border rounded-md ${errors.minParticipants ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.minParticipants && <p className="mt-1 text-sm text-red-500">{errors.minParticipants}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Participants
            </label>
            <input
              type="number"
              min="1"
              max="100"
              value={game.maxParticipants}
              onChange={(e) => setGame({ ...game, maxParticipants: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (minutes)
            </label>
            <input
              type="number"
              min="5"
              max="240"
              step="5"
              value={game.duration}
              onChange={(e) => setGame({ ...game, duration: parseInt(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Learning Outcomes
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addLearningOutcome}
              className="text-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Outcome
            </Button>
          </div>
          
          {game.learningOutcomes.map((outcome, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={outcome}
                onChange={(e) => updateLearningOutcome(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="e.g., Understand the importance of team collaboration"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeLearningOutcome(index)}
                className="ml-2 text-gray-500"
                disabled={game.learningOutcomes.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {errors.learningOutcomes && (
            <p className="mt-1 text-sm text-red-500">{errors.learningOutcomes}</p>
          )}
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label className="block text-sm font-medium text-gray-700">
              Materials Needed
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={addMaterial}
              className="text-blue-600"
            >
              <Plus className="h-4 w-4 mr-1" /> Add Material
            </Button>
          </div>
          
          {game.materials.map((material, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="text"
                value={material}
                onChange={(e) => updateMaterial(index, e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder={`Material ${index + 1}`}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeMaterial(index)}
                className="ml-2 text-gray-500"
                disabled={game.materials.length === 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            value={game.instructions}
            onChange={(e) => {
              setGame({ ...game, instructions: e.target.value });
              if (errors.instructions) setErrors({ ...errors, instructions: undefined });
            }}
            className={`w-full p-2 border rounded-md ${errors.instructions ? 'border-red-500' : 'border-gray-300'}`}
            rows={5}
            placeholder="Step-by-step instructions for running the game"
          />
          {errors.instructions && <p className="mt-1 text-sm text-red-500">{errors.instructions}</p>}
        </div>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Facilitation Tips
          </label>
          <textarea
            value={game.facilitationTips}
            onChange={(e) => setGame({ ...game, facilitationTips: e.target.value })}
            className="w-full p-2 border border-gray-300 rounded-md"
            rows={3}
            placeholder="Helpful tips for facilitating the game effectively"
          />
        </div>

        <div className="mb-6">
          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="isAccessible"
              checked={game.isAccessible}
              onChange={(e) => {
                setGame({ ...game, isAccessible: e.target.checked });
                if (!e.target.checked) {
                  setGame(prev => ({ ...prev, accessibilityNotes: '' }));
                }
              }}
              className="h-4 w-4 text-blue-600 rounded border-gray-300"
            />
            <label htmlFor="isAccessible" className="ml-2 text-sm font-medium text-gray-700">
              This game is disability-friendly
            </label>
          </div>
          
          {game.isAccessible && (
            <div className="mt-2">
              <textarea
                value={game.accessibilityNotes}
                onChange={(e) => {
                  setGame({ ...game, accessibilityNotes: e.target.value });
                  if (errors.accessibilityNotes) {
                    setErrors({ ...errors, accessibilityNotes: undefined });
                  }
                }}
                className={`w-full p-2 border rounded-md ${
                  errors.accessibilityNotes ? 'border-red-500' : 'border-gray-300'
                }`}
                rows={3}
                placeholder="Describe how this game accommodates different disabilities and any specific adaptations needed"
              />
              {errors.accessibilityNotes && (
                <p className="mt-1 text-sm text-red-500">{errors.accessibilityNotes}</p>
              )}
            </div>
          )}
        </div>
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button type="submit">
            Save Game
          </Button>
        </div>
      </form>

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
    </div>
  );
};

export default GameCreate;