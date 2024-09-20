"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchQuestionsByCategoryId = async (categoryId: number) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("categoryId", categoryId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    return [];
  }
};
