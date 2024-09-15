export const runtime = "edge";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Stellt sicher, dass der Button importiert ist
import React from "react";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  // Alle Kategorien abrufen
  const { data: categories, error } = await supabase.from("categories").select("*");

  if (error) {
    console.error("Fehler beim Abrufen der Kategorien:", error);
    return <div>Fehler beim Laden der Kategorien</div>;
  }

  return (
    <div className="flex flex-col items-center p-8">
      {/* Überschrift */}
      <h1 className="text-4xl font-bold text-center mb-8">Fragenkatalog</h1>

      {/* Container für alle Kategorien */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {categories?.map((category) => (
          <div
            key={category.id}
            className="p-6 bg-white border rounded-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            {/* Kategoriename als anklickbarer Button */}
            <h2 className="text-2xl font-semibold mb-4 text-blue-600">
              <Link href={`/categories/${category.id}`}>
                {category.name}
              </Link>
            </h2>
            <p className="text-gray-600 mb-4">
              Dieser Fragenkatalog enthält viele interessante Fragen.
            </p>

            {/* Details Button */}
            <Link href={`/categories/${category.id}`}>
              <Button className="w-full bg-blue-500 text-white">
                Mehr erfahren
              </Button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}