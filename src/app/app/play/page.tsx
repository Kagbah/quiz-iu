export const runtime = "edge";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import GameModeSelector from "@/components/GameModeSelector";

export default async function PlayPage() {
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
        <GameModeSelector />
      </div>
    </div>
  );
}
