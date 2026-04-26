import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from "./Users/Login.jsx";
import Register from "./Users/Register.jsx";
import Profile from "./Users/Profile.jsx";
import ForgotPasswordPage from "./Users/ForgotPasswordPage.jsx";
import ResetPasswordPage from "./Users/ResetPasswordPage.jsx";
import Layout from "./components/Layout.jsx";
import Certifications from "./pages/Certifications.jsx";
import Resources from "./pages/Resources.jsx";
import CertificateView from "./pages/CertificateView.jsx";
import Quiz from "./pages/Quiz.jsx";
import Results from "./pages/Results.jsx";
import Settings from "./pages/Settings.jsx";
import Learning from "./pages/Learning.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Home from "./pages/Home.jsx";
import CoursePlayer from "./pages/CoursePlayer.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import Notifications from "./pages/Notifications.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AdminRoute from "./components/AdminRoute.jsx";
import './Users/Auth.css';

import { BrowserRouter as Router } from 'react-router-dom';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif',color:'#64748b'}}>Chargement...</div>;
  return user ? children : <Navigate to="/login" />;
}

// Public Route (redirect if already logged in)
function PublicRoute({ children, redirectPath = "/dashboard" }) {
  const { user, loading } = useAuth();
  if (loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'#f8fafc',fontFamily:'Inter,sans-serif',color:'#64748b'}}>Chargement...</div>;
  return user ? <Navigate to={redirectPath} /> : children;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Landing page — public */}
          <Route path="/" element={<Home />} />

          {/* Auth routes — redirect to dashboard if already logged in */}
          <Route path="/login"    element={<PublicRoute redirectPath="/dashboard"><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute redirectPath="/profile"><Register /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute redirectPath="/dashboard"><ForgotPasswordPage /></PublicRoute>} />
          <Route path="/reset-password" element={<PublicRoute redirectPath="/dashboard"><ResetPasswordPage /></PublicRoute>} />

          {/* Student routes — inside Layout sidebar */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard"        element={<Dashboard />} />
            <Route path="/learning"         element={<Learning />} />
            <Route path="/profile"          element={<Profile />} />
            <Route path="/certifications"   element={<Certifications />} />
            <Route path="/resources"        element={<Resources />} />
            <Route path="/certificate/:id"  element={<CertificateView />} />
            <Route path="/quiz"             element={<Quiz />} />
            <Route path="/results"          element={<Results />} />
            <Route path="/settings"         element={<Settings />} />
            <Route path="/leaderboard"      element={<Leaderboard />} />
            <Route path="/notifications"    element={<Notifications />} />
          </Route>

          {/* Course player — full screen, no sidebar */}
          <Route path="/course/:id" element={<ProtectedRoute><CoursePlayer /></ProtectedRoute>} />

          {/* Admin dashboard — full screen, role-gated */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
