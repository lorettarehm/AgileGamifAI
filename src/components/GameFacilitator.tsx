import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Game } from '../types';
import { Button } from './ui/Button';

interface GameFacilitatorProps {
  game: Game;
  onBack: () => void;
  onComplete: () => void;
}

const formatTime = (timeInSeconds: number): string => {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

const GameFacilitator: React.FC<GameFacilitatorProps> = ({ game, onBack, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(game.duration * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const intervalRef = useRef<number | null>(null);
  
  // Parse instructions into steps
  const instructionSteps = game.instructions
    .trim()
    .split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);
  
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            clearInterval(intervalRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning]);
  
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };
  
  const resetTimer = () => {
    setIsRunning(false);
    setTimeRemaining(game.duration * 60);
  };
  
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const nextStep = () => {
    if (currentStep < instructionSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Last step reached
      onComplete();
    }
  };
  
  // Calculate progress percentage
  const progressPercentage = (timeRemaining / (game.duration * 60)) * 100;
  
  // Determine timer color based on remaining time
  const getTimerColor = () => {
    const percentLeft = (timeRemaining / (game.duration * 60)) * 100;
    if (percentLeft > 50) return 'text-teal-600';
    if (percentLeft > 20) return 'text-amber-500';
    return 'text-red-600';
  };

  const getProgressColor = () => {
    const percentLeft = (timeRemaining / (game.duration * 60)) * 100;
    if (percentLeft > 50) return 'bg-gradient-to-r from-teal-500 to-teal-600';
    if (percentLeft > 20) return 'bg-gradient-to-r from-amber-500 to-amber-600';
    return 'bg-gradient-to-r from-red-500 to-red-600';
  };

  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-teal-100">
      <div className="bg-gradient-to-r from-teal-500 to-purple-400 p-4 sm:p-6 text-white">
        <div className="flex items-center mb-4">
          <Button 
            variant="ghost" 
            size="icon"
            className="h-8 w-8 rounded-full bg-white/20 hover:bg-white/30 text-white mr-3 flex-shrink-0"
            onClick={onBack}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold leading-tight">Facilitating: {game.title}</h1>
        </div>
      </div>
      
      <div className="p-4 sm:p-6">
        {/* Timer Section */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col items-center">
            <div className={`text-3xl sm:text-4xl lg:text-5xl font-mono font-bold mb-4 ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
            
            <div className="w-full h-2 sm:h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${getProgressColor()}`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="rounded-full border-teal-300 text-teal-700 hover:bg-teal-50"
              >
                <RotateCcw className="h-4 sm:h-5 w-4 sm:w-5" />
              </Button>
              
              <Button
                variant={isRunning ? "secondary" : "default"}
                size="lg"
                onClick={toggleTimer}
                className={`rounded-full px-4 sm:px-6 text-sm sm:text-base ${
                  isRunning 
                    ? 'bg-gradient-to-r from-purple-400 to-purple-500 hover:from-purple-500 hover:to-purple-600' 
                    : 'bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700'
                }`}
              >
                {isRunning ? (
                  <><Pause className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-4 sm:h-5 w-4 sm:w-5 mr-2" /> {timeRemaining === game.duration * 60 ? 'Start' : 'Resume'}</>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Instructions Section */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-base sm:text-lg font-semibold mb-4 text-teal-800">Step {currentStep + 1} of {instructionSteps.length}</h2>
          
          <div className="bg-gradient-to-br from-teal-50 to-purple-50 p-4 sm:p-6 rounded-lg mb-4 min-h-[100px] sm:min-h-[120px] flex items-center justify-center border border-teal-200">
            <p className="text-sm sm:text-base lg:text-lg text-center text-teal-800 leading-relaxed">{instructionSteps[currentStep]}</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center w-full sm:w-auto border-teal-300 text-teal-700 hover:bg-teal-50 text-sm sm:text-base"
            >
              <ChevronLeft className="h-4 sm:h-5 w-4 sm:w-5 mr-1" /> Previous
            </Button>
            
            <div className="flex space-x-1 order-first sm:order-none">
              {instructionSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-teal-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="default"
              onClick={nextStep}
              className="flex items-center w-full sm:w-auto text-sm sm:text-base bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600"
            >
              {currentStep === instructionSteps.length - 1 ? 'Complete' : 'Next'} <ChevronRight className="h-4 sm:h-5 w-4 sm:w-5 ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Materials and Tips Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          <div className="bg-gradient-to-br from-teal-50 to-teal-100 p-3 sm:p-4 rounded-lg border border-teal-200">
            <h3 className="font-semibold mb-2 text-sm sm:text-base text-teal-800">Materials Needed</h3>
            <ul className="list-disc pl-5 space-y-1">
              {game.materials.map((material, index) => (
                <li key={index} className="text-xs sm:text-sm text-teal-700 leading-relaxed">{material}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-3 sm:p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-2 text-sm sm:text-base text-purple-800">Facilitation Tips</h3>
            <div className="text-purple-700 text-xs sm:text-sm">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {game.facilitationTips}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameFacilitator;