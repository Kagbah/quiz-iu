"use client";

import React from "react";
import { Tables } from "@/types/database.types";

type Question = Tables<"questions">;

interface QuestionSelectorProps {
  questions: {
    categoryId: number;
    correctAnswer: string;
    createdAt: string;
    createdBy: string;
    id: number;
    options: string | string[]; // Erlaubt sowohl string als auch string[]
    questionText: string;
    updatedAt: string | null;
    updatedBy: string | null;
  }[];
  onEdit: (question: {
    categoryId: number;
    correctAnswer: string;
    createdAt: string;
    createdBy: string;
    id: number;
    options: string; // Erwartet einen String, da onEdit diese Struktur erwartet
    questionText: string;
    updatedAt: string | null;
    updatedBy: string | null;
  }) => void;
  onDelete: (questionId: number) => void;
}

export function QuestionSelector({
  questions,
  onEdit,
  onDelete,
}: QuestionSelectorProps) {
  return (
    <div className="questions-selector">
      <h2>Fragen:</h2>
      {questions && questions.length > 0 ? (
        <ul className="questions-list">
          {questions.map((question) => {
            const optionsString =
              typeof question.options === "string"
                ? question.options
                : question.options.join(", "); // Konvertiere Array zu String, falls nötig

            return (
              <li key={question.id} className="question-item">
                <div className="question-text text-wrap">
                  {question.questionText}
                </div>
                <div className="question-options">
                  {typeof question.options === "string"
                    ? question.options
                        .split(",")
                        .map((option: string, index: number) => (
                          <div
                            key={index}
                            className={`option ${
                              option === question.correctAnswer ? "correct" : ""
                            }`}
                          >
                            {option}{" "}
                            {option === question.correctAnswer && (
                              <strong>(Richtige Antwort)</strong>
                            )}
                          </div>
                        ))
                    : question.options.map((option: string, index: number) => (
                        <div
                          key={index}
                          className={`option ${
                            option === question.correctAnswer ? "correct" : ""
                          }`}
                        >
                          {option}{" "}
                          {option === question.correctAnswer && (
                            <strong>(Richtige Antwort)</strong>
                          )}
                        </div>
                      ))}
                </div>
                <div className="question-actions">
                  <button
                    className="edit-button"
                    onClick={() =>
                      onEdit({ ...question, options: optionsString })
                    }
                  >
                    Bearbeiten
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => onDelete(question.id)}
                  >
                    Löschen
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p>Keine Fragen in dieser Kategorie hinzugefügt.</p>
      )}
    </div>
  );
}
