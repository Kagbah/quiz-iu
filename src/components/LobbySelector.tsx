"use client";

import { Tables } from "@/types/database.types";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";

type Lobby = Tables<"lobbies"> & {
  connectedPlayers: Array<{ count: number }>;
};

export default function LobbySelector() {
  const supabase = createClient();

  const [lobbies, setLobbies] = useState<Array<Lobby>>([]);

  const fetchLobbies = async () => {
    const { data, error } = await supabase
      .from("lobbies")
      .select(
        `
      *,
      connectedPlayers:lobbies_user(count)
    `
      )
      .eq("private", false)
      .returns<Lobby[]>();
    if (error) {
      console.error(error);
    } else {
      console.log(data);
      setLobbies(data);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);

  supabase
    .channel("lobbies-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lobbies",
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          setLobbies(lobbies.filter((lobby) => lobby.id !== payload.old.id));
          return;
        }
        if (payload.eventType === "UPDATE") {
          setLobbies(
            lobbies.map((lobby) => {
              if (lobby.id === payload.new.id) {
                return payload.new as Lobby;
              }
              return lobby;
            })
          );
          return;
        }
        if (payload.eventType === "INSERT") {
          const newLobby = payload.new as Lobby;
          if (!newLobby.private) {
            setLobbies([...lobbies, newLobby]);
          }
          return;
        }
      }
    )
    .subscribe();

  supabase
    .channel("lobbies-user-changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "lobbies_user",
      },
      (payload) => {
        if (payload.eventType === "DELETE") {
          setLobbies(
            lobbies.map((lobby) => {
              if (lobby.id === payload.old.lobbies_id) {
                return {
                  ...lobby,
                  connectedPlayers: [
                    {
                      count: lobby.connectedPlayers[0].count - 1,
                    },
                  ],
                };
              }
              return lobby;
            })
          );
          return;
        }
        if (payload.eventType === "INSERT") {
          setLobbies(
            lobbies.map((lobby) => {
              if (lobby.id === payload.new.lobbies_id) {
                return {
                  ...lobby,
                  connectedPlayers: [
                    {
                      count: lobby.connectedPlayers[0].count + 1,
                    },
                  ],
                };
              }
              return lobby;
            })
          );
          return;
        }
      }
    )
    .subscribe();

  return (
    <div>
      <h1 className="font-bold text-3xl text-foreground">Lobby erstellen</h1>
      <ul>
        {lobbies.map((lobby) => {
          const isLobbyFull =
            lobby.connectedPlayers[0].count >= lobby.maxPlayers;
          return (
            <li key={lobby.id}>
              {isLobbyFull ? (
                <span className="disabled-link">
                  {lobby.name} | {lobby.connectedPlayers[0].count}/
                  {lobby.maxPlayers}
                </span>
              ) : (
                <Link href={`/app/play/${lobby.id}`}>
                  {lobby.name} | {lobby.connectedPlayers[0].count}/
                  {lobby.maxPlayers}
                </Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
