export const runtime = "edge";

import LobbyCreator from "@/components/LobbyCreator";
import LobbySelector from "@/components/LobbySelector";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data, error } = await supabase
    .from("lobbies_user")
    .select()
    .eq("user_id", user.id);

  if (data && data.length > 0) {
    return redirect("/app/play/" + data[0].lobbies_id);
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-8 max-w-4xl px-3 justify-center">
        <LobbySelector />
        <LobbyCreator />
        <hr />
      </div>
    </div>
  );
}
