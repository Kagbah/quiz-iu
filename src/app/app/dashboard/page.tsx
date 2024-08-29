"use server";

import { ChartPie, TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import DisplayCategoryCard from "@/components/DashboardCardCategory";
import DisplayQuestionCard from "@/components/DashboardCardQuestion";
const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
];

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const questions = await supabase.from("questions").select("*");
  return (
    <div className="flex flex-wrap gap-8 p-8">
      <div className="flex flex-col gap-8">
        <DisplayCategoryCard></DisplayCategoryCard>
        <DisplayQuestionCard></DisplayQuestionCard>
      </div>
    </div>
  );
}
