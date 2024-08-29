"use client";

import { TrendingUp } from "lucide-react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

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
import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { count } from "console";

const chartConfig = {
  public: {
    label: "Öffentlich",
    color: "hsl(var(--chart-2))",
  },
  private: {
    label: "Privat",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

export default function DisplayPieChart() {
  const [chartData, setChartData] = useState([{ private: 0, public: 0 }]);
  const [totalLobbies, setTotalLobbies] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();

      const { data, error } = await supabase
        .from("lobbies")
        .select("*", { count: "exact" });

      if (data) {
        const publicLobbies = data.filter((e) => !e.private);
        const privateLobbies = data.filter((e) => e.private);

        const newChartData = [
          {
            public: publicLobbies.length,
            private: privateLobbies.length,
          },
        ];

        setChartData(newChartData);
        setTotalLobbies(newChartData[0].public + newChartData[0].private);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Verfügbare Lobbies</CardTitle>
        <CardDescription>alle derzeit Verfügbaren Lobbies</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square w-full max-w-[250px]"
        >
          <RadialBarChart
            data={chartData}
            endAngle={180}
            innerRadius={80}
            outerRadius={130}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 16}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {totalLobbies.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Lobbies
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="public"
              stackId="a"
              cornerRadius={5}
              fill="var(--color-public)"
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="private"
              fill="var(--color-private)"
              stackId="a"
              cornerRadius={5}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Aufteilung in öffentliche und private Lobbies.
        </div>
      </CardFooter>
    </Card>
  );
}
