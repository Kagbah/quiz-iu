// components/LobbyCreator.tsx
"use client";

import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "./ui/select";

export default function LobbyCreator() {
  const [lobbyName, setLobbyName] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [mode, setMode] = useState<"ffa" | "team">("ffa");
  const supabase = createClient();
  const router = useRouter();

  const createLobby = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    const { data, error } = await supabase
      .from("lobbies")
      .insert({
        name: lobbyName,
        private: isPrivate,
        created_by: user.id,
        mode,
        maxPlayers: mode === "ffa" ? 4 : 2,
      })
      .select("*")
      .single();

    if (error) {
      console.error("Error creating lobby:", error);
    } else if (data) {
      // Join the newly created lobby
      await supabase
        .from("lobbies_user")
        .insert({ user_id: user.id, lobbies_id: data.id });

      router.push(`/app/play/${data.id}`);
    }
  };

  return (
    <form className="flex flex-col justify-center gap-4" onSubmit={createLobby}>
      <Input
        type="text"
        placeholder="Lobby name"
        value={lobbyName}
        onChange={(e) => setLobbyName(e.target.value)}
      />
      <div className="flex items-center gap-4">
        <Input
          className="size-4"
          type="checkbox"
          id="private"
          name="private"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        <Label htmlFor="private">Private</Label>
      </div>
      <Select onValueChange={(value) => setMode(value as "ffa" | "team")}>
        <SelectTrigger>
          <SelectValue placeholder="Select game mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ffa">Free-for-All</SelectItem>
          <SelectItem value="team">Team</SelectItem>
        </SelectContent>
      </Select>
      <Button type="submit">Create Lobby</Button>
    </form>
  );
}
