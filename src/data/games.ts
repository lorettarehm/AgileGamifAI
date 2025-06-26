import { Game } from '../types';

export const sampleGames: Game[] = [
  {
    id: '1',
    title: 'Scrum Poker',
    description: 'A collaborative planning poker game for estimating effort in Scrum teams',
    framework: ['Scrum'],
    purpose: ['Estimation', 'Planning'],
    minParticipants: 3,
    maxParticipants: 12,
    duration: 30,
    materials: ['Planning poker cards', 'User stories or tasks to estimate'],
    instructions: `
      1. The facilitator presents a user story or task to the team
      2. Each team member selects a card representing their estimation
      3. All team members reveal their cards simultaneously
      4. If there's a significant difference in estimates, team members discuss their reasoning
      5. The team re-estimates until consensus is reached
    `,
    facilitationTips: `
      - Ensure everyone understands the user story before estimating
      - Encourage team members with significantly different estimates to explain their thinking
      - Remember the goal is to reach consensus, not to argue over exact numbers
      - Use relative sizing rather than absolute time estimates
    `,
    complexity: 'Easy',
    isFavorite: false
  },
  {
    id: '2',
    title: 'Sailboat Retrospective',
    description: 'A visual retrospective technique that helps teams identify what\'s helping or hindering progress',
    framework: ['Scrum', 'Kanban', 'XP'],
    purpose: ['Retrospective', 'Process Improvement'],
    minParticipants: 4,
    maxParticipants: 15,
    duration: 45,
    materials: ['Whiteboard or large paper', 'Sticky notes', 'Markers'],
    instructions: `
      1. Draw a sailboat, with an island (goal), wind (helping forces), anchor (hindering forces), and rocks (risks)
      2. Team members write items on sticky notes for each category
      3. Team members place their notes on the appropriate areas of the drawing
      4. The team discusses each item and identifies actions to take
      5. Vote on which actions to prioritize
    `,
    facilitationTips: `
      - Ensure equal participation from all team members
      - Keep the discussion focused on actionable improvements
      - Set a time limit for discussing each category
      - End with clear action items and owners
    `,
    complexity: 'Medium',
    isFavorite: false
  },
  {
    id: '3',
    title: 'Ball Point Game',
    description: 'A game that demonstrates flow, self-organization, and continuous improvement',
    framework: ['Lean', 'Scrum'],
    purpose: ['Team Building', 'Process Improvement'],
    minParticipants: 6,
    maxParticipants: 20,
    duration: 40,
    materials: ['Small balls (at least 1 per participant)', 'Stopwatch', 'Flipchart'],
    instructions: `
      1. Form a circle with all participants
      2. Each ball must be touched by every team member in a specific order
      3. Balls cannot be passed to adjacent team members
      4. If a ball touches the ground, it must restart
      5. Run multiple iterations with planning time between each
      6. Track how many balls complete the cycle in each iteration
    `,
    facilitationTips: `
      - Don't give too many instructions; let the team self-organize
      - Encourage the team to retrospect between iterations
      - Ask questions about what's working and what could be improved
      - Connect the game to real-world process improvement
    `,
    complexity: 'Medium',
    isFavorite: false
  },
  {
    id: '4',
    title: 'Kanban Pizza Game',
    description: 'A simulation of a Kanban system using pizza production as a metaphor',
    framework: ['Kanban', 'Lean'],
    purpose: ['Process Improvement', 'Problem Solving'],
    minParticipants: 5,
    maxParticipants: 15,
    duration: 60,
    materials: [
      'Paper for "pizza bases"', 
      'Colored markers or stickers for "toppings"', 
      'Index cards for orders', 
      'Flipchart for Kanban board'
    ],
    instructions: `
      1. Set up workstations for different pizza-making steps
      2. Create a Kanban board with columns for order backlog, preparation, baking, quality check, and delivery
      3. Assign roles: order taker, pizza makers, quality checker, delivery person
      4. Run several iterations, with orders coming in regularly
      5. Track cycle time, throughput, and quality issues
      6. Between iterations, discuss improvements and implement changes
    `,
    facilitationTips: `
      - Introduce WIP limits after the first iteration
      - Create some "special orders" to illustrate handling exceptions
      - Discuss bottlenecks and how to address them
      - Connect the game to real work management in the team
    `,
    complexity: 'Hard',
    isFavorite: false
  },
  {
    id: '5',
    title: 'Dot Voting',
    description: 'A simple, visual way to prioritize items as a team',
    framework: ['General'],
    purpose: ['Prioritization', 'Planning'],
    minParticipants: 3,
    maxParticipants: 30,
    duration: 15,
    materials: ['Items to prioritize on wall or board', 'Colored dot stickers (5-10 per person)'],
    instructions: `
      1. Display all items to be prioritized where everyone can see them
      2. Give each participant a set number of dot stickers
      3. Explain the voting criteria (value, effort, risk, etc.)
      4. Allow participants to place their dots on items (they can put multiple dots on one item)
      5. Count the dots and prioritize based on the results
    `,
    facilitationTips: `
      - Be clear about the voting criteria
      - Consider doing multiple rounds with different criteria
      - Allow time for questions about items before voting begins
      - Discuss surprising results after voting completes
    `,
    complexity: 'Easy',
    isFavorite: false
  }
];