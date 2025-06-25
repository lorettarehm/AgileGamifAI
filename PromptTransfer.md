# AgileGamifAI Application Recreation Prompt

## Overview
Create a modern web application called "AgileGamifAI" that serves as a comprehensive platform for Agile games and activities. The application should help Agile practitioners discover, create, manage, and facilitate games that enhance team collaboration and learning.

## Core Technologies Stack
- **Frontend Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom components
- **Database**: Any modern database (SQL-based preferred for relational data)
- **AI Integration**: Any text generation AI service with API access
- **Deployment**: Static hosting platform with CI/CD pipeline
- **Icons**: Lucide React icon library

## Application Architecture

### Type Definitions
```typescript
export type AgileFramework = 'Scrum' | 'Kanban' | 'XP' | 'Lean' | 'LeSS' | 'Nexus' | 'General';
export type GamePurpose = 'Team Building' | 'Problem Solving' | 'Retrospective' | 'Estimation' | 'Planning' | 'Prioritization' | 'Process Improvement';
export type GameComplexity = 'Easy' | 'Medium' | 'Hard';
export type AgileKnowledgeLevel = 'New to Agile' | 'Agile Basics' | 'Agile Practitioner' | 'Agile Master';

export interface Game {
  id: string;
  title: string;
  description: string;
  framework: AgileFramework[];
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
  framework: AgileFramework[];
  purpose: GamePurpose[];
  participants: number;
  maxDuration: number;
  complexity: GameComplexity[];
  searchTerm: string;
  knowledgeLevel: AgileKnowledgeLevel[];
  accessibleOnly: boolean;
}
```

## Key Features & Components

### 1. Main Application (App.tsx)
- **State Management**: Games list, filters, current view, selected game, pagination
- **Views**: Library, Create, Favorites, Detail, Facilitator modes
- **Database Integration**: Load games from database, handle favorites
- **Responsive Pagination**: Adaptive items per page based on screen size
- **Error Handling**: Loading states and error messages

### 2. Game Library System
**Components**: GameGrid, GameCard, GameFilter
- **Grid Display**: Responsive grid layout for game cards
- **Advanced Filtering**: Multi-criteria filtering by framework, purpose, complexity, knowledge level, participants, duration, search terms, accessibility
- **Game Cards**: Display game overview with key metadata and actions
- **Pagination**: Page-based navigation for large game collections

### 3. AI-Powered Game Suggestion (AIGameSuggestion.tsx)
- **Custom Prompts**: User input for specific game requirements
- **AI Integration**: Generate games using text generation AI with structured prompts
- **System Prompt**: Expert Agile coach persona with specific JSON response format
- **Response Parsing**: Parse AI-generated JSON into Game objects
- **Save Integration**: Save liked AI-generated games to database with popularity tracking
- **Error Handling**: Graceful failure with user-friendly messages

### 4. Manual Game Creation (GameCreate.tsx)
- **Form Interface**: Comprehensive form for all game properties
- **AI Assistance**: Auto-complete missing fields using AI when partial data is provided
- **Validation**: Required field validation with error display
- **Dynamic Arrays**: Add/remove materials and learning outcomes
- **Multi-Select**: Framework and purpose selection with toggle functionality

### 5. Game Facilitator Mode (GameFacilitator.tsx)
- **Timer System**: Countdown timer with play/pause/reset functionality
- **Step Navigation**: Step-by-step instruction walkthrough
- **Progress Tracking**: Visual progress bar and step indicators
- **Real-time Updates**: 1-second timer intervals with cleanup
- **Visual Feedback**: Color-coded timer states (green/yellow/red)

### 6. Game Detail View (GameDetail.tsx)
- **Comprehensive Display**: All game information with structured layout
- **Action Buttons**: Start facilitation, back navigation
- **Accessibility**: Conditional display of accessibility notes
- **Visual Design**: Gradient backgrounds and badge system for metadata

### 7. Header Navigation (Header.tsx)
- **Multi-View Navigation**: Library, Create, Favorites
- **Responsive Design**: Mobile hamburger menu, desktop button layout
- **Logo Integration**: Custom logo display
- **State-Aware**: Disabled navigation during certain modes

### 8. UI Component System
**Components**: Button, Badge, Card
- **Variant System**: Multiple visual variants for different contexts
- **Accessibility**: Proper ARIA attributes and keyboard navigation
- **Consistent Styling**: Unified design system across components

## Database Schema

### Games Storage
- **Table**: `liked_games`
- **Fields**:
  - `id`: UUID primary key
  - `game_data`: JSONB containing complete Game object
  - `prompt`: Text field for AI generation prompt (optional)
  - `popularity`: Integer counter for like/dislike tracking
  - `created_at`: Timestamp

### Security
- Row Level Security enabled
- Public read/insert/update policies for community features

## Sample Data Requirements
Include pre-populated games covering:
- **Scrum Games**: Planning poker, retrospective activities, sprint planning exercises
- **Kanban Games**: Flow visualization, WIP limit exercises, continuous improvement activities
- **General Agile**: Team building, problem-solving, process improvement
- **Complexity Range**: Easy to Hard difficulty levels
- **Knowledge Levels**: Games for all experience levels from beginners to masters

## AI Integration Specifications

### Game Generation Prompt Structure
```
System: You are an expert Agile coach. Create an engaging Agile game with the following JSON format:
{
  "title": "Game Title",
  "description": "Brief description",
  "framework": ["Array of frameworks"],
  "purpose": ["Array of purposes"],
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
  "requiredKnowledgeLevel": "New to Agile/Agile Basics/Agile Practitioner/Agile Master"
}

User request: [User's prompt]
```

### AI Model Requirements
- **Capability**: Text generation with JSON output
- **Parameters**: Max tokens ~1000, temperature 0.7
- **Error Handling**: JSON parsing with fallback error messages

## Styling Guidelines
- **Color Scheme**: Teal and purple gradient theme
- **Typography**: Clean, modern fonts with proper hierarchy
- **Responsive Design**: Mobile-first approach with breakpoints
- **Accessibility**: High contrast, screen reader support, keyboard navigation
- **Visual Feedback**: Loading states, hover effects, transitions

## Development Environment Setup
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "lint": "eslint .",
    "preview": "vite preview"
  }
}
```

## Environment Variables Required
```env
VITE_DATABASE_URL=your_database_connection_string
VITE_DATABASE_ANON_KEY=your_database_anonymous_key
```

## Deployment Configuration
- **Static Build**: Generate static files for hosting
- **Environment**: Configure database and AI service connections
- **CI/CD**: Automated build and deployment pipeline
- **Domain**: Custom domain with HTTPS

## Performance Requirements
- **Loading**: Fast initial load with lazy loading for images
- **Responsiveness**: Smooth animations and transitions
- **Offline**: Basic functionality without network connectivity
- **SEO**: Proper meta tags and structured data

## Security Considerations
- **Input Validation**: Sanitize all user inputs
- **API Security**: Secure AI service API keys
- **Database**: Proper access controls and validation
- **XSS Prevention**: Escape user-generated content

## Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (latest 2 versions)
- **Mobile**: iOS Safari, Chrome Android
- **Progressive Enhancement**: Graceful degradation for older browsers

## Testing Requirements
See the regression test scripts below for comprehensive testing coverage of all features.

---

# Regression Test Scripts

## Test Suite 1: Core Application Functionality

### Test 1.1: Application Initialization
```javascript
describe('Application Initialization', () => {
  test('should load the application without errors', () => {
    // Verify main app component renders
    // Check for header, navigation, and main content areas
    // Ensure no JavaScript errors in console
  });
  
  test('should display default library view', () => {
    // Verify library view is active by default
    // Check for game grid or loading state
    // Verify filter panel is visible
  });
});
```

### Test 1.2: Navigation System
```javascript
describe('Navigation System', () => {
  test('should navigate between main views', () => {
    // Test Library → Create → Favorites navigation
    // Verify URL changes and view updates
    // Check active state highlighting
  });
  
  test('should handle mobile navigation', () => {
    // Test mobile menu toggle
    // Verify responsive behavior
    // Check accessibility of mobile navigation
  });
});
```

## Test Suite 2: Game Library Features

### Test 2.1: Game Display and Grid
```javascript
describe('Game Library Display', () => {
  test('should display games in responsive grid', () => {
    // Verify grid layout adapts to screen size
    // Check game card rendering
    // Test pagination functionality
  });
  
  test('should handle empty states', () => {
    // Test behavior with no games
    // Verify loading states
    // Check error state handling
  });
});
```

### Test 2.2: Advanced Filtering System
```javascript
describe('Game Filtering', () => {
  test('should filter by framework', () => {
    // Test single and multiple framework selection
    // Verify filtered results accuracy
    // Check filter state persistence
  });
  
  test('should filter by purpose, complexity, and knowledge level', () => {
    // Test all filter categories
    // Verify combined filter behavior
    // Check filter reset functionality
  });
  
  test('should filter by participants and duration', () => {
    // Test numeric range filtering
    // Verify participant count logic
    // Check duration filtering accuracy
  });
  
  test('should perform text search', () => {
    // Test title and description search
    // Verify case-insensitive matching
    // Check search term highlighting
  });
  
  test('should filter by accessibility requirements', () => {
    // Test accessibility-only filter
    // Verify accessible games display
    // Check accessibility notes visibility
  });
});
```

## Test Suite 3: AI Integration

### Test 3.1: AI Game Suggestion
```javascript
describe('AI Game Suggestion', () => {
  test('should generate games from custom prompts', () => {
    // Test prompt input and submission
    // Verify AI API integration
    // Check generated game structure
  });
  
  test('should handle AI generation errors', () => {
    // Test network failures
    // Verify JSON parsing errors
    // Check user-friendly error messages
  });
  
  test('should save and rate generated games', () => {
    // Test like/dislike functionality
    // Verify database persistence
    // Check popularity tracking
  });
});
```

### Test 3.2: AI-Assisted Game Creation
```javascript
describe('AI-Assisted Creation', () => {
  test('should auto-complete missing fields', () => {
    // Test partial game data input
    // Verify AI field completion
    // Check merged game data accuracy
  });
  
  test('should preserve user input during AI assistance', () => {
    // Verify user fields are not overwritten
    // Check field merge logic
    // Test validation after AI completion
  });
});
```

## Test Suite 4: Game Management

### Test 4.1: Game Creation
```javascript
describe('Manual Game Creation', () => {
  test('should create games with complete validation', () => {
    // Test all required field validation
    // Verify form submission
    // Check game object creation
  });
  
  test('should handle dynamic arrays', () => {
    // Test materials array add/remove
    // Verify learning outcomes management
    // Check array validation
  });
  
  test('should support multi-select fields', () => {
    // Test framework selection
    // Verify purpose selection
    // Check selection state management
  });
});
```

### Test 4.2: Game Detail View
```javascript
describe('Game Detail Display', () => {
  test('should display comprehensive game information', () => {
    // Verify all game fields are shown
    // Check formatting and layout
    // Test responsive design
  });
  
  test('should handle accessibility features', () => {
    // Test accessibility notes display
    // Verify conditional rendering
    // Check accessibility compliance
  });
});
```

## Test Suite 5: Game Facilitation

### Test 5.1: Facilitator Mode
```javascript
describe('Game Facilitator', () => {
  test('should manage game timer functionality', () => {
    // Test play/pause/reset controls
    // Verify countdown accuracy
    // Check timer completion handling
  });
  
  test('should navigate through instruction steps', () => {
    // Test step-by-step navigation
    // Verify progress tracking
    // Check instruction parsing
  });
  
  test('should provide visual feedback', () => {
    // Test progress bar updates
    // Verify color-coded timer states
    // Check responsive design
  });
});
```

## Test Suite 6: Database Integration

### Test 6.1: Data Persistence
```javascript
describe('Database Operations', () => {
  test('should save and retrieve liked games', () => {
    // Test game saving to database
    // Verify data persistence
    // Check retrieval accuracy
  });
  
  test('should manage popularity tracking', () => {
    // Test like/dislike operations
    // Verify popularity counter updates
    // Check concurrent access handling
  });
  
  test('should handle database errors gracefully', () => {
    // Test connection failures
    // Verify error handling
    // Check user feedback
  });
});
```

## Test Suite 7: Performance and Accessibility

### Test 7.1: Performance Testing
```javascript
describe('Performance', () => {
  test('should load efficiently with large datasets', () => {
    // Test with 100+ games
    // Verify pagination performance
    // Check memory usage
  });
  
  test('should handle concurrent AI requests', () => {
    // Test multiple simultaneous AI calls
    // Verify request queuing
    // Check timeout handling
  });
});
```

### Test 7.2: Accessibility Testing
```javascript
describe('Accessibility', () => {
  test('should support keyboard navigation', () => {
    // Test tab order
    // Verify keyboard shortcuts
    // Check focus management
  });
  
  test('should provide screen reader support', () => {
    // Test ARIA attributes
    // Verify semantic HTML
    // Check screen reader announcements
  });
  
  test('should maintain color contrast standards', () => {
    // Test WCAG compliance
    // Verify contrast ratios
    // Check color-blind accessibility
  });
});
```

## Test Suite 8: Integration Testing

### Test 8.1: End-to-End Workflows
```javascript
describe('Complete User Workflows', () => {
  test('should complete full game discovery workflow', () => {
    // Search → Filter → View Details → Facilitate
    // Verify state transitions
    // Check data consistency
  });
  
  test('should complete full game creation workflow', () => {
    // Create → AI Assist → Save → View Details
    // Verify data flow
    // Check validation at each step
  });
  
  test('should complete AI suggestion workflow', () => {
    // Prompt → Generate → Like → Save → Facilitate
    // Verify AI integration
    // Check persistence and retrieval
  });
});
```

## Test Execution Instructions

1. **Setup Test Environment**:
   ```bash
   npm install --dev jest @testing-library/react @testing-library/jest-dom
   ```

2. **Run Test Suites**:
   ```bash
   # Run all tests
   npm test
   
   # Run specific test suite
   npm test -- --testNamePattern="Game Library"
   
   # Run with coverage
   npm test -- --coverage
   ```

3. **Integration Test Requirements**:
   - Test database with sample data
   - Mock AI service responses
   - Test with different screen sizes
   - Verify cross-browser compatibility

4. **Performance Benchmarks**:
   - Initial load: < 3 seconds
   - Game filtering: < 500ms
   - AI generation: < 10 seconds
   - Database operations: < 1 second

5. **Accessibility Standards**:
   - WCAG 2.1 Level AA compliance
   - Keyboard navigation support
   - Screen reader compatibility
   - Color contrast requirements