// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  meta?: {
    per_page?: number;
    next_cursor?: number;
  };
}

// Team
export interface Team {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

// Standing
export interface Standing {
  team: Team;
  conference_record: string;
  conference_rank: number;
  division_record: string;
  division_rank: number;
  wins: number;
  losses: number;
  home_record: string;
  road_record: string;
  season: number;
}

// Player
export interface Player {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: Team;
}

// Game
export interface Game {
  id: number;
  date: string;
  season: number;
  status: string;
  period: number;
  time: string;
  postseason: boolean;
  home_team_score: number;
  visitor_team_score: number;
  home_team: Team;
  visitor_team: Team;
}
