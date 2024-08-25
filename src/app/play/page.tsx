export const runtime = "edge";

import AuthButton from "@/components/AuthButton";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Header from "@/components/HeaderLoggedIn";
import { Footer } from "@/components/Footer";
import React from 'react';
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
      <div className="w-full">
        <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
          <div className="w-full max-w-4xl flex justify-between items-center p-3 text-sm">
            <AuthButton />
          </div>
        </nav>
      </div>
      <LobbySelector />
      <hr />
      <LobbyCreator />
      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3">
        <Header />
      </div>
      <Footer />
    </div>
  );
}

