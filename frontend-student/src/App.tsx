import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./layouts/DashboardLayout";
import Overview from "./pages/dashboard/Overview";
import Tracking from "./pages/dashboard/Tracking";
import Downloads from "./pages/dashboard/Downloads";
import Tickets from "./pages/dashboard/Tickets";
import Payments from "./pages/dashboard/Payments";
import Notifications from "./pages/dashboard/Notifications";
import Profile from "./pages/dashboard/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        {/* Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Overview />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="downloads" element={<Downloads />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="payments" element={<Payments />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
