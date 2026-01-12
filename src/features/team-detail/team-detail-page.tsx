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
  margin-bottom: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
`;

const RosterList = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PlayerCard = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  align-items: center;
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

const PlayerPosition = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
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
  const players = playersData?.data ?? [];

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
        {playersLoading && <Message>Loading roster...</Message>}
        {playersError && (
          <Message>Error loading roster: {playersError.message}</Message>
        )}
        {!playersLoading && !playersError && (
          <RosterList>
            {players.map((player) => (
              <PlayerCard key={player.id}>
                <JerseyNumber>#{player.jersey_number || "—"}</JerseyNumber>
                <PlayerInfo>
                  <PlayerName>
                    {player.first_name} {player.last_name}
                  </PlayerName>
                  <PlayerPosition>{player.position || "N/A"}</PlayerPosition>
                </PlayerInfo>
              </PlayerCard>
            ))}
          </RosterList>
        )}
      </section>
    </Container>
  );
}
