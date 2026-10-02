import React, { useState, useEffect, useCallback } from 'react';
import { PledgePage } from './pages/PledgePage';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { isAdminAuthenticated } from './services/adminService';

/**
 * App: Top-level router and orchestrator.
 * 
 * Routes:
 * - / (or /pledge) -> Public Cyber Safety Pledge Experience
 * - /admin/login   -> Secure Admin Authentication Gateway
 * - /admin         -> Protected Read-Only Admin Dashboard (auto-guarded)
 */
export function App() {
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  // Listen to browser Back / Forward buttons
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Safe client-side navigation handler
  const navigate = useCallback((path) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  // Route Dispatcher
  if (currentPath === '/admin/login') {
    return (
      <AdminLoginPage
        onLoginSuccess={() => navigate('/admin')}
        onNavigate={navigate}
      />
    );
  }

  if (currentPath.startsWith('/admin')) {
    // Backend/Session Authorization Guard
    if (!isAdminAuthenticated()) {
      return (
        <AdminLoginPage
          onLoginSuccess={() => navigate('/admin')}
          onNavigate={navigate}
        />
      );
    }

    return (
      <AdminDashboardPage
        onNavigate={navigate}
      />
    );
  }

  // Default: Public Pledge Page Experience
  return <PledgePage onNavigate={navigate} />;
}

export default App;
