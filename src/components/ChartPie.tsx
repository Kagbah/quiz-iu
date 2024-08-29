"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Label, Pie, PieChart } from "recharts";

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
import { createClient } from "@/utils/supabase/client";

const chartConfig = {
  count: {
    label: "Benutzer",
  },
  admin: {
    label: "Admin",
    color: "hsl(var(--chart-5))",
  },
  user: {
    label: "User",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export default function DisplayPieChart() {
  const [chartData, setChartData] = useState([
    { type: "admin", count: 0, fill: "var(--color-admin)" },
    { type: "user", count: 0, fill: "var(--color-user)" },
  ]);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("user_role")
        .select("role:role(description)");

      if (data) {
        const adminUsers = data.filter((e) => e.role?.description == "admin");
        const users = data.filter((e) => e.role?.description == "user");

        const newChartData = [
          {
            type: "admin",
            count: adminUsers.length,
            fill: "var(--color-admin)",
          },
          { type: "user", count: users.length, fill: "var(--color-user)" },
        ];

        setChartData(newChartData);
        setTotalUsers(newChartData.reduce((acc, curr) => acc + curr.count, 0));
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Nutzer</CardTitle>
        <CardDescription>alle Registrierten Nutzer</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="type"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          Nutzer
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Aufteilung in Admin und normale Nutzer
        </div>
      </CardFooter>
    </Card>
  );
}
