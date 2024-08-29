"use server";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DisplayCategoryCard() {
  const supabase = createClient();
  const { data, count } = await supabase
    .from("categories")
    .select("*", { count: "exact" });
  return (
    <Card className="w-[300px] grow">
      <CardHeader className="pb-2">
        <CardDescription>Kategorien</CardDescription>
        <CardTitle className="text-4xl py-2">{count}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant={"secondary"} className="w-full">
          <Link href="/app/quiz_manager">neue Kategorien erstellen</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
