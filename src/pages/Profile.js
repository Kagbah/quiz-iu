import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    currentPassword: '', // Neu: aktuelles Passwort
    newPassword: '', // Neu: neues Passwort
    confirmNewPassword: '', // Neu: Bestätigung des neuen Passworts
  });

  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        const data = await response.json();
        if (data) {
          setProfileData((prevState) => ({
            ...prevState,
            name: data.name,
            email: data.email,
          }));
        }
      } catch (error) {
        console.error('Fehler beim Abrufen der Profildaten:', error);
      }
    };

    fetchProfileData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validierung: Überprüfen, ob das neue Passwort korrekt bestätigt wurde
    if (profileData.newPassword !== profileData.confirmNewPassword) {
      setMessage('Die neuen Passwörter stimmen nicht überein.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(profileData),
      });

      const data = await response.json();
      if (data.error) {
        setMessage(`Fehler: ${data.error}`);
      } else {
        setMessage('Profil erfolgreich aktualisiert.');
        // Felder zurücksetzen
        setProfileData({
          ...profileData,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
      }
    } catch (error) {
      setMessage('Fehler beim Aktualisieren des Profils.');
      console.error('Fehler beim Aktualisieren des Profils:', error);
    }
  };

  return (
    <div className="profile-container">
      <h2>Profil verwalten</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="profile-form">
        <div className="input-group">
          <label>E-Mail</label>
          <input
            type="email"
            name="email"
            value={profileData.email}
            onChange={handleInputChange}
          />
        </div>
        <div className="input-group">
          <label>Aktuelles Passwort</label>
          <input
            type="password"
            name="currentPassword"
            value={profileData.currentPassword}
            onChange={handleInputChange}
            placeholder="Aktuelles Passwort eingeben"
          />
        </div>
        <div className="input-group">
          <label>Neues Passwort</label>
          <input
            type="password"
            name="newPassword"
            value={profileData.newPassword}
            onChange={handleInputChange}
            placeholder="Neues Passwort eingeben"
          />
        </div>
        <div className="input-group">
          <label>Neues Passwort bestätigen</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={profileData.confirmNewPassword}
            onChange={handleInputChange}
            placeholder="Neues Passwort bestätigen"
          />
        </div>
        <button type="submit" className="update-profile-button">
          Profil aktualisieren
        </button>
      </form>
    </div>
  );
};

export default Profile;