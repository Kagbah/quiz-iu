"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchCategories } from "@/actions/fetch-categories";
import { fetchQuestions } from "@/actions/fetch-questions";
import { createClient } from "@/utils/supabase/client";
import Papa from "papaparse";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/ui/select";

export default function QuizManagement() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [questions, setQuestions] = useState([]); // Zustand für die Fragen
  const [newCategory, setNewCategory] = useState<string>("");
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false); // Zustand für Bearbeitung
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  ); // ID der zu bearbeitenden Frage
  const [csvFileName, setCsvFileName] = useState<string>(""); // Zustand für den CSV-Dateinamen
  const formRef = useRef<HTMLDivElement>(null); // Referenz für Scroll

  // Kategorien holen
  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };

    fetchAndSetCategories();
  }, []);

  // Fragen laden, wenn eine Kategorie ausgewählt wird
  useEffect(() => {
    if (selectedCategory) {
      const fetchAndSetQuestions = async () => {
        const fetchedQuestions = await fetchQuestions(selectedCategory);
        setQuestions(fetchedQuestions);
      };

      fetchAndSetQuestions();
    }
  }, [selectedCategory]);

  // Kategorie hinzufügen
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategory.trim() === "") {
      alert("Bitte geben Sie einen Kategorienamen ein.");
      return;
    }

    const supabase = createClient();
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Benutzer ist nicht authentifiziert.");
      return;
    }

    try {
      const { data, error } = await supabase
        .from("categories")
        .insert([{ name: newCategory, createdBy: email }]);

      if (error) {
        console.error("Fehler beim Hinzufügen der Kategorie:", error);
        alert("Fehler beim Hinzufügen der Kategorie.");
        return;
      }

      // Neue Kategorie zur Liste hinzufügen
      setCategories([
        ...categories,
        { id: data[0].id, name: newCategory, createdBy: email },
      ]);
      setNewCategory(""); // Eingabefeld leeren
      alert("Kategorie erfolgreich hinzugefügt!");
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Kategorie:", error);
    }
  };

  // Frage hinzufügen oder bearbeiten
  const handleAddOrEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory || newQuestion.trim() === "") {
      alert(
        "Bitte wählen Sie eine Kategorie aus und geben Sie eine Frage ein."
      );
      return;
    }

    const supabase = createClient();
    const email = localStorage.getItem("email");

    if (!email) {
      alert("Benutzer ist nicht authentifiziert.");
      return;
    }

    try {
      if (isEditing && editingQuestionId !== null) {
        // Frage bearbeiten
        const { error } = await supabase
          .from("questions")
          .update({
            questionText: newQuestion,
            options: options.join(","), // Speichern als kommagetrennten String
            correctAnswer,
          })
          .eq("id", editingQuestionId);

        if (error) {
          console.error("Fehler beim Bearbeiten der Frage:", error);
          alert("Fehler beim Bearbeiten der Frage.");
          return;
        }

        alert("Frage erfolgreich bearbeitet!");
        setIsEditing(false);
        setEditingQuestionId(null);
      } else {
        // Neue Frage hinzufügen
        const { data, error } = await supabase.from("questions").insert([
          {
            questionText: newQuestion,
            options: options.join(","), // Speichern als kommagetrennten String
            correctAnswer,
            categoryId: Number(selectedCategory),
            createdBy: email,
          },
        ]);

        if (error) {
          console.error("Fehler beim Hinzufügen der Frage:", error);
          alert("Fehler beim Hinzufügen der Frage.");
          return;
        }

        alert("Frage erfolgreich hinzugefügt!");
      }

      setNewQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");

      // Fragenliste nach Hinzufügen der Frage aktualisieren
      const updatedQuestions = await fetchQuestions(Number(selectedCategory));
      setQuestions(updatedQuestions);
    } catch (error) {
      console.error("Fehler beim Hinzufügen der Frage:", error);
    }
  };

  // CSV-Datei hochladen und verarbeiten
  const handleCSVUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results: any) => {
        const questionsToInsert = results.data.map((row: any) => ({
          questionText: row.questionText,
          options: [row.option1, row.option2, row.option3, row.option4].join(
            ","
          ),
          correctAnswer: row.correctAnswer,
          categoryId: Number(selectedCategory),
          createdBy: localStorage.getItem("email"),
        }));

        const supabase = createClient();
        try {
          const { error } = await supabase
            .from("questions")
            .insert(questionsToInsert);

          if (error) {
            console.error("Fehler beim Hinzufügen der Fragen:", error);
            alert("Fehler beim Hinzufügen der Fragen.");
          } else {
            alert("Fragen erfolgreich hinzugefügt!");
            const updatedQuestions = await fetchQuestions(
              Number(selectedCategory)
            );
            setQuestions(updatedQuestions);
          }
        } catch (error) {
          console.error("Fehler beim Hochladen der CSV-Datei:", error);
        }
      },
    });
  };

  // Funktion zum Bearbeiten der Frage
  const handleEditQuestion = (question: any) => {
    // Hier sicherstellen, dass 'options' ein flaches Array bleibt
    const optionsArray = Array.isArray(question.options)
      ? question.options // Falls es bereits ein Array ist, lasse es so
      : typeof question.options === "string"
      ? question.options.split(",") // Falls die Optionen als kommagetrennter String gespeichert sind
      : [];

    // Setze die Daten der Frage in den Zustand
    setNewQuestion(question.questionText); // Setze die Frage in das Frage-Feld
    setOptions(optionsArray); // Setze die Optionen in die entsprechenden Felder
    setCorrectAnswer(question.correctAnswer); // Setze die richtige Antwort
    setIsEditing(true); // Aktiviere den Bearbeitungsmodus
    setEditingQuestionId(question.id); // Speichere die ID der zu bearbeitenden Frage

    // Scroll zu den Eingabefeldern, wenn die Bearbeitung aktiviert wird
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    // Bestätigungsaufforderung, bevor die Frage gelöscht wird
    const confirmation = window.confirm(
      "Sind Sie sicher, dass Sie diese Frage löschen möchten?"
    );
    if (!confirmation) return;

    const supabase = createClient();

    try {
      // Lösche die Frage aus der Datenbank
      const { error } = await supabase
        .from("questions")
        .delete()
        .eq("id", questionId);

      if (error) {
        console.error("Fehler beim Löschen der Frage:", error);
        alert("Fehler beim Löschen der Frage.");
        return;
      }

      // Aktualisiere die Fragenliste nach dem Löschen
      const updatedQuestions = await fetchQuestions(selectedCategory);
      setQuestions(updatedQuestions);

      alert("Frage erfolgreich gelöscht!");
    } catch (error) {
      console.error("Fehler beim Löschen der Frage:", error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col gap-8 max-md:p-0">
      {/* Quiz erstellen */}
      <div className="w-full md:min-w-96 max-w-4xl p-6 bg-secondary border border-border rounded-lg mx-auto">
        <h2 className="text-xl font-semibold mb-4">Quiz erstellen</h2>
        <form onSubmit={handleAddCategory} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Neue Kategorie</Label>
            <Input
              type="text"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Kategorie eingeben"
            />
          </div>
          <Button type="submit">Kategorie hinzufügen</Button>
        </form>
      </div>

      {/* Neue Frage erstellen */}
      <div
        ref={formRef}
        className="w-full max-w-4xl p-6 bg-secondary border border-border rounded-lg mx-auto flex flex-col gap-4"
      >
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Frage bearbeiten" : "Neue Frage erstellen"}
        </h2>
        {/* Kategorieauswahl */}
        <div className="flex flex-col gap-2">
          <Label className="font-medium">Kategorie auswählen</Label>
          <Select
            value={selectedCategory || ""}
            onValueChange={setSelectedCategory}
          >
            <SelectTrigger className="p-2 border rounded">
              <SelectValue placeholder="Kategorie wählen" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Kategorie auswählen</SelectLabel>
                {categories.map((category: any) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <form
          onSubmit={handleAddOrEditQuestion}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-2">
            <Label className="font-medium">Neue Frage</Label>
            <Input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Frage eingeben"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label className="font-medium">Optionen</Label>
            {options.map((option, index) => (
              <Input
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

          <div className="flex flex-col gap-2">
            <Label className="font-medium">Richtige Antwort</Label>
            <Select value={correctAnswer} onValueChange={setCorrectAnswer}>
              <SelectTrigger className="p-2 border rounded">
                <SelectValue placeholder="Bitte richtige Antwort auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Bitte richtige Antwort auswählen</SelectLabel>
                  {options.map(
                    (option, index) =>
                      option && (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      )
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <Button type="submit">
            {isEditing ? "Frage bearbeiten" : "Frage hinzufügen"}
          </Button>
        </form>

        {/* CSV-Datei hochladen */}
        <div className="flex flex-col gap-2">
          <Label className="font-medium">Fragen via CSV hochladen</Label>

          <Input type="file" accept=".csv" onChange={handleCSVUpload} />

          {/* Zeige den Dateinamen an, wenn eine Datei ausgewählt wurde */}
          {csvFileName && (
            <p className="mt-2 text-sm text-gray-600">
              Ausgewählte Datei: {csvFileName}
            </p>
          )}
        </div>
      </div>

      {/* Fragen in der Kategorie */}
      {selectedCategory && questions.length > 0 && (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-4 grow-0">
          <h2 className="text-xl font-semibold">Fragen in der Kategorie</h2>
          <div className="flex flex-col gap-4">
            {questions.map((question: any) => (
              <div
                key={question.id}
                className="p-4 border-border bg-secondary border rounded-lg flex flex-col gap-2"
              >
                <h3 className="font-semibold text-lg">
                  {question.questionText}
                </h3>
                <ul className="pl-4">
                  {Array.isArray(question.options)
                    ? question.options.map((option: string, index: number) => (
                        <li key={index} className="mb-1">
                          <span className="font-medium">{index + 1}.</span>{" "}
                          {option}
                        </li>
                      ))
                    : null}
                </ul>
                <p className="mt-4 text-green-600">
                  Richtige Antwort: {question.correctAnswer}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant={"default"}
                    onClick={() => handleEditQuestion(question)}
                  >
                    Bearbeiten
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteQuestion(question.id)}
                  >
                    Löschen
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
