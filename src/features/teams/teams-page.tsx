import { Link } from "react-router-dom";
import styled from "styled-components";
import { useTeams } from "../../api/queries";

const Container = styled.main`
  max-width: ${({ theme }) => theme.maxWidth};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const HeaderLinks = styled.nav`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  font-size: 0.9rem;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const TeamsGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  list-style: none;
  padding: 0;
  margin: 0;
`;

const TeamCard = styled.li`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.md};
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  a {
    display: block;
  }
`;

const TeamName = styled.span`
  display: block;
  font-weight: 500;
  font-size: 1.1rem;
`;

const TeamCity = styled.span`
  display: block;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const Message = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

export function TeamsPage() {
  const { data, isLoading, error } = useTeams();

  if (isLoading) {
    return (
      <Container>
        <Message>Loading teams...</Message>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Message>Error loading teams: {error.message}</Message>
      </Container>
    );
  }

  const teams = data?.data ?? [];

  return (
    <Container>
      <HeaderLinks>
        <a
          href="https://docs.balldontlie.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          View API Docs
        </a>
        <span>|</span>
        <a
          href="https://skylerreising.github.io/skyler-reising/"
          target="_blank"
          rel="noopener noreferrer"
        >
          My Portfolio
        </a>
      </HeaderLinks>
      <Title>NBA Teams</Title>
      <TeamsGrid>
        {teams.map((team) => (
          <TeamCard key={team.id}>
            <Link to={`/teams/${team.id}`}>
              <TeamName>Name: {team.full_name}</TeamName>
              <TeamCity>City: {team.city}</TeamCity>
            </Link>
          </TeamCard>
        ))}
      </TeamsGrid>
    </Container>
  );
}
