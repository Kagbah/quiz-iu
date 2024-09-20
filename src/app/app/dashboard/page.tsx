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

  if (!user) {
    return redirect("/login");
  }

  const { data: categories, error } = await supabase
    .from("categories")
    .select("*")
    .limit(5);

  if (error) {
    console.error("Fehler beim Abrufen der Kategorien:", error);
  }

  return (
    <div className="flex flex-col items-center gap-8 justify-between p-8 h-full">
      <h1 className="text-3xl font-bold text-center">Dashboard</h1>

      <Link href="/app/play">
        <Button
          className="px-12 py-8 text-lg font-semibold"
          variant={"default"}
        >
          Jetzt spielen
        </Button>
      </Link>

      <div className="w-full p-8">
        <h2 className="text-xl font-bold text-center mb-6">
          Kategorien entdecken
        </h2>
        <div className="flex flex-wrap gap-6 justify-center">
          {categories?.map((category) => (
            <div key={category.id}>
              <Link href={`/app/categories/${category.id}`} passHref>
                <Button
                  variant="secondary"
                  className="w-full text-secondary-foreground p-6"
                >
                  <h3>{category.name}</h3>
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
