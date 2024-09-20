"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function leaveLobby(userId: string) {
  const supabase = createClient();
  await supabase.from("lobbies_user").delete().eq("user_id", userId);
  redirect("/app/play");
}
