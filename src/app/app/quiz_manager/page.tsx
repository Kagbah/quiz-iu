export const runtime = "edge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import CategoryManagement from "@/components/QuizManagement";
// import './CreateQuiz.css';

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center p-8">
      <div className="flex-1 flex flex-col gap-8 md:min-w-[420px] max-w-4xl px-3 justify-center">
        {" "}
        <h2 className="font-bold text-3xl text-foreground text-center">
          Quiz erstellen
        </h2>
        <CategoryManagement />
      </div>
    </div>
  );
}
