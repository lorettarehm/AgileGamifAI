# GitHub Copilot Instructions for AgileGamifAI

## Project Overview
AgileGamifAI is a React-based web application that provides interactive games and activities for Agile teams. The platform combines AI-powered game generation with human-tested frameworks, serving as a comprehensive toolkit for enhancing team dynamics and Agile practices.

## Technology Stack
- **Frontend Framework**: React 19+ with TypeScript
- **Build Tool**: Vite 7+
- **Styling**: Tailwind CSS 4+
- **Testing**: Jest with React Testing Library
- **Database**: Supabase
- **AI Integration**: HuggingFace API (via Netlify Functions)
- **Deployment**: Netlify (with serverless functions)

## Code Style and Standards

### TypeScript
- Use strict TypeScript with explicit types
- Avoid `any` type - use proper type definitions
- Define interfaces in `/src/types/` directory
- Follow existing type patterns in the codebase
- Use React 19+ type definitions (`@types/react@^19.1.8`)

### React Components
- Use functional components with hooks
- Follow React Hooks rules (enforced by ESLint)
- Use TypeScript for all React components (`.tsx` extension)
- Implement proper prop types using TypeScript interfaces
- Prefer composition over inheritance

### Styling
- Use Tailwind CSS utility classes for styling
- Follow the existing design system:
  - Primary color: Teal (`#14B8A6`)
  - Secondary color: Purple (`#8B5CF6`)
  - Use subtle teal-to-purple gradients for visual depth
- Ensure all UI is mobile-responsive
- Maintain WCAG 2.1 AA accessibility standards

### File Organization
```
src/
├── components/      # React components
│   ├── ui/         # Reusable UI components
│   └── ...         # Feature-specific components
├── services/       # API services and utilities
├── data/           # Static data and constants
├── types/          # TypeScript type definitions
├── __tests__/      # Test files
└── test-utils/     # Testing utilities
```

## Security Guidelines (CRITICAL)

### API Key Handling
- **NEVER commit API keys** to version control
- All environment variables prefixed with `VITE_` are **exposed in the client bundle**
- Use `.env.local` for local development (git-ignored)
- Document new environment variables in `.env.example`
- Use demo/limited API keys for development and testing
- For AI features, prefer serverless functions (Netlify Functions) to keep API keys secure

### Supabase Integration
- Use environment variables for Supabase URL and keys
- Keep database schema changes documented
- Test with development/staging database, never production

### Security Checklist for Changes
- [ ] No API keys or secrets committed
- [ ] New environment variables documented in `.env.example`
- [ ] Security implications documented in PR
- [ ] SECURITY.md updated if adding new integrations

## Development Workflow

### Setup
```bash
npm install --legacy-peer-deps
npm run dev
```

### Testing
```bash
npm test              # Run tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:ci       # CI mode
```

### Linting and Type Checking
```bash
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

### Building
```bash
npm run build        # Production build
npm run preview      # Preview production build
```

### Local Development with Serverless Functions
```bash
netlify dev          # Start with functions
netlify functions:serve  # Serve functions only
```

## Testing Standards

### Test File Location
- Place tests in `src/__tests__/` directory
- Use `.test.tsx` or `.test.ts` extensions
- Follow existing test patterns

### Testing Library
- Use React Testing Library (`@testing-library/react`)
- Use `@testing-library/user-event` for user interactions
- Use `@testing-library/jest-dom` for assertions

### Test Coverage
- Maintain or improve existing coverage
- Focus on critical user flows
- Test accessibility features
- Mock external API calls

### Example Test Pattern
```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentName } from '../components/ComponentName';

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

## Code Quality Requirements

### ESLint Configuration
- Follow the ESLint rules in `eslint.config.js`
- React Hooks rules are enforced
- React Refresh rules apply to hot module replacement

### Before Submitting Code
1. Run `npm run lint` - fix all linting errors
2. Run `npm run type-check` - resolve all TypeScript errors
3. Run `npm test` - ensure all tests pass
4. Run `npm run build` - verify production build works
5. Test manually in browser - verify functionality works

## AI Features Guidelines

### LLM Service Integration
- Use the existing `llmService.ts` in `src/services/`
- All AI calls should go through Netlify Functions for security
- Implement proper error handling for API failures
- Provide fallback behavior when AI features are unavailable
- Validate and sanitize AI-generated content

### Serverless Functions
- Located in `netlify/functions/`
- Use environment variables for API keys (server-side only)
- Implement rate limiting and error handling
- Return consistent response formats

## Accessibility Requirements
- Use semantic HTML elements
- Provide ARIA labels where needed
- Ensure keyboard navigation works
- Maintain color contrast ratios
- Test with screen readers
- Include accessibility notes in game descriptions

## Documentation Standards

### Code Comments
- Use JSDoc for functions and components when needed
- Explain "why" not "what" in comments
- Document complex algorithms or business logic
- Keep comments up-to-date with code changes

### Component Documentation
- Document props with TypeScript interfaces
- Include usage examples for complex components
- Note any accessibility considerations

## Common Patterns

### Environment Variables
```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

### Component Structure
```typescript
import { FC } from 'react';

interface ComponentProps {
  // Define props
}

export const ComponentName: FC<ComponentProps> = ({ prop }) => {
  // Component logic
  return (
    <div className="tailwind-classes">
      {/* Component JSX */}
    </div>
  );
};
```

## Performance Considerations
- Lazy load components where appropriate
- Optimize images and assets
- Use React.memo for expensive components
- Avoid unnecessary re-renders
- Target Lighthouse score of 95+ for Performance

## Browser Support
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers (iOS Safari, Chrome Android)

## Deployment
- Automatic deployment via Netlify on push to main
- Environment variables configured in Netlify dashboard
- Serverless functions deployed with the application

## Contributing Guidelines
- Follow the patterns in CONTRIBUTING.md
- Write clear commit messages
- Keep PRs focused and small
- Update documentation with code changes
- Review SECURITY.md for security practices

## Framework-Specific Notes

### Agile Frameworks Supported
- Scrum
- Kanban
- XP (Extreme Programming)
- Lean
- LeSS (Large-Scale Scrum)
- Nexus
- General Agile practices

### Game Categories
- Retrospectives
- Planning
- Daily Stand-ups
- Team Building
- Sprint Reviews
- Refinement
- Icebreakers

## Additional Resources
- [README.md](../README.md) - Project overview and quick start
- [CONTRIBUTING.md](../CONTRIBUTING.md) - Contribution guidelines
- [SECURITY.md](../SECURITY.md) - Security policy and practices
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment instructions

## Questions?
If you're unsure about any guidelines or patterns, refer to existing code in the repository as examples. When in doubt, ask for clarification in your pull request.
