import { Routes, Route } from "react-router-dom";
import { TeamsPage } from "./features/teams/teams-page";
import { TeamDetailPage } from "./features/team-detail/team-detail-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<TeamsPage />} />
      <Route path="/teams/:teamId" element={<TeamDetailPage />} />
    </Routes>
  );
}

export default App;
