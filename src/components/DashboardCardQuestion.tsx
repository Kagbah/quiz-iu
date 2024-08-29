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

export default async function DisplayQuestionCard() {
  const supabase = createClient();
  const { data, count } = await supabase
    .from("questions")
    .select("*", { count: "exact" });
  return (
    <Card className="w-[300px] grow">
      <CardHeader className="pb-2">
        <CardDescription>Quizfragen</CardDescription>
        <CardTitle className="text-4xl py-2">{count}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button variant={"secondary"} className="w-full">
          <Link href="/app/fragenkatalog">zum Fragenkatalog</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
