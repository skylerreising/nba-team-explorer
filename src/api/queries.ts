import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "./client";
import type { ApiResponse, Team, Standing, Player, Game } from "../types/api.types";

// Cache times from project plan
const STALE_TIME = {
  teams: 1000 * 60 * 60 * 24 * 7, // 7 days
  standings: 1000 * 60 * 60 * 4, // 4 hours
  players: 1000 * 60 * 60 * 4, // 4 hours
  games: 1000 * 60 * 60, // 1 hour
};

function formatDate(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function useTeams() {
  return useQuery({
    queryKey: ["teams"],
    queryFn: () => fetchApi<ApiResponse<Team[]>>("/teams"),
    staleTime: STALE_TIME.teams,
  });
}

export function useStandings(season: number) {
  return useQuery({
    queryKey: ["standings", season],
    queryFn: () => fetchApi<ApiResponse<Standing[]>>(`/standings?season=${season}`),
    staleTime: STALE_TIME.standings,
  });
}

export function usePlayersByTeam(teamId: number) {
  return useQuery({
    queryKey: ["players", teamId],
    queryFn: () => fetchApi<ApiResponse<Player[]>>(`/players?team_ids[]=${teamId}`),
    staleTime: STALE_TIME.players,
    enabled: !!teamId,
  });
}

export function useRecentGames(teamId: number, limit: number = 5) {
  const today = new Date();
  const endDate = formatDate(today);
  // Look back 60 days to find recent completed games
  const startDate = formatDate(new Date(today.getTime() - 60 * 24 * 60 * 60 * 1000));

  return useQuery({
    queryKey: ["games", "recent", teamId, limit],
    queryFn: async () => {
      const response = await fetchApi<ApiResponse<Game[]>>(
        `/games?team_ids[]=${teamId}&start_date=${startDate}&end_date=${endDate}&per_page=100`
      );
      // Filter to only completed games and get the most recent ones
      const completedGames = response.data
        .filter((game) => game.status === "Final")
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit);
      return { ...response, data: completedGames };
    },
    staleTime: STALE_TIME.games,
    enabled: !!teamId,
  });
}

export function useUpcomingGames(teamId: number, limit: number = 5) {
  const today = new Date();
  const startDate = formatDate(today);
  // Look ahead 60 days for upcoming games
  const endDate = formatDate(new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000));

  return useQuery({
    queryKey: ["games", "upcoming", teamId, limit],
    queryFn: async () => {
      const response = await fetchApi<ApiResponse<Game[]>>(
        `/games?team_ids[]=${teamId}&start_date=${startDate}&end_date=${endDate}&per_page=100`
      );
      // Filter to only scheduled games and get the soonest ones
      const upcomingGames = response.data
        .filter((game) => game.status !== "Final")
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, limit);
      return { ...response, data: upcomingGames };
    },
    staleTime: STALE_TIME.games,
    enabled: !!teamId,
  });
}
