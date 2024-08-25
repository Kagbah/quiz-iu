"use server";

import { createClient } from "@/utils/supabase/server";
import { Tables } from "@/types/database.types";

type Question = {
  id: number;
  categoryId: number;
  questionText: string;
  options: string[];
  correctAnswer: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string | null;
  updatedBy: string | null;
};


export const fetchQuestions = async (categoryId: number): Promise<Question[]> => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('questions')
      .select('*')
      .eq('categoryId', categoryId);

    if (error) {
      throw error;
    }

    // Sicherstellen, dass 'options' ein Array von Strings ist
    return data.map(question => ({
      ...question,
      options: typeof question.options === 'string' ? JSON.parse(question.options) : question.options,
    })) as Question[];
  } catch (error) {
    console.error('Fehler beim Laden der Fragen:', error);
    return [];
  }
};