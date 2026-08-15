"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type WeeklyData = {
  day: string;
  solved: number;
};

export default function WeeklyChart() {
  const [weeklyData, setWeeklyData] = useState<WeeklyData[]>([]);

  useEffect(() => {
    fetchWeeklyData();
  }, []);

  async function fetchWeeklyData() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      const today = new Date();

      const data: WeeklyData[] = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);

        const dayName = date.toLocaleDateString("en-US", {
          weekday: "short",
        });

        const count = problems.filter((problem: any) => {
          if (!problem.solved || !problem.solvedAt) return false;

          const solvedDate = new Date(problem.solvedAt);

          return (
            solvedDate.getFullYear() === date.getFullYear() &&
            solvedDate.getMonth() === date.getMonth() &&
            solvedDate.getDate() === date.getDate()
          );
        }).length;

        data.push({
          day: dayName,
          solved: count,
        });
      }

      setWeeklyData(data);
    } catch (error) {
      console.error("Failed to fetch weekly data:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Progress</CardTitle>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weeklyData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="day" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="solved"
              radius={8}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}