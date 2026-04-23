import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import RequestsPage from './pages/RequestsPage';
import CreateRequestPage from './pages/CreateRequestPage';
import RequestDetailsPage from './pages/RequestDetailsPage';
import VolunteerProfileSetupPage from './pages/VolunteerProfileSetupPage';
import OrganizationsPage from './pages/OrganizationsPage';
import ProfilePage from './pages/ProfilePage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/volunteer-profile-setup" element={
          <ProtectedRoute>
            <VolunteerProfileSetupPage />
          </ProtectedRoute>
        } />
        <Route path="/requests" element={
          <ProtectedRoute>
            <RequestsPage />
          </ProtectedRoute>
        } />
        <Route path="/requests/create" element={
          <ProtectedRoute>
            <CreateRequestPage />
          </ProtectedRoute>
        } />
        <Route path="/requests/:requestId" element={
          <ProtectedRoute>
            <RequestDetailsPage />
          </ProtectedRoute>
        } />
        <Route path="/organizations" element={
          <ProtectedRoute>
            <OrganizationsPage />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
