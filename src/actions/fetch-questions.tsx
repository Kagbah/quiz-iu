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

    // Sicherstellen, dass 'options' als Array interpretiert wird
    return data.map(question => ({
      ...question,
      options: parseOptions(question.options),
    })) as Question[];
  } catch (error) {
    console.error('Fehler beim Laden der Fragen:', error);
    return [];
  }
};

// Hilfsfunktion zum Verarbeiten der Optionen
const parseOptions = (options: string | string[]): string[] => {
  if (typeof options === 'string') {
    // Hier gehen wir davon aus, dass die Optionen durch Kommas getrennt sind
    return options.split(',').map(option => option.trim()); // Optionen trennen und Leerzeichen entfernen
  }

  // Wenn es bereits ein Array ist, gib es direkt zurück
  return options;
};