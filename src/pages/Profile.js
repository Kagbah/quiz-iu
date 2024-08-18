import React, { useState, useEffect } from 'react';
import './Profile.css';

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: '', // Nickname
    email: '',
    currentPassword: '', // Aktuelles Passwort
    newPassword: '', // Neues Passwort
    confirmNewPassword: '', // Bestätigung des neuen Passworts
    profilePic: '',
  });

  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch('http://localhost:5000/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (data) {
          setProfileData({
            name: data.name || '', // Standardwert sicherstellen
            email: data.email || '', // Standardwert sicherstellen
            currentPassword: '', // Passwortfelder bleiben leer
            newPassword: '',
            confirmNewPassword: ''
          });
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

  const handleNicknameChange = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({ name: profileData.name }), // Nur den Nickname senden
      });

      const data = await response.json();
      if (data.error) {
        setMessage(`Fehler: ${data}`);
      } else {
        setMessage('Nickname erfolgreich aktualisiert.');
      }
    } catch (error) {
      setMessage('Fehler beim Aktualisieren des Nicknames.');
      console.error('Fehler beim Aktualisieren des Nicknames:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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

    // Definieren Sie die handleFileChange Funktion
    const handleFileChange = (e) => {
      setSelectedFile(e.target.files[0]);
    };

    const handleProfilePicUpload = async () => {
      if (!selectedFile) {
        setMessage('Bitte wählen Sie ein Bild aus.');
        return;
      }
  
      const formData = new FormData();
      formData.append('profilePic', selectedFile);
  
      try {
        const response = await fetch('http://localhost:5000/upload-profile-pic', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
          },
          body: formData,
        });
  
        const data = await response.json();
        if (data.filePath) {
          setProfileData((prevState) => ({
            ...prevState,
            profilePic: data.filePath,
          }));
          setMessage('Profilbild erfolgreich hochgeladen.');
        } else {
          setMessage(`Fehler: ${data.error}`);
        }
      } catch (error) {
        setMessage('Fehler beim Hochladen des Profilbildes.');
        console.error('Fehler beim Hochladen des Profilbildes:', error);
      }
    };

  return (
    <div className="profile-container">
      <h2>Profil verwalten</h2>
      {message && <p className="message">{message}</p>}
      
      {/* Nickname Section */}
      <div className="nickname-section">
        <h3>Nickname</h3>
        <form onSubmit={handleNicknameChange} className="profile-form">
          <div className="input-group">
            <label>Nickname</label>
            <input
              type="text"
              name="name"
              value={profileData.name || ''} // Sicherstellen, dass der Wert definiert ist
              onChange={handleInputChange}
              placeholder="Nickname eingeben"
            />
          </div>
          <button type="submit" className="nickname-change-button">
            Nickname ändern
          </button>
        </form>
      </div>
      
      {/* Password Change Section */}
      <div className="password-section">
        <h3>Passwort ändern</h3>
        <form onSubmit={handleSubmit} className="profile-form">
          <div className="input-group">
            <label>Aktuelles Passwort</label>
            <input
              type="password"
              name="currentPassword"
              value={profileData.currentPassword || ''} // Sicherstellen, dass der Wert definiert ist
              onChange={handleInputChange}
              placeholder="Aktuelles Passwort eingeben"
            />
          </div>
          <div className="input-group">
            <label>Neues Passwort</label>
            <input
              type="password"
              name="newPassword"
              value={profileData.newPassword || ''} // Sicherstellen, dass der Wert definiert ist
              onChange={handleInputChange}
              placeholder="Neues Passwort eingeben"
            />
          </div>
          <div className="input-group">
            <label>Neues Passwort bestätigen</label>
            <input
              type="password"
              name="confirmNewPassword"
              value={profileData.confirmNewPassword || ''} // Sicherstellen, dass der Wert definiert ist
              onChange={handleInputChange}
              placeholder="Neues Passwort bestätigen"
            />
          </div>
          <button type="submit" className="update-profile-button">
            Profil aktualisieren
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;