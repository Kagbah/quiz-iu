"use client";

import React, { useState } from "react";
import { Button } from "./ui/button";
import SingleplayerGame from "./SingleplayerGame";
import MultiplayerLobby from "./MultiplayerLobby";

type GameMode = "select" | "singleplayer" | "multiplayer";

export default function GameModeSelector() {
  const [gameMode, setGameMode] = useState<GameMode>("select");

  if (gameMode === "singleplayer") {
    return <SingleplayerGame />;
  }

  if (gameMode === "multiplayer") {
    return <MultiplayerLobby />;
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl font-bold">Wähle einen Spielmodus</h1>
      <Button
        className="min-w-44 p-8 font-bold"
        onClick={() => setGameMode("singleplayer")}
      >
        Einzelspieler
      </Button>
      <Button
        className="min-w-44 p-8 font-bold"
        onClick={() => setGameMode("multiplayer")}
      >
        Mehrspieler
      </Button>
    </div>
  );
}
