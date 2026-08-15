"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const DAILY_GOAL = 5;

export default function TodaysGoal() {
  const [solvedToday, setSolvedToday] = useState(0);

  useEffect(() => {
    fetchTodayProgress();
  }, []);

  async function fetchTodayProgress() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      const today = new Date();

      const count = problems.filter((problem: any) => {
        if (!problem.solved || !problem.solvedAt) return false;

        const solvedDate = new Date(problem.solvedAt);

        return (
          solvedDate.getFullYear() === today.getFullYear() &&
          solvedDate.getMonth() === today.getMonth() &&
          solvedDate.getDate() === today.getDate()
        );
      }).length;

      setSolvedToday(count);
    } catch (error) {
      console.error("Failed to fetch today's progress:", error);
    }
  }

  const progress = Math.min(
    (solvedToday / DAILY_GOAL) * 100,
    100
  );

  const remaining = Math.max(
    DAILY_GOAL - solvedToday,
    0
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Goal 🎯</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">
          {solvedToday} / {DAILY_GOAL} Problems
        </p>

        <Progress
          value={progress}
          className="mt-5"
        />

        <p className="mt-3 text-sm text-muted-foreground">
          {remaining > 0
            ? `Solve ${remaining} more ${
                remaining === 1 ? "problem" : "problems"
              } to reach today's goal.`
            : "🎉 Today's goal completed!"}
        </p>
      </CardContent>
    </Card>
  );
}