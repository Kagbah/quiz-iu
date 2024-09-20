"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";
import { TrendingUp, Users } from "lucide-react";

export default async function DisplayCategoryCard() {
  const supabase = createClient();
  // Fragen- und Kategoriedaten
  const { data: categories, error: categoryError } = await supabase
    .from("categories")
    .select("id, name, questions(id)");

  const totalQuestions =
    categories?.reduce((acc, category) => acc + category.questions.length, 0) ||
    0;
  const mostActiveCategory =
    categories?.sort((a, b) => b.questions.length - a.questions.length)[0] ||
    null;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 mb-4">
          <TrendingUp className="size-8 text-green-600"></TrendingUp>
          <p className="text-base">Fragen- und Kategorienstatistiken</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <p>Anzahl der Fragen gesamt:</p>
          <p className="font-bold">{totalQuestions}</p>
        </div>
        <div className="flex gap-1">
          <p>Aktivste Kategorie:</p>
          <p className="font-bold">
            {mostActiveCategory?.name} ({mostActiveCategory?.questions.length}{" "}
            Fragen)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
