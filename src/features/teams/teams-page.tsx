import { Link } from "react-router-dom";
import { useTeams } from "../../api/queries";

export function TeamsPage() {
  const { data, isLoading, error } = useTeams();

  if (isLoading) {
    return <div>Loading teams...</div>;
  }

  if (error) {
    return <div>Error loading teams: {error.message}</div>;
  }

  const teams = data?.data ?? [];

  return (
    <main>
      <h1>NBA Teams</h1>
      <ul>
        {teams.map((team) => (
          <li key={team.id}>
            <Link to={`/teams/${team.id}`}>
              {team.full_name}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
