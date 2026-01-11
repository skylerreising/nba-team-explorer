import { useQuery } from "@tanstack/react-query";
import { fetchApi } from "./client";
import type { ApiResponse, Team, Standing, Player } from "../types/api.types";

// Cache times from project plan
const STALE_TIME = {
  teams: 1000 * 60 * 60 * 24 * 7, // 7 days
  standings: 1000 * 60 * 60 * 4, // 4 hours
  players: 1000 * 60 * 60 * 4, // 4 hours
};

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
