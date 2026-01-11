import { useParams, Link } from "react-router-dom";
import { useTeams, usePlayersByTeam } from "../../api/queries";

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const teamIdNum = Number(teamId);

  const { data: teamsData } = useTeams();
  const { data: playersData, isLoading: playersLoading, error: playersError } = usePlayersByTeam(teamIdNum);

  const team = teamsData?.data.find((t) => t.id === teamIdNum);
  const players = playersData?.data ?? [];

  if (!team) {
    return <div>Team not found</div>;
  }

  return (
    <main>
      <Link to="/">← Back to teams</Link>
      <h1>{team.full_name}</h1>
      <p>
        {team.conference} Conference • {team.division} Division
      </p>

      <h2>Roster</h2>
      {playersLoading && <div>Loading roster...</div>}
      {playersError && <div>Error loading roster: {playersError.message}</div>}
      {!playersLoading && !playersError && (
        <ul>
          {players.map((player) => (
            <li key={player.id}>
              #{player.jersey_number} {player.first_name} {player.last_name} - {player.position}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
