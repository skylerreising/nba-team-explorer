# Basketball Project - Planning Document

## Overview
A portfolio project using the [balldontlie API](https://www.balldontlie.io) to display basketball (and potentially other sports) statistics.

---

## Decisions Made

### Hosting: GitHub Pages
**Decision**: Use GitHub Pages for hosting
**Rationale**:
- Works well with existing portfolio setup (already using GitHub Pages for other projects)
- React apps compile to static files, which GitHub Pages can serve
- Free hosting with custom domain support
- Easy deployment with `gh-pages` npm package or GitHub Actions

**Note**: GitHub Pages only serves static content (no backend server), but this works fine since we're calling an external API.

### API Key & Rate Limiting
**Decision**: Accept client-side API key exposure (keep it simple)

**Rationale**:
- Free tier has no billing, so no financial risk if key is abused
- Worst case scenario is hitting rate limit (5 req/min)
- Portfolio project, not production software
- Avoids complexity of serverless proxy setup

**Rate Limits (Free Tier)**:
- 5 requests per minute
- Basic endpoints, game/team data only

**Mitigation Strategy - IMPORTANT**:
- **Implement client-side caching** to minimize API calls
- Cache responses in memory or localStorage
- Add debouncing on user inputs (e.g., search fields)
- Consider showing cached data while fetching fresh data
- Display friendly message if rate limit is hit

### Build Tool: Vite
**Decision**: Use Vite + React

**Rationale**:
- Aligns with React Native ecosystem direction (Expo is moving toward Vite for web)
- Fast hot module replacement (HMR), similar to Metro Bundler experience
- Shared tooling patterns with React Native:
  - TypeScript support out of the box
  - Similar environment variable handling (`.env` files)
  - ESBuild for fast transforms
- Well-supported path for React Native Web if we ever want to share code
- Create React App is deprecated; Vite is the modern standard
- Future-proof choice that builds transferable skills for React Native development

### Features: NBA Team-Focused
**Decision**: Build an NBA team-focused app

**Rationale**:
- Only 3-4 endpoints needed, making caching straightforward
- Team data is relatively static, ideal for aggressive caching
- Stays well within 5 req/min rate limit with smart caching
- Focused scope keeps project manageable for portfolio

**Core Features**:
| Feature | Endpoint | Cache Strategy |
|---------|----------|----------------|
| Team Directory | `/nba/teams` | Cache for days/weeks (rarely changes) |
| Team Standings | `/nba/standings` | Cache for hours (updates daily) |
| Team Season Stats | `/nba/team_season_stats` | Cache for hours (updates after games) |
| Team Roster | `/nba/players` (filtered) | Cache for hours (trades are rare) |

**User Flow**:
1. User visits app → Fetch teams once, cache long-term
2. User selects a team → Check cache for standings/roster/stats
   - If cached & recent → Use cache (0 API calls)
   - If stale → Fetch fresh (1-3 calls max)
3. User can browse multiple teams with minimal API usage

**Sport Focus**: NBA only

### Styling: Styled Components
**Decision**: Use Styled Components for styling

**Rationale**:
- Most similar to React Native's `StyleSheet` API (styles as JavaScript objects)
- Skills transfer directly to React Native (`styled-components/native` works the same way)
- CSS-in-JS approach: styles co-located with components
- Component-scoped styles, no class name conflicts
- Supports theming out of the box (useful for team colors)

### State Management: React Query
**Decision**: Use React Query (TanStack Query) for state management

**Rationale**:
- Purpose-built for server state (API calls) with built-in caching
- Configurable stale times per query - perfect for our caching strategy
- Handles the 5 req/min rate limit concern automatically via caching
- Works identically in React and React Native (`@tanstack/react-query`)
- Provides stale-while-revalidate pattern out of the box
- Can add Zustand later if complex client state is needed

**Cache Configuration Strategy**:
| Endpoint | Stale Time | Reason |
|----------|------------|--------|
| `/nba/teams` | 7 days | Teams rarely change |
| `/nba/standings` | 4 hours | Updates daily |
| `/nba/team_season_stats` | 4 hours | Updates after games |
| `/nba/players` | 4 hours | Roster changes are rare |

### Routing: React Router
**Decision**: Use React Router for navigation

**Rationale**:
- Aligns with React Navigation patterns used in React Native apps
- Stack-based navigation model transfers directly to mobile development
- Enables bookmarking/sharing links to specific teams
- Standard approach for multi-screen React apps

**Route Structure**:
| Route | Description |
|-------|-------------|
| `/` | Home / Team list |
| `/teams/:teamId` | Team detail page (standings, roster, stats) |

### Language: TypeScript
**Decision**: Use TypeScript

**Rationale**:
- Adds type safety, catching errors at compile time
- Very common in React Native projects
- Better IDE support (autocomplete, refactoring)
- Self-documenting code through type definitions
- Vite has TypeScript support out of the box

### Code Formatting: Prettier
**Decision**: Use Prettier for code formatting

**Rationale**:
- Consistent code style across the project
- Common in React Native projects
- Integrates with ESLint (included with Vite)
- Reduces bikeshedding about formatting

**Configuration**: Using Prettier defaults (empty `.prettierrc`).

**TODO**: Revisit Prettier settings after building for a while. Consider whether to switch to single quotes, no semicolons, or other preferences based on what feels natural during development.

### Testing: Jest + React Testing Library
**Decision**: Use Jest with React Testing Library

**Rationale**:
- Jest is the default/standard test runner for React Native projects
- React Testing Library works identically in web and React Native (`@testing-library/react-native`)
- Skills transfer directly to React Native testing
- Vitest is Vite-native but Jest is more aligned with RN ecosystem
- Can add tests incrementally after MVP

### Error Handling & Loading States
**Decision**: Implement clear user feedback for all API states

**States to Handle**:
| State | User Feedback |
|-------|---------------|
| Loading | Loading spinner or skeleton UI |
| Success | Display data |
| API Down | Friendly error message with retry option |
| Rate Limited | "Too many requests, please wait" message |
| Network Error | "Check your connection" message |

**Implementation**:
- React Query provides `isLoading`, `isError`, `error` states out of the box
- Create reusable error/loading components
- Consider toast notifications for transient errors

### Browser Support
**Decision**: Modern browsers only

**Rationale**:
- Simpler build configuration
- No polyfills needed
- Portfolio project, not enterprise software
- Target: Latest 2 versions of Chrome, Firefox, Safari, Edge

### Accessibility (a11y)
**Decision**: Accessibility-first approach

**Requirements**:
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`, `<button>`, etc.)
- Proper heading hierarchy (h1 → h2 → h3)
- Keyboard navigation support
- ARIA labels where needed
- Sufficient color contrast
- Focus indicators
- Alt text for images
- Screen reader friendly

**Rationale**:
- Demonstrates professional awareness in portfolio
- Good habit for React Native (accessibility APIs are similar)
- Right thing to do

### Responsive Design
**Decision**: Mobile-first approach

**Rationale**:
- Forces focus on essential content first
- Easier to scale up than scale down
- Common approach in React Native development
- Better portfolio demo (works on any device)

**Breakpoints**:
| Name | Min Width | Target |
|------|-----------|--------|
| mobile | 0px | Phones |
| tablet | 768px | Tablets |
| desktop | 1024px | Desktops |

### Naming Conventions
**Decision**: kebab-case for files, PascalCase for components

**Conventions**:
| Item | Convention | Example |
|------|------------|---------|
| Component files | kebab-case | `team-card.tsx` |
| Component names | PascalCase | `TeamCard` |
| Hook files | kebab-case | `use-teams.ts` |
| Hook names | camelCase | `useTeams` |
| Utility files | kebab-case | `api-client.ts` |
| Type files | kebab-case | `team.types.ts` |
| Folders | kebab-case | `components/` |

### Project Structure
**Decision**: Feature-oriented structure

```
src/
├── components/          # Shared/reusable components
│   ├── ui/              # Generic UI (button, card, spinner)
│   └── layout/          # Layout components (header, footer)
├── features/            # Feature-specific components
│   ├── teams/           # Team list feature
│   └── team-detail/     # Team detail feature
├── hooks/               # Custom hooks
├── api/                 # API client and query hooks
├── types/               # TypeScript type definitions
├── styles/              # Global styles, theme
├── utils/               # Utility functions
├── App.tsx
└── main.tsx
```

**Rationale**:
- Scales well as project grows
- Easy to find related code
- Similar to React Native project structures
- Clear separation of concerns

---

## Project Setup Checklist

### Version Control & GitHub
- [x] Initialize git repository (`git init`)
- [x] Create `.gitignore` with:
  - `node_modules/`
  - `.env` and `.env.local` (API key)
  - `dist/` (build output)
  - IDE files (`.vscode/`, `.idea/`)
  - OS files (`.DS_Store`, `Thumbs.db`)
- [x] Create GitHub repository
- [x] Connect local repo to GitHub remote
- [ ] Set up GitHub Pages deployment (gh-pages package or GitHub Actions)

### Environment & Security
- [x] Create `.env` file for API key (gitignored)
- [x] Create `.env.example` as template (committed, no real values)
- [x] Document environment variable setup in README

### Code Quality
- [x] ESLint configured (included with Vite React template)
- [x] Prettier configured
- [x] TypeScript configured (use Vite React-TS template)

### Documentation
- [x] Create README.md with:
  - Project description
  - Tech stack overview
  - Setup instructions (clone, install, env vars)
  - How to run locally
  - How to deploy

### Package Management
- [x] Use npm (generates `package-lock.json`)
- [x] Commit lock file to repository

---

## Open Questions

1. ~~**Which framework/build tool?**~~ **DECIDED**
   - See "Build Tool" in Decisions Made section

2. ~~**What features should the app have?**~~ **DECIDED**
   - See "Features: NBA Team-Focused" in Decisions Made section

3. ~~**Which sports to focus on?**~~ **DECIDED**
   - NBA only (see Features section)

4. ~~**API Key handling**~~ **DECIDED**
   - See "API Key & Rate Limiting" in Decisions Made section

5. ~~**Styling approach?**~~ **DECIDED**
   - See "Styling: Styled Components" in Decisions Made section

---

## API Information

### Base URL
`https://api.balldontlie.io`

### Authentication
- Requires API key in Authorization header

### Available Data (NBA focus)
- **Teams**: Team information and rosters
- **Players**: Player details and search
- **Games**: Schedules, scores, box scores
- **Statistics**: Player stats (per-game and season averages)
- **Advanced Stats**: Pace, efficiency ratings, net rating
- **Standings**: Current standings
- **Injuries**: Injury reports
- **Play-by-play**: Detailed game events

### Other Sports Available
NFL, MLB, NHL, WNBA, Soccer leagues (EPL, La Liga, etc.), College sports, Esports (CS2, LoL, Dota 2)

### Pagination
Cursor-based pagination with `next_cursor`, `prev_cursor`, `per_page` fields

---

## Tech Stack (Finalized)

| Category | Choice | Notes |
|----------|--------|-------|
| Framework | React | Confirmed |
| Build Tool | Vite | Confirmed - aligns with React Native ecosystem |
| Language | TypeScript | Confirmed - common in React Native, adds type safety |
| Styling | Styled Components | Confirmed - similar to React Native StyleSheet |
| State Management | React Query | Confirmed - built-in caching for API calls |
| Routing | React Router | Confirmed - aligns with React Navigation patterns |
| Testing | Jest + RTL | Confirmed - standard in React Native projects |
| Code Formatting | Prettier | Confirmed - consistent style, common in RN projects |
| Linting | ESLint | Included with Vite template |
| Hosting | GitHub Pages | Confirmed |
| Browser Support | Modern only | Latest 2 versions of major browsers |
| Design Approach | Mobile-first | Responsive with 3 breakpoints |
| Accessibility | a11y-first | Semantic HTML, keyboard nav, ARIA |

---

## Next Steps

1. ~~Initialize Vite + React + TypeScript project~~ ✅
2. ~~Initialize git repository~~ ✅
3. ~~Create GitHub repository and connect remote~~ ✅
4. ~~Verify/enhance `.gitignore` (Vite template includes one)~~ ✅
5. ~~Install dependencies:~~ ✅
   - styled-components
   - @tanstack/react-query
   - react-router-dom
   - jest, @testing-library/react (can defer until after MVP)
6. ~~Configure Prettier~~ ✅
7. ~~Set up project folder structure~~ ✅
8. ~~Create `.env` and `.env.example` files~~ ✅
9. ~~Get API key from balldontlie.io~~ ✅
10. ~~Create README.md~~ ✅
11. ~~Create reusable UI components (loading, error states)~~ ✅
12. ~~Build MVP features~~ ✅ (Teams list + Team detail with roster)
13. Add tests (incrementally)
14. Configure GitHub Pages deployment

---

## Completed Features

### Teams List Page (`/`)
- Displays all 30 NBA teams in a responsive grid
- Team cards link to detail pages
- Loading and error states handled

### Team Detail Page (`/teams/:teamId`)
- Team name, conference, and division
- Full roster with player details:
  - Jersey number
  - Name
  - Position
  - Height
  - Weight
  - College
  - Country
- Back navigation to teams list

### Technical Implementation
- React Query caching with appropriate stale times
- Styled-components theming (NBA colors)
- TypeScript types for API responses
- Mobile-first responsive design

---

## Notes

- Update this document as decisions are made
- **TODO**: Revisit Prettier settings after more development (currently using defaults)
