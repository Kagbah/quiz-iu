"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function DisplayCard() {
  return (
    <Card className="w-[300px] grow">
      <CardHeader className="pb-2">
        <CardDescription>Kategorien / Quizfragen</CardDescription>
        <CardTitle className="text-4xl">400</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-xs text-muted-foreground">da geht noch mehr!</div>
      </CardContent>
    </Card>
  );
}
