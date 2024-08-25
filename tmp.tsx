export const runtime = "edge";
import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/HeaderLoggedIn";
import { Footer } from "@/components/Footer";
import React, { useState, useEffect, useRef } from 'react';
import { create } from "domain";
import { Tables } from "@/types/database.types";

const CreateQuiz = async () => {
  let categoriesType: Tables<'categories'>;

  const [categories, setCategories] = useState<Array<typeof categoriesType>>([]);  // Initialisiere als leeres Array
  const [newCategory, setNewCategory] = useState(''); // Initialisiert als leerer String
  const [selectedCategory, setSelectedCategory] = useState<typeof categoriesType>(); // Initialisiert als leerer String
  const [questions, setQuestions] = useState([]);  // Initialisiere als leeres Array
  const [newQuestion, setNewQuestion] = useState(''); // Initialisiert als leerer String
  const [options, setOptions] = useState(['', '', '', '']); // Initialisiert mit leeren Strings
  const [correctAnswer, setCorrectAnswer] = useState(''); // Initialisiert als leerer String
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState(null);
  const [file, setFile] = useState(null); // Neuer State für die hochgeladene Datei
  const [fileName, setFileName] = useState(''); // Neuer State für den Dateinamen

  // Ref für das Formular erstellen
  const formRef = useRef(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  // useEffect(() => {
  //   if (selectedCategory) {
  //     const category = categories.find(cat => cat.name === selectedCategory);
  //     setQuestions(category ? category.questions : []);
  //   }
  // }, [selectedCategory, categories]);

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from('categories').select('*');

      if (error) {
        throw error;
      }

      setCategories(data || []);
    } catch (error) {
      console.error('Fehler beim Laden der Kategorien:', error);
      setCategories([]);
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) {
      alert('Bitte geben Sie einen Kategorienamen ein.');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: newCategory,
          createdBy: user.email!
        }).select();

      if (error) {
        alert(error.message);
      } else {
        const newCategories = [...categories, data[0]];
        setCategories(newCategories);
        //setSelectedCategory(newCategory);
        setNewCategory('');
        setQuestions([]);
      }
    } catch (error) {
      console.error('Fehler beim Hinzufügen der Kategorie:', error);
    }
  };

  // Handle adding or editing a question
  const handleAddOrEditQuestion = async (e) => {
    e.preventDefault();
    if (!validateQuestion()) return;

    const email = localStorage.getItem('email'); // E-Mail-Adresse des Benutzers
    const question = {
        id: isEditing ? editingQuestionId : Date.now(),
        questionText: newQuestion,
        options: [...options],
        correctAnswer,
        createdBy: email, // Ersteller der Frage
        updatedBy: isEditing ? email : null, // Bearbeiter der Frage, falls bearbeitet wird
    };

    try {
        const endpoint = isEditing ? 'edit-question' : 'add-question';
        const response = await fetch(`http://localhost:5000/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ category: selectedCategory, question }),
        });
        const data = await response.json();

        if (data.error) {
            alert(data.error);
        } else {
            updateCategoriesWithNewQuestion(question);
            resetForm();
        }
    } catch (error) {
        console.error('Fehler beim Hinzufügen oder Bearbeiten der Frage:', error);
    }
  };
  

  // Handle editing a question
  const handleEditQuestion = (question) => {
    setNewQuestion(question.questionText || ''); // Sicherstellen, dass es ein leerer String ist, wenn undefiniert
    setOptions(question.options || ['', '', '', '']); // Sicherstellen, dass es leere Strings sind, wenn undefiniert
    setCorrectAnswer(question.correctAnswer || ''); // Sicherstellen, dass es ein leerer String ist, wenn undefiniert
    setIsEditing(true);
    setEditingQuestionId(question.id);
    
    // Scrollt zum Formular am Seitenanfang
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle deleting a question
  const handleDeleteQuestion = async (questionId) => {
    const confirmation = window.confirm("Sind Sie sicher, dass Sie diese Frage löschen möchten?");
    if (!confirmation) return;

    const email = localStorage.getItem('email'); // E-Mail-Adresse des Benutzers

    try {
      const response = await fetch('http://localhost:5000/delete-question', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category: selectedCategory, questionId, deletedBy: email }),
      });
      const data = await response.json();

      if (data.error) {
        alert(data.error);
      } else {
        const updatedCategories = categories.map((cat) =>
          cat.name === selectedCategory
            ? { ...cat, questions: cat.questions.filter((q) => q.id !== questionId) }
            : cat
        );
        setCategories(updatedCategories);
        setQuestions(updatedCategories.find((cat) => cat.name === selectedCategory).questions);
      }
    } catch (error) {
      console.error('Fehler beim Löschen der Frage:', error);
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : '');
  };

  const handleUploadQuestions = async () => {
    if (!file || !selectedCategory) {
        alert('Bitte wählen Sie eine Kategorie und eine CSV-Datei aus.');
        return;
    }

    const email = localStorage.getItem('email'); // E-Mail-Adresse des Benutzers
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', selectedCategory);
    formData.append('uploadedBy', email); // Ersteller der hochgeladenen Fragen

    try {
        const response = await fetch('http://localhost:5000/upload-questions', {
            method: 'POST',
            body: formData,
        });

        const data = await response.json();
        if (data.error) {
            alert(data.error);
        } else {
            setQuestions([...questions, ...data.uploadedQuestions]);
            alert('Fragen erfolgreich hochgeladen.');
        }
    } catch (error) {
        console.error('Fehler beim Hochladen der Fragen:', error);
    }
  };

  // Validate question form fields
  const validateQuestion = () => {
    if (!selectedCategory) {
      alert('Bitte wählen Sie eine Kategorie aus.');
      return false;
    }
    if (!newQuestion.trim() || !correctAnswer.trim() || options.some(option => !option.trim())) {
      alert('Bitte füllen Sie alle Felder aus.');
      return false;
    }
    return true;
  };

  // Update categories after adding or editing a question
  const updateCategoriesWithNewQuestion = (question) => {
    const updatedCategories = categories.map(cat =>
      cat.name === selectedCategory
        ? {
            ...cat,
            questions: isEditing
              ? cat.questions.map(q => (q.id === editingQuestionId ? question : q))
              : [...cat.questions, question],
          }
        : cat
    );
    setCategories(updatedCategories);
    setQuestions(updatedCategories.find(cat => cat.name === selectedCategory).questions);
  };

  // Reset the form fields
  const resetForm = () => {
    setNewQuestion('');
    setOptions(['', '', '', '']);
    setCorrectAnswer('');
    setIsEditing(false);
    setEditingQuestionId(null);
  };

  return (
    <div className="create-quiz-container">
      <h2>Quiz erstellen</h2>
      <div className="section-container" ref={formRef}>
        <form onSubmit={handleAddCategory}>
          <div className="category-section">
            <div className="input-group">
              <label>Neue Kategorie</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Kategorie hinzufügen"
              />
              <button className="add-category-button" type="submit">
                Kategorie hinzufügen
              </button>
            </div>
          </div>
        </form>

        <div className="input-group">
          <label>Kategorie auswählen</label>
          <select
            value={selectedCategory.name}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">Kategorie wählen</option>
            {categories.map((category, index) => (
              <option key={index} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {selectedCategory && (
        <>
          <div className="section-container">
            <form onSubmit={handleAddOrEditQuestion}>
              <div className="create-quiz-form">
                <div className="input-group">
                  <label>Frage</label>
                  <input
                    type="text"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Geben Sie die Frage ein"
                  />
                </div>
                <div className="input-group">
                  <label>Antwortoptionen</label>
                  {options.map((option, index) => (
                    <input
                      key={index}
                      type="text"
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...options];
                        newOptions[index] = e.target.value;
                        setOptions(newOptions);
                      }}
                      placeholder={`Option ${index + 1}`}
                    />
                  ))}
                </div>
                <div className="input-group">
                  <label>Korrekte Antwort</label>
                  <select
                    value={correctAnswer}
                    onChange={(e) => setCorrectAnswer(e.target.value)}
                  >
                    <option value="">Wählen Sie die korrekte Antwort</option>
                    {options.map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="add-question-button" type="submit">
                  {isEditing ? 'Frage bearbeiten' : 'Frage hinzufügen'}
                </button>
                
                {isEditing && (
                  <button className="cancel-edit-button" type="button" onClick={resetForm}>
                    Bearbeitung abbrechen
                  </button>
                )}
              </div>
            </form>

            <div className="file-upload-section">
              <label htmlFor="file-upload" className="file-upload-label">
                Datei auswählen
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <button className="upload-questions-button" onClick={handleUploadQuestions}>
                Fragen hochladen
              </button>
            </div>

            {fileName && (
              <div className="file-name-display">
                Ausgewählte Datei: {fileName}
              </div>
            )}
          
          </div>

          <div className="section-container">
            <h3>Fragen in der Kategorie "{selectedCategory}"</h3>
            {questions && Array.isArray(questions) && questions.length > 0 ? (
              <ul className="questions-list">
                {questions.map((question) => (
                  <li key={question.id} className="question-item">
                    <div className="question-text">{question.questionText}</div>
                    <div className="question-options">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`option ${
                            option === question.correctAnswer ? 'correct' : ''
                          }`}
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                    <div className="question-actions">
                      <button className="edit-button" onClick={() => handleEditQuestion(question)}>Bearbeiten</button>
                      <button className="delete-button" onClick={() => handleDeleteQuestion(question.id)}>Löschen</button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Keine Fragen in dieser Kategorie hinzugefügt.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default CreateQuiz;