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
    if (percentLeft > 50) return 'text-green-600';
    if (percentLeft > 20) return 'text-amber-500';
    return 'text-red-600';
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
          <h1 className="text-2xl font-bold">Facilitating: {game.title}</h1>
        </div>
      </div>
      
      <div className="p-6">
        {/* Timer Section */}
        <div className="mb-8">
          <div className="flex flex-col items-center">
            <div className={`text-5xl font-mono font-bold mb-4 ${getTimerColor()}`}>
              {formatTime(timeRemaining)}
            </div>
            
            <div className="w-full h-3 bg-gray-200 rounded-full mb-4 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  progressPercentage > 50 ? 'bg-green-500' : 
                  progressPercentage > 20 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            
            <div className="flex space-x-3">
              <Button
                variant="outline"
                size="icon"
                onClick={resetTimer}
                className="rounded-full"
              >
                <RotateCcw className="h-5 w-5" />
              </Button>
              
              <Button
                variant={isRunning ? "secondary" : "default"}
                size="lg"
                onClick={toggleTimer}
                className="rounded-full px-6"
              >
                {isRunning ? (
                  <><Pause className="h-5 w-5 mr-2" /> Pause</>
                ) : (
                  <><Play className="h-5 w-5 mr-2" /> {timeRemaining === game.duration * 60 ? 'Start' : 'Resume'}</>
                )}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Instructions Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Step {currentStep + 1} of {instructionSteps.length}</h2>
          
          <div className="bg-gray-50 p-6 rounded-lg mb-4 min-h-[120px] flex items-center justify-center">
            <p className="text-lg text-center">{instructionSteps[currentStep]}</p>
          </div>
          
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center"
            >
              <ChevronLeft className="h-5 w-5 mr-1" /> Previous
            </Button>
            
            <div className="flex space-x-1">
              {instructionSteps.map((_, index) => (
                <div 
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === currentStep ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
            
            <Button
              variant="default"
              onClick={nextStep}
              className="flex items-center"
            >
              {currentStep === instructionSteps.length - 1 ? 'Complete' : 'Next'} <ChevronRight className="h-5 w-5 ml-1" />
            </Button>
          </div>
        </div>
        
        {/* Materials and Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Materials Needed</h3>
            <ul className="list-disc pl-5 space-y-1">
              {game.materials.map((material, index) => (
                <li key={index} className="text-gray-700">{material}</li>
              ))}
            </ul>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Facilitation Tips</h3>
            <div className="text-gray-700 text-sm">
              <pre className="whitespace-pre-wrap font-sans">
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