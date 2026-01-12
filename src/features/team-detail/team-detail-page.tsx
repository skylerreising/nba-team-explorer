import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useTeams, usePlayersByTeam, useRecentGames, useUpcomingGames } from "../../api/queries";
import type { Game } from "../../types/api.types";

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

const RateLimitWarning = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.secondary};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 0.9rem;
  text-align: center;
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const GamesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const GameCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GameDate = styled.div`
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GameMatchup = styled.div`
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const GameScore = styled.div<{ $isWin?: boolean }>`
  font-size: 1.1rem;
  font-weight: 700;
  color: ${({ theme, $isWin }) =>
    $isWin === undefined
      ? theme.colors.text
      : $isWin
        ? theme.colors.primary
        : theme.colors.secondary};
`;

const GameStatus = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function TeamDetailPage() {
  const { teamId } = useParams<{ teamId: string }>();
  const teamIdNum = Number(teamId);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);

  const { data: teamsData } = useTeams();
  const {
    data: playersData,
    isLoading: playersLoading,
    error: playersError,
  } = usePlayersByTeam(teamIdNum);
  const {
    data: recentGamesData,
    isLoading: recentLoading,
    error: recentError,
  } = useRecentGames(teamIdNum);
  const {
    data: upcomingGamesData,
    isLoading: upcomingLoading,
    error: upcomingError,
  } = useUpcomingGames(teamIdNum);

  const isAnyLoading = playersLoading || recentLoading || upcomingLoading;

  useEffect(() => {
    if (!isAnyLoading) {
      setShowRateLimitWarning(false);
      return;
    }

    const timer = setTimeout(() => {
      if (isAnyLoading) {
        setShowRateLimitWarning(true);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [isAnyLoading]);

  const team = teamsData?.data.find((t) => t.id === teamIdNum);

  const formatGameDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  const getOpponent = (game: Game) => {
    const isHome = game.home_team.id === teamIdNum;
    const opponent = isHome ? game.visitor_team : game.home_team;
    const prefix = isHome ? "vs" : "@";
    return `${prefix} ${opponent.full_name}`;
  };

  const getGameResult = (game: Game) => {
    const isHome = game.home_team.id === teamIdNum;
    const teamScore = isHome ? game.home_team_score : game.visitor_team_score;
    const opponentScore = isHome ? game.visitor_team_score : game.home_team_score;
    const isWin = teamScore > opponentScore;
    return {
      display: `${isWin ? "W" : "L"} ${teamScore}-${opponentScore}`,
      isWin,
    };
  };
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

      {showRateLimitWarning && (
        <RateLimitWarning>
          Loading is taking longer than usual. The API may be rate-limited.
          Please wait a moment and the data will load shortly.
        </RateLimitWarning>
      )}

      <Section>
        <SectionTitle>Recent Results</SectionTitle>
        {recentLoading && <Message>Loading recent games...</Message>}
        {recentError && (
          <Message>Error loading recent games: {recentError.message}</Message>
        )}
        {!recentLoading && !recentError && (recentGamesData?.data?.length ?? 0) === 0 && (
          <Message>No recent games found</Message>
        )}
        {!recentLoading && !recentError && (recentGamesData?.data?.length ?? 0) > 0 && (
          <GamesGrid>
            {recentGamesData?.data.map((game) => {
              const result = getGameResult(game);
              return (
                <GameCard key={game.id}>
                  <GameDate>{formatGameDate(game.date)}</GameDate>
                  <GameMatchup>{getOpponent(game)}</GameMatchup>
                  <GameScore $isWin={result.isWin}>{result.display}</GameScore>
                </GameCard>
              );
            })}
          </GamesGrid>
        )}
      </Section>

      <Section>
        <SectionTitle>Upcoming Schedule</SectionTitle>
        {upcomingLoading && <Message>Loading upcoming games...</Message>}
        {upcomingError && (
          <Message>Error loading upcoming games: {upcomingError.message}</Message>
        )}
        {!upcomingLoading && !upcomingError && (upcomingGamesData?.data?.length ?? 0) === 0 && (
          <Message>No upcoming games scheduled</Message>
        )}
        {!upcomingLoading && !upcomingError && (upcomingGamesData?.data?.length ?? 0) > 0 && (
          <GamesGrid>
            {upcomingGamesData?.data.map((game) => (
              <GameCard key={game.id}>
                <GameDate>{formatGameDate(game.date)}</GameDate>
                <GameMatchup>{getOpponent(game)}</GameMatchup>
                <GameStatus>{game.status}</GameStatus>
              </GameCard>
            ))}
          </GamesGrid>
        )}
      </Section>

      <Section>
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
      </Section>
    </Container>
  );
}
