# 🎯 AgileGamifAI

**Interactive Games for Agile Teams: AI Generated + Human Experimented**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/lorettarehm/AgileGamifAI)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3+-06B6D4?logo=tailwindcss)](https://tailwindcss.com/)

AgileGamifAI is a comprehensive platform that revolutionizes how Agile teams learn, collaborate, and improve through interactive games and activities. Combining AI-powered game generation with human-tested methodologies, this platform serves as your ultimate toolkit for enhancing team dynamics, learning outcomes, and Agile practices.

## 🌟 Key Features

### 🎮 **Comprehensive Game Library**

- **Multi-Framework Support**: Scrum, Kanban, XP, Lean, LeSS, Nexus, and general Agile practices


### 🤖 **AI-Powered Game Creation**
- **Intelligent Game Generation**: Create custom games using advanced AI that understands Agile principles
- **Context-Aware Suggestions**: Get game recommendations based on your team's specific needs and challenges
- **Rapid Prototyping**: Generate complete game structures in seconds, then refine with human expertise
- **Smart Filtering**: Find the perfect game by methodology, team size, duration, complexity, and learning objectives
- **Accessibility First**: Games designed with inclusivity in mind, featuring accessibility notes and adaptations
- **Step-by-Step Guidance**: Detailed facilitation instructions
- **Mobile-Responsive**: Facilitate from any device, anywhere
- **Favorites System**: Save and organize your most effective games
- **Custom Collections**: Create themed game collections for different scenarios
- **Usage Analytics**: Track which games work best for your team

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Modern web browser

### Environment Setup

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anonymous_key
VITE_HF_ACCESS_TOKEN=your_huggingface_access_token
```

## 🚨 IMPORTANT SECURITY WARNING

**🔐 API Keys Are Exposed in Client-Side Builds**

This application uses a client-side architecture that **exposes API keys in the built JavaScript bundle**. Anyone can:
- Extract API keys from browser developer tools
- View keys in the built application source
- Access keys through network traffic inspection

### For Development & Testing Only
- ✅ Use for local development and testing
- ✅ Use demo/limited API keys for public deployments
- ❌ **NEVER use production API keys in client builds**
- ❌ **NEVER use high-limit or billing-enabled keys**

### Production Deployment Options
1. **Backend API** (Recommended) - Move API calls to your server
2. **Serverless Functions** - Use Vercel/Netlify/AWS Lambda as proxy
3. **User-Provided Keys** - Let users input their own API keys

📖 **See [SECURITY.md](SECURITY.md) for complete security guidance and mitigation strategies.**

The application will be available at `http://localhost:5173`

## 📱 Customer Journey Demo

### Scenario: Sarah, an Agile Coach, Preparing for a Team Retrospective

**👤 Meet Sarah**: She's an experienced Agile Coach working with a distributed team of 8 developers who've been struggling with communication issues after their last sprint.

#### **Step 1: Discovering the Perfect Game**
```
🎯 Goal: Find an engaging retrospective activity for communication improvement

🔍 Sarah's Journey:
1. Opens AgileGamifAI in her browser
2. Navigates to the Game Library
3. Applies filters:
   - Methodology: "Scrum"
   - Purpose: "Retrospective"
   - Participants: "8"
   - Duration: "30 minutes"
   - Focus: "Team Building"
```

#### **Step 2: Exploring Game Options**
```
📚 Discovery Phase:
- Browses through 12 filtered results
- Reviews game cards showing:
  ✓ Duration and participant count
  ✓ Complexity level
  ✓ Learning outcomes
  ✓ Required materials
- Favorites 3 promising games for future reference
```

#### **Step 3: Detailed Game Analysis**
```
🔍 Deep Dive:
- Clicks on "Communication Circle" game
- Reviews comprehensive details:
  ✓ Step-by-step instructions
  ✓ Facilitation tips from experienced coaches
  ✓ Expected learning outcomes
  ✓ Accessibility considerations
  ✓ Material requirements: "Sticky notes, Timer, Video conferencing tool"
```

#### **Step 4: AI-Enhanced Customization**
```
🤖 Smart Adaptation:
- After the session, Sarah wants a similar game for her next team
- Uses AI Game Suggestion feature:
  
  Prompt: "Create a retrospective game similar to Communication Circle 
          but focused on celebrating wins for a team that just 
          completed a successful product launch"
          
- AI generates "Victory Lap Retrospective" in 10 seconds
- Reviews, customizes, and saves to her collection
```

#### **Step 5: Results & Follow-up**
```
📈 Outcome Tracking:
- Game successfully improves team communication
- Sarah adds the game to her "Go-To Retrospectives" collection
- Shares game link with fellow coaches in her network
- Plans to use modified version in next sprint review
```

## 🛠️ Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Frontend** | React 18+ with TypeScript | Modern, type-safe UI development |
| **Styling** | Tailwind CSS | Responsive, utility-first styling |
| **Build Tool** | Vite | Fast development and optimized builds |
| **Database** | Supabase | Real-time database and authentication |
| **AI Integration** | Hugging Face API | Natural language processing for game generation |
| **Icons** | Lucide React | Consistent, accessible iconography |
| **State Management** | React Hooks | Lightweight state management |

## 🎨 Design System

### Color Palette
- **Primary**: Teal (#14B8A6) - Trust, clarity, growth
- **Secondary**: Purple (#8B5CF6) - Creativity, innovation, insight
- **Gradients**: Subtle teal-to-purple gradients for visual depth

### Typography
- Clean, modern font hierarchy
- Optimized for readability across devices
- Accessible contrast ratios (WCAG 2.1 AA compliant)

## 📋 Usage Examples

### Finding Games by framework / strategy 

```javascript
// Filter games for Scrum teams
const scrumGames = games.filter(game => 
  game.methodology.includes('Scrum')
);

// Filter by team size and duration
const quickTeamBuilders = games.filter(game =>
  game.purpose.includes('Team Building') &&
  game.duration <= 15 &&
  game.minParticipants <= teamSize &&
  game.maxParticipants >= teamSize
);
```

### Creating Custom Filters

```javascript
const perfectGame = {
  methodology: ['Scrum', 'Kanban'],
  purpose: ['Retrospective'],
  participants: 6,
  maxDuration: 45,
  complexity: ['Easy', 'Medium'],
  accessibleOnly: true
};
```

## 🏗️ Development

### Project Structure

```
AgileGamifAI/
├── src/
│   ├── components/          # React components
│   │   ├── ui/             # Reusable UI components
│   │   ├── GameCard.tsx    # Game display component
│   │   ├── GameDetail.tsx  # Detailed game view
│   │   ├── GameCreate.tsx  # Game creation interface
│   │   └── GameFacilitator.tsx # Facilitation mode
│   ├── data/               # Sample data and constants
│   ├── types/              # TypeScript type definitions
│   └── App.tsx             # Main application component
├── public/                 # Static assets
└── dist/                   # Built application
```

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler
```

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

**🚨 SECURITY GUIDELINES FOR CONTRIBUTORS:**
- **NEVER commit production API keys** to version control
- Use demo/test keys with limited quotas for development
- Test with `.env.local` (git-ignored) for personal API keys
- Document any new security considerations in SECURITY.md
- Review the [Security Policy](SECURITY.md) before contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🌐 Browser Support

- **Chrome** 90+
- **Firefox** 88+
- **Safari** 14+
- **Edge** 90+
- **Mobile browsers** (iOS Safari, Chrome Android)

## 📊 Performance

- **Initial Load**: < 3 seconds
- **Game Filtering**: < 500ms
- **AI Generation**: < 10 seconds
- **Lighthouse Score**: 95+ for Performance, Accessibility, Best Practices

## 🔒 Privacy & Security

**⚠️ CRITICAL SECURITY LIMITATION: API keys are exposed in client-side builds.**

- No personal data collection without consent
- **API keys visible in built JavaScript bundle** - see [SECURITY.md](SECURITY.md)
- Input sanitization and validation
- **NOT recommended for production without backend security layer**

For production deployments, implement server-side API handling or use demo keys only.
- HTTPS-only deployment

## 💖 Support

If you find AgileGamifAI helpful, consider:

- ⭐ Starring this repository
- 🐛 Reporting bugs or suggesting features
- ☕ [Buying us a coffee](https://coff.ee/AgileGamifAI)
- 📢 Sharing with your Agile community

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Agile Community**: For continuous inspiration and feedback
- **Game Designers**: Who created the foundational activities we've digitized
- **Contributors**: Everyone who helps make this platform better
- **Beta Testers**: Agile coaches and Scrum Masters who provided invaluable feedback

---

**Ready to transform your Agile practices?** [Start exploring games now!](https://agilegamifai.com) 🚀
