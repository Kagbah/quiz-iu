"use client"

import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Tables } from "@/types/database.types";

let lobbiesType: Tables<'lobbies'>;

export default function LobbySelector() {
  const supabase = createClient();

  const [lobbies, setLobbies] = useState<Array<typeof lobbiesType>>([]);

  const fetchLobbies = async () => {
    const { data, error } = await supabase.from('lobbies').select('*').eq('private', false);
    console.log(data);
    console.error(error);
    if (error) {
      console.error(error);
    } else {
      setLobbies(data);
    }
  };

  useEffect(() => {
    fetchLobbies();
  }, []);
   
  supabase
    .channel('schema-db-changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'lobbies'
      },
      (payload) => {
        if (payload.eventType === 'DELETE') {
          setLobbies(lobbies.filter((lobby) => lobby.id !== payload.old.id));
          return;
        }
        if (payload.eventType === "UPDATE") {
          setLobbies(lobbies.map((lobby) => {
            if (lobby.id === payload.new.id) {
              return payload.new as typeof lobbiesType;
            }
            return lobby;
          }));
          return;
        }
        if (payload.eventType === "INSERT") {
          const newLobby = payload.new as typeof lobbiesType;
          if (!newLobby.private) {
            setLobbies([...lobbies, newLobby]);
          }
          return;
        }
      }
    )
    .subscribe()

  return (
    <div>
      <h1>Lobby Selector</h1>
      <ul>
        {lobbies.map((lobby) => (
          <li key={lobby.id}><Link href={`/join/${lobby.id}`}>{lobby.name} | 0/{lobby.maxPlayers}</Link></li>
        ))}
      </ul>
    </div>
  );
}