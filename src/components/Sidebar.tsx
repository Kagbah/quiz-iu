"use client";

import { Avatar } from "@/components/ui/avatar";

export default function Sidebar() {
  return (
    <div className="flex flex-col w-[300px] border-r border-border min-h-screen p-4">
      <div>Play</div>
      <div className="grow">Menu</div>
      <div>Settings</div>
      <div>
        <Avatar></Avatar>
      </div>
    </div>
  );
}
