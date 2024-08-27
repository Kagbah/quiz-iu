export const runtime = "edge";

import LeaveLobbyButton from "@/components/LeaveLobbyButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PlayPage({ params }: { params: { id: string } }) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const lobbyId = params.id;

  // Fetch lobby data
  const { data: lobby, error: lobbyError } = await supabase
    .from("lobbies")
    .select("*, connectedPlayers:lobbies_user(count)")
    .eq("id", lobbyId)
    .limit(1)
    .single();

  if (lobbyError || !lobby) {
    return redirect("/play?message=lobby-not-found");
  }

  // Check if lobby is full
  if (lobby.maxPlayers <= lobby.connectedPlayers[0].count) {
    return redirect("/play?message=lobby-full");
  }

  // Check if user is already in lobby
  const { data: userInLobby, error: userInLobbyError } = await supabase
    .from("lobbies_user")
    .select()
    .eq("user_id", user.id)
    .eq("lobbies_id", lobby.id)
    .maybeSingle();

  // If user is not in lobby, add them
  if (!userInLobby && !userInLobbyError) {
    const { error: insertError } = await supabase
      .from("lobbies_user")
      .insert({ user_id: user.id, lobbies_id: lobby.id });

    if (insertError) {
      console.error("Error adding user to lobby:", insertError);
    }
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <h1 className="text-4xl font-bold text-center">{lobby.name}</h1>
      <span>Test</span>
      <br />
      <LeaveLobbyButton userId={user.id} />
    </div>
  );
}
