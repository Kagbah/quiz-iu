"use server";

import { createClient } from "@/utils/supabase/server";

export const fetchLobbies = async () => {
  const supabase = createClient();

  try {
    const { data, error } = await supabase.from('lobbies').select('*');

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Fehler beim Laden der Lobbies:', error);
    return [];
  }
};