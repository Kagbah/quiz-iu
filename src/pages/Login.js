import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  // Login-Funktion
  const handleLogin = async (event) => {
    event.preventDefault(); // Verhindert das Standardformular-Verhalten

    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Serverantwort:', data); // Füge dies hinzu, um die Antwort zu überprüfen

      if (data.token) {
        console.log('Login erfolgreich, Token erhalten:', data.token);
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('name', data.name);
        localStorage.setItem('role', data.role);
        localStorage.setItem('email', data.email);
        navigate('/dashboard');
      } else {
        console.error('Anmeldung fehlgeschlagen:', data.error || 'Unbekannter Fehler');
        alert('Anmeldung fehlgeschlagen: ' + (data.error || 'Unbekannter Fehler'));
      }
    } catch (error) {
      console.error('Fehler bei der Anmeldung:', error);
      alert('Fehler bei der Anmeldung. Bitte versuchen Sie es später erneut.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Anmelden</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <label>E-Mail-Adresse</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label>Passwort</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="auth-button">Anmelden</button>
        </form>
        <p>
          Noch kein Konto? <button onClick={() => navigate('/register')} className="link-button">Registrieren</button>
        </p>
      </div>
    </div>
  );
};

export default Login;