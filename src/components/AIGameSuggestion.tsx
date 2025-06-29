import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { Button } from './ui/Button';
import { Game } from '../types';
import { createClient } from '@supabase/supabase-js';
import { llmService } from '../services/llmService';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AIGameSuggestionProps {
  onGameGenerated: (game: Game) => void;
}

const AIGameSuggestion: React.FC<AIGameSuggestionProps> = ({ onGameGenerated }) => {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestedGame, setSuggestedGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [savedGameId, setSavedGameId] = useState<string | null>(null);

  const generateGame = async () => {
    try {
      setLoading(true);
      setError(null);
      setSavedGameId(null);

      const systemPrompt = `You are an expert Agile coach. Create an engaging Agile game with the following format:
        {
          "title": "Game Title",
          "description": "Brief description",
          "framework": ["Choose from: Scrum, Kanban, XP, Lean, LeSS, Nexus, General"],
          "purpose": ["Choose from: Team Building, Problem Solving, Retrospective, Estimation, Planning, Prioritization, Process Improvement"],
          "minParticipants": number,
          "maxParticipants": number,
          "duration": number (in minutes),
          "materials": ["List of required materials"],
          "instructions": "Step by step instructions",
          "facilitationTips": "Tips for facilitators",
          "complexity": "Easy/Medium/Hard",
          "learningOutcomes": ["List of learning outcomes"],
          "isAccessible": boolean,
          "accessibilityNotes": "If isAccessible is true, provide notes",
          "requiredKnowledgeLevel": "Choose from: New to Agile, Agile Basics, Agile Practitioner, Agile Master"
        }`;

      const userPrompt = prompt || "Suggest an engaging Agile game that promotes team collaboration";

      const gameData = await llmService.generateCompleteGame(userPrompt, systemPrompt);
      const game: Game = {
        ...gameData,
        id: crypto.randomUUID(),
        isFavorite: false
      };

      setSuggestedGame(game);
      onGameGenerated(game);
    } catch (err) {
      setError('Failed to generate game suggestion. Please try again.');
      console.error('Error generating game:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!suggestedGame) return;

    try {
      // Check if game already exists
      const { data: existingGame } = await supabase
        .from('liked_games')
        .select('id, popularity')
        .eq('game_data->title', suggestedGame.title)
        .single();

      if (existingGame) {
        // Update existing game's popularity
        const { error } = await supabase
          .from('liked_games')
          .update({ popularity: (existingGame.popularity || 0) + 1 })
          .eq('id', existingGame.id);

        if (error) throw error;
        setSavedGameId(existingGame.id);
      } else {
        // Insert new game
        const { data, error } = await supabase
          .from('liked_games')
          .insert({
            game_data: suggestedGame,
            prompt: prompt || null,
            popularity: 1
          })
          .select('id')
          .single();

        if (error) throw error;
        setSavedGameId(data.id);
      }

      setSuggestedGame(null);
      setPrompt('');
    } catch (err) {
      console.error('Error saving liked game:', err);
      setError('Failed to save the game. Please try again.');
    }
  };

  const handleDislike = async () => {
    if (savedGameId) {
      try {
        const { data: existingGame } = await supabase
          .from('liked_games')
          .select('popularity')
          .eq('id', savedGameId)
          .single();

        if (existingGame) {
          await supabase
            .from('liked_games')
            .update({ popularity: Math.max(0, (existingGame.popularity || 0) - 1) })
            .eq('id', savedGameId);
        }
      } catch (err) {
        console.error('Error updating game popularity:', err);
      }
    }

    setSuggestedGame(null);
    setPrompt('');
    setSavedGameId(null);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">AI Game Suggestion</h2>
      
      <div className="mb-4">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Optional: Describe the type of game you're looking for..."
          className="w-full p-2 sm:p-3 text-sm sm:text-base border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
          rows={3}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm sm:text-base">
          {error}
        </div>
      )}

      {!suggestedGame && (
        <Button
          onClick={generateGame}
          disabled={loading}
          className="w-full text-sm sm:text-base"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Suggestion...
            </>
          ) : (
            'Get Game Suggestion'
          )}
        </Button>
      )}

      {suggestedGame && (
        <div className="mt-4">
          <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              onClick={handleDislike}
              variant="outline"
              className="flex items-center justify-center w-full sm:w-auto text-sm sm:text-base"
            >
              <ThumbsDown className="mr-2 h-4 w-4" />
              {savedGameId ? 'Dislike' : 'Try Another'}
            </Button>
            <Button
              onClick={handleLike}
              className="flex items-center justify-center w-full sm:w-auto text-sm sm:text-base"
            >
              <ThumbsUp className="mr-2 h-4 w-4" />
              {savedGameId ? 'Like' : 'Save This Game'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIGameSuggestion;