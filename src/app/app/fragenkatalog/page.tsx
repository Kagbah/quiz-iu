export const runtime = "edge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import CategoryManagement from "@/components/QuizManagement";
// import './CreateQuiz.css';
import QuizManagement from "@/components/QuizManagement";

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
      Fragenkatalog
    </div>
  );
}
