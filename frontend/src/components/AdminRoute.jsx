import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * AdminRoute – wraps a route and only allows access if the
 * logged-in user has role === 'admin'. Everyone else is
 * redirected to the student dashboard.
 */
export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0f1117', color: '#94a3b8',
        fontFamily: 'Inter, sans-serif', fontSize: '0.9rem'
      }}>
        <i className="fas fa-spinner fa-spin" style={{ marginRight: 10, color: '#6366f1' }}></i>
        Vérification des droits d'accès...
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

  return children;
}
