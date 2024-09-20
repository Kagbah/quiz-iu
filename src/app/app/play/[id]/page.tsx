"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

function LobbyPage() {
  const { id: lobbyIdParam } = useParams();
  const router = useRouter();
  const [lobby, setLobby] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedGameMode, setSelectedGameMode] = useState<
    "vs" | "team" | null
  >(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const supabase = createClient();
  const id = Array.isArray(lobbyIdParam) ? lobbyIdParam[0] : lobbyIdParam;

  useEffect(() => {
    const initialize = async () => {
      await fetchPlayerId();
      await joinLobby();
      fetchLobbyDetails();
      fetchCategories();
    };
    initialize();
  }, [id, playerId]);

  useEffect(() => {
    const channel = supabase
      .channel(`lobby:${id}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "lobbies_user" },
        (payload) => {
          fetchLobbyDetails();
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "lobbies_user" },
        (payload) => {
          fetchLobbyDetails();
        }
      )
      .on("broadcast", { event: "start_game" }, ({ payload }) => {
        if (payload.lobbyId && payload.gameMode) {
          router.push(
            `/app/play/ingame?mode=multiplayer&lobbyId=${payload.lobbyId}&gameMode=${payload.gameMode}`
          );
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  const fetchLobbyDetails = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select(
        `
        *,
        connectedPlayers:lobbies_user(count)
      `
      )
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching lobby details:", error);
    } else if (data) {
      setLobby(data);
    }
  };

  const fetchCategories = async () => {
    const { data, error } = await supabase.from("categories").select("*");
    if (error) {
      console.error("Error fetching categories:", error);
    } else {
      setCategories(data || []);
    }
  };

  const fetchPlayerId = async () => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error) {
      console.error("Error fetching user ID:", error);
    } else if (user) {
      setPlayerId(user.id);
    } else {
    }
  };

  const joinLobby = async () => {
    if (playerId) {
      try {
        const { data: existingEntries, error: checkError } = await supabase
          .from("lobbies_user")
          .select("*")
          .eq("lobbies_id", parseInt(id, 10))
          .eq("user_id", playerId);

        if (checkError) {
          console.error("Error checking existing lobby entries:", checkError);
          return;
        }

        if (existingEntries.length === 0) {
          const { data, error } = await supabase
            .from("lobbies_user")
            .upsert([{ lobbies_id: parseInt(id, 10), user_id: playerId }], {
              onConflict: "lobbies_id,user_id",
            });

          if (error) {
            console.error("Error joining lobby ", error);
          } else {
            fetchLobbyDetails();
          }
        } else {
        }
      } catch (error) {
        console.error("Unexpected error joining lobby:", error);
      }
    }
  };

  const leaveLobby = async () => {
    if (playerId) {
      try {
        const { error, data } = await supabase
          .from("lobbies_user")
          .delete()
          .eq("lobbies_id", id)
          .eq("user_id", playerId)
          .select();

        if (error) {
          console.error("Error leaving lobby:", error);
        } else {
          setTimeout(() => {
            router.push("/app/play");
          }, 200);
        }
      } catch (error) {
        console.error("Unexpected error leaving lobby:", error);
      }
    } else {
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(Number(categoryId));
  };

  const fetchQuestions = async (categoryId: number) => {
    try {
      const { data, error } = await supabase
        .from("questions")
        .select("*")
        .eq("categoryId", categoryId);

      if (error) {
        console.error("Error fetching questions:", error);
        return [];
      }

      if (data && data.length > 0) {
        const shuffled = data.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, Math.min(5, shuffled.length));
      } else {
        console.error("No questions found for this category.");
        return [];
      }
    } catch (error) {
      console.error("Unexpected error fetching questions:", error);
      return [];
    }
  };

  const startGame = async () => {
    if (selectedCategory && selectedGameMode) {
      const questions = await fetchQuestions(selectedCategory);
      for (const question of questions) {
        try {
          await supabase.from("lobbies_questions").insert({
            lobbiesId: Number(id),
            questionsId: question.id,
          });
        } catch (error) {}
      }

      await supabase.channel(`lobby:${id}`).send({
        type: "broadcast",
        event: "start_game",
        payload: {
          lobbyId: id,
          gameMode: selectedGameMode,
        },
      });
    }
  };

  const addUniquePlayer = (players: string[], newPlayer: string): string[] => {
    return players.includes(newPlayer) ? players : [...players, newPlayer];
  };

  if (!lobby) {
    return <div>Loading lobby...</div>;
  }

  return (
    <div className="flex flex-col gap-8 items-center p-8 my-auto">
      <div>
        <h1 className="text-2xl font-bold mb-2">{lobby.name}</h1>
        <p>
          Spieler: {lobby.connectedPlayers[0].count}/{lobby.maxPlayers}
        </p>
      </div>
      <div className="flex flex-col mx-auto items-center gap-4">
        <Select onValueChange={handleCategorySelect}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Wähle eine Kategorie" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.id.toString()}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-center text-sm">Wähle einen Spielmodus:</p>
        <div className="flex gap-4">
          <Button
            variant={"outline"}
            className="w-36"
            onClick={() => setSelectedGameMode("vs")}
            disabled={selectedGameMode === "vs"}
          >
            Versus-Modus
          </Button>
          <Button
            variant={"outline"}
            className="w-36"
            onClick={() => setSelectedGameMode("team")}
            disabled={selectedGameMode === "team"}
          >
            Team-Modus
          </Button>
        </div>
      </div>
      <Button
        className="min-w-36 mb-16 p-6"
        onClick={startGame}
        disabled={selectedCategory === null || selectedGameMode === null}
      >
        Quiz starten
      </Button>
      <Button variant="destructive" onClick={leaveLobby}>
        Lobby verlassen
      </Button>
    </div>
  );
}

export default LobbyPage;
