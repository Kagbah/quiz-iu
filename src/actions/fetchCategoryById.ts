"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchCategoryById = async (categoryId: string) => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", categoryId)
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Fehler beim Laden der Kategorie:", error);
    return null;
  }
};