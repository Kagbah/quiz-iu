"use client"

import { createClient } from "@/utils/supabase/client";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { useRouter } from 'next/navigation'


export default function LobbyCreator() {
  const supabase = createClient();
  const router = useRouter()

  const createLobby = async (lobbyName: string, isPrivate: boolean) => {
    const { data, error  } = await supabase.from("lobbies").insert({ name: lobbyName, private: isPrivate }).select("*");
    if (error) {
      return console.error(error);
    }
    router.push(`/lobby/${data[0].id}`);
  }

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const form = e.target as HTMLFormElement;
      const lobbyName = (form.querySelector('input[type="text"]') as HTMLInputElement).value;
      const isPrivate = (form.querySelector('input[type="checkbox"]') as HTMLInputElement).checked;
      createLobby(lobbyName, isPrivate);
    }}>
      <Input type="text" placeholder="Lobby name" />
      <Input type="checkbox" id="private" name="private" />
      <Label htmlFor="private">Private</Label>
      <Button type="submit">Create</Button>
    </form>
  )
}