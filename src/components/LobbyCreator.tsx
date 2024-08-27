"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function LobbyCreator() {
  const supabase = createClient();
  const router = useRouter();

  const createLobby = async (lobbyName: string, isPrivate: boolean) => {
    const { data, error } = await supabase
      .from("lobbies")
      .insert({ name: lobbyName, private: isPrivate })
      .select("*");
    if (error) {
      return console.error(error);
    }
    router.push(`/lobby/${data[0].id}`);
  };

  return (
    <form
      className="flex flex-col justify-center gap-4"
      onSubmit={async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const form = e.target as HTMLFormElement;
        const lobbyName = (
          form.querySelector('input[type="text"]') as HTMLInputElement
        ).value;
        const isPrivate = (
          form.querySelector('input[type="checkbox"]') as HTMLInputElement
        ).checked;
        await createLobby(lobbyName, isPrivate);
      }}
    >
      <Input type="text" placeholder="Lobby name" />
      <div className="flex items-center gap-4">
        <Input className="size-4" type="checkbox" id="private" name="private" />
        <Label htmlFor="private">Privat</Label>
      </div>
      <Button type="submit">Erstellen</Button>
    </form>
  );
}
