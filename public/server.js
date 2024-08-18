const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer'); // Zum Verarbeiten von Datei-Uploads
const csv = require('csv-parser'); // Zum Verarbeiten von CSV-Dateien
const path = require('path');
const pool = require('./db'); // Deine MySQL Datenbankverbindung

const jwt = require('jsonwebtoken');
const SECRET_KEY = 'your-secret-key'; // Wähle einen geheimen Schlüssel

const app = express();
const PORT = 5000;

// CORS-Middleware aktivieren
app.use(cors());

// Middleware zum Parsen von JSON
app.use(bodyParser.json());

// Middleware zum Verarbeiten von Datei-Uploads
const upload = multer({ dest: 'uploads/' });

function checkAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(403).json({ error: 'Zugriff verweigert: Kein Token gefunden.' });
  }

  const token = authHeader.split(' ')[1]; // Entfernt 'Bearer ' und behält nur den Token

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.role !== 'admin') {
      return res.status(403).json({ error: 'Zugriff verweigert: Keine Administratorrechte.' });
    }
    req.email = decoded.email; // Optional: E-Mail aus dem Token verfügbar machen
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Ungültiger Token.' });
  }
}

// Route zur Registrierung eines Benutzers
app.post('/register', async (req, res) => {
  const { email, password, name = "Normal User", role = 'user' } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Benutzer existiert bereits.' });
    }

    await pool.query('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', 
                     [email, password, name, role]);

    res.status(201).json({ message: 'Registrierung erfolgreich.' });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ error: 'Fehler bei der Registrierung.' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length === 0) {
      return res.status(401).json({ error: 'Ungültige Anmeldeinformationen.' });
    }

    const user = users[0];
    const token = jwt.sign({ email: user.email, role: user.role }, SECRET_KEY, { expiresIn: '1h' });

    res.status(200).json({
      token,
      name: user.name,
      role: user.role,
      email: user.email
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ error: 'Fehler beim Login.' });
  }
});

// Routen zum Verwalten von Kategorien und Fragen

// Route zum Abrufen aller Kategorien und Fragen
app.get('/admin-data', checkAdmin, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    const [categories] = await pool.query('SELECT * FROM categories');
    const [questions] = await pool.query('SELECT * FROM questions');

    // Verknüpfe Fragen mit ihren jeweiligen Kategorien
    const categoriesWithQuestions = categories.map(category => {
      return {
        ...category,
        questions: questions.filter(question => question.categoryId === category.id)
      };
    });

    res.json({ users, categories: categoriesWithQuestions });
  } catch (error) {
    console.error('Fehler beim Abrufen der Admin-Daten:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Admin-Daten.' });
  }
});
// Beispielroute, die die `checkAdmin` Middleware verwendet
app.get('/admin-data', checkAdmin, async (req, res) => {
  try {
      const [users] = await pool.query('SELECT * FROM users');
      const [categories] = await pool.query('SELECT * FROM categories');
      res.json({ users, categories });
  } catch (error) {
      console.error('Fehler beim Abrufen der Admin-Daten:', error);
      res.status(500).json({ error: 'Fehler beim Abrufen der Admin-Daten.' });
  }
});

app.post('/add-category', async (req, res) => {
  const { category, createdBy } = req.body;

  if (!category) {
    return res.status(400).json({ error: 'Kategorie ist erforderlich.' });
  }

  try {
    const [rows] = await pool.query('SELECT * FROM categories WHERE name = ?', [category]);
    if (rows.length > 0) {
      return res.status(400).json({ error: 'Kategorie existiert bereits.' });
    }

    await pool.query('INSERT INTO categories (name, createdBy, createdAt) VALUES (?, ?, ?)', 
                     [category, createdBy, new Date()]);

    res.status(201).json({ message: 'Kategorie erfolgreich hinzugefügt.' });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Kategorie:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen der Kategorie.' });
  }
});

app.get('/quiz-data', async (req, res) => {
  try {
    const [categories] = await pool.query('SELECT * FROM categories');
    const [questions] = await pool.query('SELECT * FROM questions');

    const data = categories.map(category => {
      return {
        ...category,
        questions: questions.filter(question => question.categoryId === category.id)
      };
    });

    res.json({ categories: data });
  } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen der Daten.' });
  }
});

// Route zum Hinzufügen einer neuen Frage zu einer Kategorie
app.post('/add-question', async (req, res) => {
  const { category, question } = req.body;
  const createdBy = question.createdBy || 'unknown';

  if (!category || !question) {
    return res.status(400).json({ error: 'Kategorie und Frage sind erforderlich.' });
  }

  try {
    const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: 'Kategorie nicht gefunden.' });
    }

    const categoryId = categoryRows[0].id;

    await pool.query('INSERT INTO questions (questionText, options, correctAnswer, categoryId, createdBy, createdAt, updatedBy, updatedAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                     [question.questionText, JSON.stringify(question.options), question.correctAnswer, categoryId, createdBy, new Date(), createdBy, new Date()]);

    res.status(201).json({ message: 'Frage erfolgreich hinzugefügt.' });
  } catch (error) {
    console.error('Fehler beim Hinzufügen der Frage:', error);
    res.status(500).json({ error: 'Fehler beim Hinzufügen der Frage.' });
  }
});

// Route zum Bearbeiten einer bestehenden Frage in einer Kategorie
app.post('/edit-question', async (req, res) => {
  const { question } = req.body;
  const updatedBy = question.updatedBy || 'unknown';

  if (!question || !question.id) {
    return res.status(400).json({ error: 'Gültige Frage-ID ist erforderlich.' });
  }

  try {
    await pool.query('UPDATE questions SET questionText = ?, options = ?, correctAnswer = ?, updatedBy = ?, updatedAt = ? WHERE id = ?', 
                     [question.questionText, JSON.stringify(question.options), question.correctAnswer, updatedBy, new Date(), question.id]);

    res.status(200).json({ message: 'Frage erfolgreich bearbeitet.' });
  } catch (error) {
    console.error('Fehler beim Bearbeiten der Frage:', error);
    res.status(500).json({ error: 'Fehler beim Bearbeiten der Frage.' });
  }
});

// Route zum Löschen einer Frage aus einer Kategorie
app.post('/delete-question', async (req, res) => {
  const { questionId, deletedBy } = req.body;

  if (!questionId) {
    return res.status(400).json({ error: 'Frage-ID ist erforderlich.' });
  }

  try {
    await pool.query('DELETE FROM questions WHERE id = ?', [questionId]);
    res.status(200).json({ message: `Frage erfolgreich gelöscht von ${deletedBy}.` });
  } catch (error) {
    console.error('Fehler beim Löschen der Frage:', error);
    res.status(500).json({ error: 'Fehler beim Löschen der Frage.' });
  }
});

// Route zum Hochladen von Fragen über eine CSV-Datei
app.post('/upload-questions', upload.single('file'), async (req, res) => {
  const { category, uploadedBy } = req.body;
  const file = req.file;

  if (!category || !file) {
    return res.status(400).json({ error: 'Kategorie und Datei sind erforderlich.' });
  }

  try {
    const [categoryRows] = await pool.query('SELECT id FROM categories WHERE name = ?', [category]);
    if (categoryRows.length === 0) {
      return res.status(400).json({ error: 'Kategorie nicht gefunden.' });
    }

    const categoryId = categoryRows[0].id;
    const questions = [];

    fs.createReadStream(file.path)
      .pipe(csv())
      .on('data', (row) => {
        questions.push([
          row['Frage'],
          JSON.stringify([row['Option 1'], row['Option 2'], row['Option 3'], row['Option 4']]),
          row['Korrekte Antwort'],
          categoryId,
          uploadedBy || 'unknown',
          new Date(),
          uploadedBy || 'unknown',
          new Date()
        ]);
      })
      .on('end', async () => {
        const query = 'INSERT INTO questions (questionText, options, correctAnswer, categoryId, createdBy, createdAt, updatedBy, updatedAt) VALUES ?';
        await pool.query(query, [questions]);

        fs.unlink(file.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Fehler beim Löschen der hochgeladenen Datei:', unlinkErr);
          }
        });

        res.status(201).json({ message: 'Fragen erfolgreich hochgeladen.', uploadedQuestions: questions });
      });
  } catch (error) {
    console.error('Fehler beim Hochladen der Fragen:', error);
    res.status(500).json({ error: 'Fehler beim Hochladen der Fragen.' });
  }
});



// server.js

// Route zum Abrufen der Profildaten
app.get('/profile', async (req, res) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const [users] = await pool.query('SELECT name, email FROM users WHERE email = ?', [req.email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('Fehler beim Abrufen des Profils:', error);
    res.status(500).json({ error: 'Fehler beim Abrufen des Profils.' });
  }
});
  
// server.js

// Route zum Aktualisieren der Profildaten inklusive Passwortänderung
app.post('/profile', async (req, res) => {
  const { name, email, currentPassword, newPassword } = req.body;
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ error: 'Nicht autorisiert' });
  }

  try {
    const [users] = await pool.query('SELECT password FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(404).json({ error: 'Benutzer nicht gefunden.' });
    }

    if (users[0].password !== currentPassword) {
      return res.status(400).json({ error: 'Aktuelles Passwort ist falsch.' });
    }

    const updatedPassword = newPassword ? newPassword : users[0].password;

    await pool.query('UPDATE users SET password = ? WHERE email = ?', [updatedPassword, email]);

    res.status(200).json({ message: 'Profil erfolgreich aktualisiert.' });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    res.status(500).json({ error: 'Fehler beim Aktualisieren des Profils.' });
  }
});



app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});