import React, { useState } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Accessibility } from 'lucide-react';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { GameFilters, AgileFramework, GamePurpose, GameComplexity, AgileKnowledgeLevel } from '../types';

interface GameFilterProps {
  filters: GameFilters;
  onFilterChange: (filters: GameFilters) => void;
}

const GameFilter: React.FC<GameFilterProps> = ({ filters, onFilterChange }) => {
  const [expanded, setExpanded] = useState(false);

  const frameworks: AgileFramework[] = ['Scrum', 'Kanban', 'XP', 'Lean', 'LeSS', 'Nexus', 'General'];
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

  const toggleFramework = (framework: AgileFramework) => {
    const current = filters.framework;
    const updated = current.includes(framework)
      ? current.filter(m => m !== framework)
      : [...current, framework];
    
    onFilterChange({ ...filters, framework: updated });
  };

  const togglePurpose = (purpose: GamePurpose) => {
    const current = filters.purpose;
    const updated = current.includes(purpose)
      ? current.filter(p => p !== purpose)
      : [...current, purpose];
    
    onFilterChange({ ...filters, purpose: updated });
  };

  const toggleComplexity = (complexity: GameComplexity) => {
    const current = filters.complexity;
    const updated = current.includes(complexity)
      ? current.filter(c => c !== complexity)
      : [...current, complexity];
    
    onFilterChange({ ...filters, complexity: updated });
  };

  const toggleKnowledgeLevel = (level: AgileKnowledgeLevel) => {
    const current = filters.knowledgeLevel;
    const updated = current.includes(level)
      ? current.filter(l => l !== level)
      : [...current, level];
    
    onFilterChange({ ...filters, knowledgeLevel: updated });
  };

  const updateParticipants = (value: number) => {
    onFilterChange({ ...filters, participants: value });
  };

  const updateMaxDuration = (value: number) => {
    onFilterChange({ ...filters, maxDuration: value });
  };

  const updateSearchTerm = (term: string) => {
    onFilterChange({ ...filters, searchTerm: term });
  };

  const toggleAccessibleOnly = () => {
    onFilterChange({ ...filters, accessibleOnly: !filters.accessibleOnly });
  };

  const resetFilters = () => {
    onFilterChange({
      framework: [],
      purpose: [],
      participants: 0,
      maxDuration: 120,
      complexity: [],
      searchTerm: '',
      knowledgeLevel: [],
      accessibleOnly: false
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6 border border-teal-100">
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Search games..."
            className="w-full pl-10 pr-4 py-2 border border-teal-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            value={filters.searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          className="flex items-center gap-2 whitespace-nowrap border-teal-300 text-teal-700 hover:bg-teal-50"
          onClick={() => setExpanded(!expanded)}
        >
          <Filter className="h-4 w-4" />
          {expanded ? "Hide Filters" : "Show Filters"}
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
      </div>

      {expanded && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <h3 className="font-medium text-teal-700 mb-2">Framework</h3>
            <div className="flex flex-wrap gap-2">
              {frameworks.map((framework) => (
                <Badge
                  key={framework}
                  variant={filters.framework.includes(framework) ? "default" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.framework.includes(framework) ? '' : 'hover:bg-teal-100'
                  }`}
                  onClick={() => toggleFramework(framework)}
                >
                  {framework}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-teal-700 mb-2">Purpose</h3>
            <div className="flex flex-wrap gap-2">
              {purposes.map((purpose) => (
                <Badge
                  key={purpose}
                  variant={filters.purpose.includes(purpose) ? "secondary" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.purpose.includes(purpose) ? '' : 'hover:bg-purple-100'
                  }`}
                  onClick={() => togglePurpose(purpose)}
                >
                  {purpose}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-medium text-teal-700 mb-2">Knowledge Level</h3>
            <div className="flex flex-wrap gap-2">
              {knowledgeLevels.map((level) => (
                <Badge
                  key={level}
                  variant={filters.knowledgeLevel.includes(level) ? "purple" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.knowledgeLevel.includes(level) ? '' : 'hover:bg-purple-100'
                  }`}
                  onClick={() => toggleKnowledgeLevel(level)}
                >
                  {level}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-teal-700 mb-2">
                Team Size: {filters.participants > 0 ? `${filters.participants}+ participants` : 'Any'}
              </h3>
              <input
                type="range"
                min="0"
                max="20"
                step="1"
                value={filters.participants}
                onChange={(e) => updateParticipants(Number(e.target.value))}
                className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-thumb-teal"
              />
            </div>

            <div>
              <h3 className="font-medium text-teal-700 mb-2">
                Max Duration: {filters.maxDuration} minutes
              </h3>
              <input
                type="range"
                min="15"
                max="120"
                step="5"
                value={filters.maxDuration}
                onChange={(e) => updateMaxDuration(Number(e.target.value))}
                className="w-full h-2 bg-teal-200 rounded-lg appearance-none cursor-pointer slider-thumb-teal"
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium text-teal-700 mb-2">Complexity</h3>
            <div className="flex flex-wrap gap-2">
              {complexities.map((complexity) => (
                <Badge
                  key={complexity}
                  variant={filters.complexity.includes(complexity) ? "purple" : "outline"}
                  className={`cursor-pointer transition-colors ${
                    filters.complexity.includes(complexity) ? '' : 'hover:bg-purple-100'
                  }`}
                  onClick={() => toggleComplexity(complexity)}
                >
                  {complexity}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={filters.accessibleOnly}
                onChange={toggleAccessibleOnly}
                className="h-4 w-4 text-teal-600 rounded border-teal-300 focus:ring-teal-500"
              />
              <span className="text-sm font-medium text-teal-700 flex items-center">
                <Accessibility className="h-4 w-4 mr-1" />
                Show only disability-friendly games
              </span>
            </label>
          </div>

          <div className="flex justify-end">
            <Button variant="ghost" onClick={resetFilters} className="text-teal-600 hover:bg-teal-100">
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameFilter;