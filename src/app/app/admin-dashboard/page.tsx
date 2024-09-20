"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DisplayPieChart from "@/components/ChartPie";
import DisplayRadialChart from "@/components/ChartRadial";
import DisplayQuestionCard from "@/components/DashboardCardQuestion";
import DisplayUsersCard from "@/components/DashboardCardUsers";
import { Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.role !== "authenticated") {
    return redirect("/login");
  }

  // Kürzlich hinzugefügte Fragen
  const { data: recentQuestions, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col p-8 gap-8">
      <h1 className="text-xl md:text-3xl font-bold text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
        <DisplayUsersCard></DisplayUsersCard>
        <DisplayQuestionCard></DisplayQuestionCard>
      </div>

      <div className="flex flex-wrap gap-8 justify-center">
        <DisplayPieChart />

        <DisplayRadialChart />
      </div>
    </div>
  );
}
