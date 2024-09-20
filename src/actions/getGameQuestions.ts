"use server";

import { createClient } from "@/utils/supabase/server";

export interface Question {
  id: number;
  questionText: string;
  options: string;
  correctAnswer: string;
  categoryId: number;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
}

export async function getGameQuestions(lobbyId: number): Promise<Question[]> {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("lobbies_questions")
    .select(
      `
          questions:questions(*)
        `
    )
    .eq("lobbiesId", lobbyId);

  if (error) {
    console.error("Error fetching questions:", error);
    throw new Error("Failed to fetch questions");
  }

  // Filter out any null values and ensure all required fields are present
  const questions =
    data
      ?.flatMap((item) => item.questions)
      .filter(
        (q): q is Question =>
          q !== null &&
          typeof q.id === "number" &&
          typeof q.questionText === "string" &&
          typeof q.options === "string" &&
          typeof q.correctAnswer === "string" &&
          typeof q.categoryId === "number"
      ) || [];

  return questions;
}
