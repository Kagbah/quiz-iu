"use server";

import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user)

  if (!user) {
    return redirect("/login");
  }

  // Kategorien abfragen, aber nur die ersten 5
  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .limit(5);

  if (error) {
    console.error("Fehler beim Abrufen der Kategorien:", error);
  }

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      {/* Flex Container für alle Dashboard-Elemente */}
      <div className="flex flex-col items-center space-y-12">
        <h1 className="text-4xl font-bold text-center">Dashboard</h1>

  
        {/* Container für Kategorien (Fragenkatalog) */}
        <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-lg">
          <h2 className="text-3xl font-bold text-center mb-6">Fragenkatalog</h2>
          <div className="grid grid-cols-1 gap-6">
            {categories?.map((category) => (
              <div key={category.id} className="p-6 bg-gray-100 border rounded-lg shadow">
                <h3 className="text-2xl font-semibold text-blue-600 mb-4">
                  <Link href={`/app/categories/${category.id}`}>
                    {category.name}
                  </Link>
                </h3>
                <p className="text-gray-600">
                  Diese Kategorie enthält Fragen für den Fragenkatalog.
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Andere Dashboard-Elemente (Quizmanager, Profile, Settings, Admin Dashboard) */}
        <div className="flex flex-wrap justify-center gap-8 w-full max-w-3xl">
          <Link href="/app/quiz_manager">
            <Button className="w-48 p-6 text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
              Quizmanager
            </Button>
          </Link>
          <Link href="/app/profile">
            <Button className="w-48 p-6 text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
              Profile
            </Button>
          </Link>
          <Link href="/app/settings">
            <Button className="w-48 p-6 text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
              Settings
            </Button>
          </Link>
          <Link href="/app/admin-dashboard">
            <Button className="w-48 p-6 text-xl bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow">
              Admin-Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}