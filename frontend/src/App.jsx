import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from "./Users/Login.jsx";
import Register from "./Users/Register.jsx";
import Profile from "./Users/Profile.jsx";
import Layout from "./components/Layout.jsx";
import './Users/Auth.css';

// Protected Route Component
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return user ? children : <Navigate to="/login" />;
}

// Public Route (redirect if already logged in)
function PublicRoute({ children, redirectPath = "/dashboard" }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  return user ? <Navigate to={redirectPath} /> : children;
}

import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<PublicRoute redirectPath="/dashboard"><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute redirectPath="/profile"><Register /></PublicRoute>} />

          {/* Protected Routes directly under Layout */}
          <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route path="/dashboard" element={<div>Dashboard - Bienvenue!</div>} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}


export default App;

