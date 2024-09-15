"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DisplayPieChart from "@/components/ChartPie";
import DisplayRadialChart from "@/components/ChartRadial";
import DisplayQuestionCard from "@/components/DashboardCardQuestion";
import DisplayCategoryCard from "@/components/DashboardCardCategory";
import { Users, TrendingUp } from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || user.role !== "authenticated") {
    return redirect("/login");
  }

  // Benutzerstatistiken
  const { data: users, error: userError } = await supabase.from("user_role").select("*");
  const totalUsers = users?.length || 0;

  // Fragen- und Kategoriedaten
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, questions(id)");

  const totalQuestions = categories?.reduce((acc, category) => acc + category.questions.length, 0) || 0;
  const mostActiveCategory = categories?.sort((a, b) => b.questions.length - a.questions.length)[0] || null;

  // Kürzlich hinzugefügte Fragen
  const { data: recentQuestions, error: questionError } = await supabase
    .from("questions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="flex flex-col p-8 space-y-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Dashboard</h1>

      {/* Benutzerstatistiken */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="shadow-lg p-6 bg-white rounded-lg">
          <div className="flex items-center space-x-4">
            <Users className="h-8 w-8 text-blue-600" />
            <h2 className="text-xl font-bold">Benutzerstatistiken</h2>
          </div>
          <p className="text-lg mt-4">Gesamtanzahl der Benutzer: {totalUsers}</p>
        </div>

        {/* Fragenstatistiken */}
        <div className="shadow-lg p-6 bg-white rounded-lg">
          <div className="flex items-center space-x-4">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <h2 className="text-xl font-bold">Fragen- und Kategorienstatistiken</h2>
          </div>
          <p className="text-lg mt-4">Gesamtanzahl der Fragen: {totalQuestions}</p>
          <p className="text-lg">
            Aktivste Kategorie: {mostActiveCategory?.name} ({mostActiveCategory?.questions.length} Fragen)
          </p>
        </div>
      </div>

      {/* Kürzlich hinzugefügte Fragen */}
      <div className="shadow-lg p-6 bg-white rounded-lg">
        <h2 className="text-xl font-bold mb-4">Kürzlich hinzugefügte Fragen</h2>
        <ul className="list-disc list-inside space-y-2">
          {recentQuestions?.map((question) => (
            <li key={question.id} className="text-gray-700">
              {question.questionText}
            </li>
          ))}
        </ul>
      </div>

      {/* Diagramme */}
      <div className="flex flex-wrap gap-8 justify-center">
        {/* Benutzerstatistik */}
        <DisplayPieChart />

        {/* Andere Diagramme */}
        <DisplayRadialChart />
      </div>
    </div>
  );
}