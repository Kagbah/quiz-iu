export const runtime = "edge";

import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/HeaderLoggedIn";
import { Footer } from "@/components/Footer";
import React from "react";
import LobbySelector from "@/components/LobbySelector";
import LobbyCreator from "@/components/LobbyCreator";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="flex-1 flex flex-col gap-8 max-w-4xl px-3 justify-center">
        <LobbySelector />
        <LobbyCreator />
        <hr />
      </div>
    </div>
  );
}
