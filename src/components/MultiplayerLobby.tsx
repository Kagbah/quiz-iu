"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import GameComponent from "./GameComponent";
import { useRouter } from "next/navigation";

interface Lobby {
  id: number;
  name: string;
}

export default function MultiplayerLobby() {
  const [lobbies, setLobbies] = useState<Lobby[]>([]);
  const [newLobbyName, setNewLobbyName] = useState("");
  const [selectedLobby, setSelectedLobby] = useState<Lobby | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    fetchLobbies();
  }, []);

  const fetchLobbies = async () => {
    const { data, error } = await supabase.from("lobbies").select("*");
    if (error) {
      console.error("Error fetching lobbies:", error);
    } else {
      setLobbies(data || []);
    }
  };

  const createLobby = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .insert({ name: newLobbyName })
      .select()
      .single();

    if (error) {
      console.error("Error creating lobby:", error);
    } else if (data) {
      router.push(`/app/play/${data.id}`);
    }
  };

  const joinLobby = (lobby: Lobby) => {
    router.push(`/app/play/${lobby.id}`);
  };

  const startGame = () => {
    setGameStarted(true);
  };

  if (gameStarted && selectedLobby) {
    return <GameComponent lobbyId={selectedLobby.id} isSingleplayer={false} />;
  }

  if (selectedLobby) {
    return (
      <div className="flex flex-col items-center space-y-4">
        <h1 className="text-2xl font-bold">Lobby: {selectedLobby.name}</h1>
        <Button onClick={startGame}>Start Game</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 px-8">
      <h1 className="text-2xl font-bold">Mehrspieler Lobbies</h1>
      <div className="flex flex-col gap-4 mb-12">
        <Input
          type="text"
          value={newLobbyName}
          onChange={(e) => setNewLobbyName(e.target.value)}
          placeholder="Lobbynamen eingeben"
        />
        <Button onClick={createLobby}>Lobby erstellen</Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg md:text-xl font-semibold text-center">
          Einer bestehenden Lobby beitreten:
        </h2>
        <div className="flex gap-4 flex-wrap justify-center">
          {lobbies.map((lobby) => (
            <Button
              variant={"secondary"}
              className="min-w-32"
              key={lobby.id}
              onClick={() => joinLobby(lobby)}
            >
              {lobby.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
