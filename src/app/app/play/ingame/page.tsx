"use client";

import { useSearchParams } from "next/navigation";
import InGame from "@/components/InGame";
import MultiplayerGame from "@/components/MultiplayerGame";
import { useEffect, useState } from "react";

export default function InGamePage() {
  const searchParams = useSearchParams();
  const [gameProps, setGameProps] = useState<{
    lobbyId: string;
  } | null>(null);

  useEffect(() => {
    const mode = searchParams.get("mode");

    const lobby = searchParams.get("lobbyId");

    if (mode === "multiplayer" && lobby) {
      setGameProps({ lobbyId: lobby });
    }
  }, [searchParams]);

  if (gameProps) {
    return <MultiplayerGame />;
  }

  return <InGame />;
}
