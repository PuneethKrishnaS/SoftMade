import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import CreateStudent from "./pages/CreateStudent";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";
import Tickets from "./pages/Tickets";
import Payments from "./pages/Payments";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  return <>{children}</>;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="students/create" element={<CreateStudent />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projects/create" element={<CreateProject />} />
          <Route path="projects/:id" element={<ProjectDetails />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="payments" element={<Payments />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
        
        {/* Fallback */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
