import { createClient } from "@/utils/supabase/server";
import Sidebar from "./Sidebar";

export default async function ServerSidebar() {
  const supabase = createClient();

  let role = "user";

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <></>;
  }

  const { data, error } = await supabase
    .from("user_role")
    .select(
      `
      role (description)
      `
    )
    .eq("user_id", user?.id!)
    .limit(1)
    .single();

  if (data) {
    role = data.role?.description!;
  }

  return <Sidebar role={role} />;
}
