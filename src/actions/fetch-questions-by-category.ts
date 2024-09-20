"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchQuestionsByCategoryId = async (categoryId: string) => {
  const supabase = createClient();

  try {
    const numericCategoryId = parseInt(categoryId, 10);
    if (isNaN(numericCategoryId)) {
      throw new Error("Invalid category ID");
    }

    const { data, error } = await supabase
      .from("questions")
      .select("*")
      .eq("categoryId", numericCategoryId);

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Fehler beim Laden der Fragen:", error);
    return [];
  }
};
