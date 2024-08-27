// QuizManagement.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";
import { fetchCategories } from "@/actions/fetch-categories";
import { fetchQuestions } from "@/actions/fetch-questions";
import { QuestionSelector } from "@/components/QuestionSelector";
import { Question, Category } from "@/types/question.types";
import { createClient } from "@/utils/supabase/client"; // Pfad anpassen je nach Struktur
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Label } from "@radix-ui/react-label";

export default function QuizManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState<string>("");
  const [options, setOptions] = useState<string[]>(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null
  );
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchAndSetCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };

    fetchAndSetCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      const category = categories.find((cat) => cat.name === selectedCategory);
      if (category) {
        const fetchAndSetQuestions = async () => {
          const fetchedQuestions = await fetchQuestions(category.id);
          setQuestions(fetchedQuestions);
        };

        fetchAndSetQuestions();
      }
    }
  }, [selectedCategory, categories]);

  const handleAddOrEditQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validierung und das Speichern der Frage
  };

  const handleEditQuestion = (question: Question) => {
    const optionsArray =
      typeof question.options === "string"
        ? question.options.split(",")
        : question.options;
    setNewQuestion(question.questionText);
    setOptions(optionsArray);
    setCorrectAnswer(question.correctAnswer);
    setIsEditing(true);
    setEditingQuestionId(question.id);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDeleteQuestion = async (questionId: number) => {
    const confirmation = window.confirm(
      "Sind Sie sicher, dass Sie diese Frage löschen möchten?"
    );
    if (!confirmation) return;

    const email = localStorage.getItem("email"); // E-Mail-Adresse des Benutzers
    const supabase = createClient();

    try {
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
      setQuestions(questions.filter((q) => q.id !== questionId));
      alert(`Frage erfolgreich gelöscht von ${email}.`);
    } catch (error) {
      console.error("Fehler beim Löschen der Frage:", error);
    }
  };

  return (
    <div>
      <div ref={formRef}>
        <form
          className="flex flex-col justify-center gap-8"
          onSubmit={handleAddOrEditQuestion}
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
          {/* Andere Eingabefelder für Optionen und die korrekte Antwort */}
          <Button type="submit">
            {isEditing ? "Frage bearbeiten" : "Frage hinzufügen"}
          </Button>
        </form>
      </div>

      {selectedCategory && (
        <QuestionSelector
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  );
}
