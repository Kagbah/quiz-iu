"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchCategories = async () => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('categories').select('*');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Fehler beim Laden der Kategorien:', error);
    return [];
  }
};