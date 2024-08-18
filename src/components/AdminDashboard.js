import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem('role');

    if (role !== 'admin') {
      navigate('/login');
      return;
    }

    const fetchAdminData = async () => {
      try {
        const response = await fetch('http://localhost:5000/admin-data', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });
    
        if (!response.ok) {
          throw new Error(`Server error: ${response.statusText}`);
        }
    
        const data = await response.json();
        console.log('Admin data:', JSON.stringify(data, null, 2)); // Überprüfe die empfangenen Daten
    
        setUsers(Array.isArray(data.users) ? data.users : []);
        setCategories(Array.isArray(data.categories) ? data.categories.map(cat => ({
          ...cat,
          questions: Array.isArray(cat.questions) ? cat.questions : [],
        })) : []);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Fehler beim Abrufen der Admin-Daten:', error);
        setIsLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleEditUser = (user) => {
    // Hier können Sie die Logik zum Bearbeiten eines Benutzers hinzufügen
    console.log('Benutzer bearbeiten:', user);
  };

  const handleDeleteUser = async (email) => {
    const confirmation = window.confirm(`Möchten Sie den Benutzer mit der E-Mail ${email} wirklich löschen?`);
    if (!confirmation) return;
  
    try {
      const response = await fetch('http://localhost:5000/delete-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ email }),
      });
  
      if (response.ok) {
        setUsers(users.filter(user => user.email !== email));
      } else {
        console.error('Fehler beim Löschen des Benutzers');
      }
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers:', error);
    }
  };

  const handleEditCategory = (category) => {
    // Hier können Sie die Logik zum Bearbeiten einer Kategorie hinzufügen
    console.log('Kategorie bearbeiten:', category);
  };

  const handleDeleteCategory = async (name) => {
    try {
      const response = await fetch('http://localhost:5000/delete-category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        setCategories(categories.filter(category => category.name !== name));
      } else {
        console.error('Fehler beim Löschen der Kategorie');
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Kategorie:', error);
    }
  };

  if (isLoading) {
    return <p>Admin-Daten werden geladen...</p>;
  }

  if (!users || !categories) {
    return <p>Fehler beim Laden der Admin-Daten.</p>;
  }

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>

      <div className="admin-section">
        <h3>Benutzerverwaltung</h3>
        {users.length > 0 ? (
          <ul className="admin-list">
            {users.map((user, index) => (
              <li key={index} className="admin-list-item">
                <div className="admin-list-info">
                  <p><strong>Name:</strong> {user.name}</p>
                  <p><strong>E-Mail:</strong> {user.email}</p>
                  <p><strong>Rolle:</strong> {user.role}</p>
                </div>
                <div className="admin-list-actions">
                  <button onClick={() => handleEditUser(user)}>Bearbeiten</button>
                  <button onClick={() => handleDeleteUser(user.email)}>Löschen</button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>Keine Benutzer verfügbar</p>
        )}
      </div>

      <div className="admin-section">
  <h3>Kategorienverwaltung</h3>
  {categories.length > 0 ? (
    <ul className="admin-list">
      {categories.map((category, index) => (
        <li key={index} className="admin-list-item">
          <div className="admin-list-info">
            <h4>Kategorie: {category.name}</h4>
            <p><strong>Erstellt von:</strong> {category.createdBy}</p>
            <p><strong>Erstellt am:</strong> {new Date(category.createdAt).toLocaleString()}</p>
            <p><strong>Anzahl Fragen:</strong> {category.questions.length}</p>
            <ul className="questions-list">
              {category.questions && category.questions.length > 0 ? (
                category.questions.map((question, qIndex) => (
                  <li key={qIndex} className="question-item">
                    <p><strong>Frage:</strong> {question.questionText}</p>
                    <p><strong>Erstellt von:</strong> {question.createdBy} am {new Date(question.createdAt).toLocaleString()}</p>
                    <p><strong>Zuletzt bearbeitet von:</strong> {question.updatedBy || 'unknown'} am {new Date(question.updatedAt).toLocaleString()}</p>
                  </li>
                ))
              ) : (
                <p>Keine Fragen in dieser Kategorie</p>
              )}
            </ul>
          </div>
          <div className="admin-list-actions">
            <button onClick={() => handleEditCategory(category)}>Bearbeiten</button>
            <button onClick={() => handleDeleteCategory(category.name)}>Löschen</button>
          </div>
        </li>
      ))}
    </ul>
  ) : (
    <p>Keine Kategorien verfügbar</p>
  )}
</div>
    </div>
  );
};

export default AdminDashboard;