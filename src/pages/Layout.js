import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import './Layout.css';

const Layout = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');

  console.log('Fetched role in Layout:', role); // Überprüfen Sie, ob die Rolle korrekt abgerufen wird

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('role'); // Entfernen Sie auch die Rolle beim Logout
    navigate('/login');
  };

  return (
    <div className="layout-container">
      <nav className="layout-nav">
        <h2>Navigation</h2>
        <ul>
          <li onClick={() => navigate('/dashboard')}>Dashboard</li>
          <li onClick={() => navigate('/create-quiz')}>Quiz erstellen</li>
          <li onClick={() => navigate('/play-quiz')}>Quiz Manager</li>
          <li onClick={() => navigate('/profile')}>Profil verwalten</li>
          {role === 'admin' && (
            <li onClick={() => navigate('/admin-dashboard')}>Admin-Dashboard</li>
          )}
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </nav>
      <main className="layout-content">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;