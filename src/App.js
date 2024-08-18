import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreateQuiz from './components/CreateQuiz';
import PlayQuiz from './components/PlayQuiz';
import Profile from './components/Profile';
import Layout from './components/Layout';
import AdminDashboard from './components/AdminDashboard';

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