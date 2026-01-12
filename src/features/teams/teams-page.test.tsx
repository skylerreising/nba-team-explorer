import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "../../test/test-utils";
import { TeamsPage } from "./teams-page";
import * as queries from "../../api/queries";

// Mock the useTeams hook
vi.mock("../../api/queries", () => ({
  useTeams: vi.fn(),
}));

const mockUseTeams = queries.useTeams as ReturnType<typeof vi.fn>;

const mockTeams = [
  {
    id: 1,
    conference: "West",
    division: "Pacific",
    city: "Los Angeles",
    name: "Lakers",
    full_name: "Los Angeles Lakers",
    abbreviation: "LAL",
  },
  {
    id: 2,
    conference: "East",
    division: "Atlantic",
    city: "Boston",
    name: "Celtics",
    full_name: "Boston Celtics",
    abbreviation: "BOS",
  },
];

describe("TeamsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("displays loading state", () => {
    mockUseTeams.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });

    render(<TeamsPage />);

    expect(screen.getByText("Loading teams...")).toBeInTheDocument();
  });

  it("displays error state", () => {
    mockUseTeams.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: "Failed to fetch" },
    });

    render(<TeamsPage />);

    expect(
      screen.getByText("Error loading teams: Failed to fetch")
    ).toBeInTheDocument();
  });

  it("displays teams when data is loaded", () => {
    mockUseTeams.mockReturnValue({
      data: { data: mockTeams },
      isLoading: false,
      error: null,
    });

    render(<TeamsPage />);

    expect(screen.getByText("NBA Teams")).toBeInTheDocument();
    expect(screen.getByText("Name: Los Angeles Lakers")).toBeInTheDocument();
    expect(screen.getByText("City: Los Angeles")).toBeInTheDocument();
    expect(screen.getByText("Name: Boston Celtics")).toBeInTheDocument();
    expect(screen.getByText("City: Boston")).toBeInTheDocument();
  });

  it("renders links to team detail pages", () => {
    mockUseTeams.mockReturnValue({
      data: { data: mockTeams },
      isLoading: false,
      error: null,
    });

    render(<TeamsPage />);

    const lakersLink = screen.getByRole("link", {
      name: /Los Angeles Lakers/,
    });
    const celticsLink = screen.getByRole("link", { name: /Boston Celtics/ });

    expect(lakersLink).toHaveAttribute("href", "/teams/1");
    expect(celticsLink).toHaveAttribute("href", "/teams/2");
  });

  it("renders header links to API docs and portfolio", () => {
    mockUseTeams.mockReturnValue({
      data: { data: mockTeams },
      isLoading: false,
      error: null,
    });

    render(<TeamsPage />);

    const apiDocsLink = screen.getByRole("link", { name: "View API Docs" });
    const portfolioLink = screen.getByRole("link", { name: "My Portfolio" });

    expect(apiDocsLink).toHaveAttribute("href", "https://docs.balldontlie.io");
    expect(apiDocsLink).toHaveAttribute("target", "_blank");
    expect(portfolioLink).toHaveAttribute(
      "href",
      "https://skylerreising.github.io/skyler-reising/"
    );
    expect(portfolioLink).toHaveAttribute("target", "_blank");
  });

  it("handles empty teams array", () => {
    mockUseTeams.mockReturnValue({
      data: { data: [] },
      isLoading: false,
      error: null,
    });

    render(<TeamsPage />);

    expect(screen.getByText("NBA Teams")).toBeInTheDocument();
    expect(
      screen.queryByText(/Name: Los Angeles Lakers/)
    ).not.toBeInTheDocument();
  });
});
