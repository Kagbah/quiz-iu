"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "./ui/button";
import { redirect } from "next/navigation";

type Lobby = {
  id: number;
  name: string;
  maxPlayers: number;
  connectedPlayers: Array<{ count: number }>;
};

export default function LobbySelector() {
  const [lobbies, setLobbies] = useState<Array<Lobby>>([]);
  const supabase = createClient();

  useEffect(() => {
    fetchLobbies();
    // ... (keep the existing realtime subscriptions)
  }, []);

  const fetchLobbies = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select(
        `
        *,
        connectedPlayers:lobbies_user(count)
      `
      )
      .eq("private", false);

    if (error) {
      console.error(error);
    } else {
      setLobbies(data || []);
    }
  };

  const joinLobby = (lobbyId: number) => {
    redirect(`/app/play/${lobbyId}`);
  };

  return (
    <div>
      <h1 className="font-bold text-3xl text-foreground">Available Lobbies</h1>
      <ul>
        {lobbies.map((lobby) => {
          const isLobbyFull =
            lobby.connectedPlayers[0].count >= lobby.maxPlayers;
          return (
            <li
              key={lobby.id}
              className="flex items-center justify-between my-2"
            >
              <span>
                {lobby.name} | {lobby.connectedPlayers[0].count}/
                {lobby.maxPlayers}
              </span>
              <Button
                onClick={() => joinLobby(lobby.id)}
                disabled={isLobbyFull}
              >
                {isLobbyFull ? "Full" : "Join"}
              </Button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
