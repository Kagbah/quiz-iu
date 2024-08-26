"use client";
import { createClient } from "@/utils/supabase/client";
import SidebarAdmin from "./SidebarAdmin";
import SidebarUser from "./SidebarUser";

export default async function Sidebar() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_role")
    .select(
      `
      role (description)
      `
    )
    .eq("user_id", (await supabase.auth.getUser()).data.user?.id)
    .limit(1)
    .single();

  const role = data?.role.description!;

  console.log(data, error);
  return role == "admin" ? <SidebarAdmin /> : <SidebarUser />;
}
