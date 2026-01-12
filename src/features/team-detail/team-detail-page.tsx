import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useTeams, usePlayersByTeam } from "../../api/queries";

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const BackLink = styled(Link)`
  display: inline-block;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const TeamHeader = styled.header`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TeamName = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const TeamInfo = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1.1rem;
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const SectionNote = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.85rem;
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RosterList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const PlayerCard = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
`;

const JerseyNumber = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  min-width: 50px;
`;

const PlayerInfo = styled.div`
  flex: 1;
`;

const PlayerName = styled.span`
  font-weight: 500;
  display: block;
`;

const PlayerDetails = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
`;

const Message = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const teamIdNum = Number(teamId);

  const { data: teamsData } = useTeams();
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayersByTeam(teamIdNum);

  const team = teamsData?.data.find((t) => t.id === teamIdNum);
  const players = [...(playersData?.data ?? [])].sort((a, b) => {
    const numA = parseInt(a.jersey_number) || 999;
    const numB = parseInt(b.jersey_number) || 999;
    return numA - numB;
  });

  if (!team) {
    return (
      <Container>
        <Message>Team not found</Message>
      </Container>
    );
  }

  return (
    <Container>
      <BackLink to="/">← Back to teams</BackLink>
      <TeamHeader>
        <TeamName>{team.full_name}</TeamName>
        <TeamInfo>
          {team.conference} Conference • {team.division} Division
        </TeamInfo>
      </TeamHeader>

      <section>
        <SectionTitle>Roster</SectionTitle>
        <SectionNote>
          Players historically associated with this team, not necessarily the active roster.
          This list is not exhaustive and may not include all historically significant players.
        </SectionNote>
        {playersLoading && <Message>Loading roster...</Message>}
        {playersError && (
          <Message>Error loading roster: {playersError.message}</Message>
        )}
        {!playersLoading && !playersError && (
          <RosterList>
            {players.map((player) => (
              <PlayerCard key={player.id}>
                <JerseyNumber># {player.jersey_number || "—"}</JerseyNumber>
                <PlayerInfo>
                  <PlayerName>
                    {player.first_name} {player.last_name}
                  </PlayerName>
                  <PlayerDetails>
                    <div>Position: {player.position || "N/A"}</div>
                    {player.height && <div>Height: {player.height}</div>}
                    {player.weight && <div>Weight: {player.weight} lbs</div>}
                    {player.college && <div>College: {player.college}</div>}
                    {player.country && <div>Country: {player.country}</div>}
                  </PlayerDetails>
                </PlayerInfo>
              </PlayerCard>
            ))}
          </RosterList>
        )}
      </section>
    </Container>
  );
}
