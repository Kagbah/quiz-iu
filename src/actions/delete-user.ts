"use server";

import { createClient } from "@supabase/supabase-js";

export const deleteUser = async (id: string) => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE!
  );

  try {
    const { data, error } = await supabase.auth.admin.deleteUser(id);

    if (error) {
      console.error(error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Fehler beim entfernen des nutzers", error);
    return false;
  }
};
