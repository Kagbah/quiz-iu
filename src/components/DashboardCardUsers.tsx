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
import { Users } from "lucide-react";

export default async function DisplayCategoryCard() {
  const supabase = createClient();
  const { data: users, error: userError } = await supabase
    .from("user_role")
    .select("*");
  const totalUsers = users?.length || 0;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-4 mb-4">
          <Users className="size-8 text-blue-500"></Users>
          <p className="text-base">Benutzerstatistiken</p>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <p>Registrierte Nutzer gesamt:</p>
          <p className="font-bold">{totalUsers}</p>
        </div>
      </CardContent>
    </Card>
  );
}
