# NBA Team Explorer

A React application for browsing NBA teams, standings, rosters, and season statistics. Built as a portfolio project using the [balldontlie API](https://www.balldontlie.io).

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **Styling**: Styled Components
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router
- **Hosting**: GitHub Pages

## Features

- Browse all NBA teams
- View current standings
- Explore team rosters
- Check team season statistics
- Responsive, mobile-first design
- Accessible UI with keyboard navigation

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/basketball-app.git
   cd basketball-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

4. Add your API key to `.env`:
   ```
   VITE_API_KEY=your_api_key_here
   ```

   Get a free API key at [balldontlie.io](https://www.balldontlie.io).

### Running Locally

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Building for Production

```bash
npm run build
```

Build output will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Deployment

This app is configured for GitHub Pages deployment. (Deployment instructions to be added once configured.)

## License

MIT
