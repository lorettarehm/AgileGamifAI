export type AgileMethodology = 
  | 'Scrum' 
  | 'Kanban' 
  | 'XP' 
  | 'Lean' 
  | 'LeSS' 
  | 'Nexus' 
  | 'General';

export type GamePurpose = 
  | 'Team Building' 
  | 'Problem Solving' 
  | 'Retrospective' 
  | 'Estimation' 
  | 'Planning' 
  | 'Prioritization'
  | 'Process Improvement';

export type GameComplexity = 'Easy' | 'Medium' | 'Hard';

export type AgileKnowledgeLevel = 
  | 'New to Agile'
  | 'Agile Basics'
  | 'Agile Practitioner'
  | 'Agile Master';

export interface Game {
  id: string;
  title: string;
  description: string;
  methodology: AgileMethodology[];
  purpose: GamePurpose[];
  minParticipants: number;
  maxParticipants: number;
  duration: number; // in minutes
  materials: string[];
  instructions: string;
  facilitationTips: string;
  complexity: GameComplexity;
  isFavorite: boolean;
  learningOutcomes: string[];
  isAccessible: boolean;
  accessibilityNotes?: string;
  requiredKnowledgeLevel: AgileKnowledgeLevel;
}

export interface GameFilters {
  methodology: AgileMethodology[];
  purpose: GamePurpose[];
  participants: number;
  maxDuration: number;
  complexity: GameComplexity[];
  searchTerm: string;
  knowledgeLevel: AgileKnowledgeLevel[];
  accessibleOnly: boolean;
}