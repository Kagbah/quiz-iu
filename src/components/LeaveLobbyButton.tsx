"use client";

import { leaveLobby } from "@/actions/leave-lobby";
import { Button } from "@/components/ui/button";
import { ComponentProps } from "react";

type Props = Omit<ComponentProps<"button">, "onClick"> & {
  userId: string;
};

export default function LeaveLobbyButton({ userId, ...props }: Props) {
  const handleLeaveLobby = async () => {
    await leaveLobby(userId);
  };

  return (
    <Button variant={"secondary"} onClick={handleLeaveLobby} {...props}>
      Lobby verlassen
    </Button>
  );
}
