import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetails from "./pages/ProjectDetails";
import Tasks from "./pages/Tasks";
import Profiles from "./pages/Profiles";
import TeamMembers from "./pages/TeamMembers";
import KanbanBoard from "./pages/KanbanBoard";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/tasks"
        element={
          <ProtectedRoute>
            <Tasks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/team-members"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <TeamMembers />
          </ProtectedRoute>
        }
      />
<Route
  path="/kanban"
  element={
    <ProtectedRoute>
      <KanbanBoard />
    </ProtectedRoute>
  }
/>
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profiles />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;