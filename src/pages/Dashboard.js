import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('role');

    if (!token) {
      navigate('/login');
    } else {
      setRole(userRole);
      fetchCategories();
    }
  }, [navigate]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/quiz-data');
      const data = await response.json();
      if (data.categories) {
        setCategories(data.categories.slice(0, 5));
      }
    } catch (error) {
      console.error('Fehler beim Abrufen der Kategorien:', error);
    }
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/play-quiz?category=${categoryName}`);
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h3>Übersicht</h3>
        <div className="overview-section">
          <p>Aktivitäten und Fortschritte anzeigen</p>
          <div className="progress">
            <div className="progress-bar" style={{ width: '70%' }}>70% Fortschritt</div>
          </div>
        </div>

        <div className="dashboard-sections">
          <div className="section">
            <h4>Beliebte Fragenkategorien</h4>
            {categories.length > 0 ? (
              <div className="category-buttons">
                {categories.map((category, index) => (
                  <button
                    key={index}
                    className="category-button"
                    onClick={() => handleCategoryClick(category.name)}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            ) : (
              <p>Keine Kategorien verfügbar</p>
            )}
            {role === 'admin' && (
              <button className="more-categories-button" onClick={() => navigate('/create-quiz')}>
                Weitere Kategorien anzeigen
              </button>
            )}
          </div>

          {role === 'admin' && (
            <div className="section">
              <h4>Admin-Bereich</h4>
              <p>Verwalten Sie Benutzer und deren Inhalte.</p>
              <button onClick={() => navigate('/admin-dashboard')}>Admin-Dashboard</button>
            </div>
          )}

          <div className="section">
            <h4>Quiz spielen</h4>
            <p>Treten Sie gegen andere Spieler an oder spielen Sie alleine.</p>
            <button onClick={() => navigate('/play-quiz')}>Quiz spielen</button>
          </div>

          <div className="section">
            <h4>Profil verwalten</h4>
            <p>Verwalten Sie Ihre persönlichen Daten und Einstellungen.</p>
            <button onClick={() => navigate('/profile')}>Profil verwalten</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;