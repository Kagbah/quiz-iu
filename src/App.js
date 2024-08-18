import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CreateQuiz from './pages/CreateQuiz';
import PlayQuiz from './pages/PlayQuiz';
import Profile from './pages/Profile';
import Layout from './pages/Layout';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const isAuthenticated = !!localStorage.getItem('authToken');
  console.log('Is authenticated:', isAuthenticated); // Debugging

  return (
    <Router>
      <Routes>
        <Route path="/" element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/play-quiz" element={<PlayQuiz />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Route>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />} />
      </Routes>
    </Router>
  );
}

export default App; // Stelle sicher, dass dies vorhanden ist