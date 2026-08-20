"use client";

import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Target,
} from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Stats = {
  total: number;
  solved: number;
  unsolved: number;
  easy: number;
  medium: number;
  hard: number;
  revisionDue: number;
};

export default function ProfilePage() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    solved: 0,
    unsolved: 0,
    easy: 0,
    medium: 0,
    hard: 0,
    revisionDue: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      const now = new Date();

      setStats({
        total: problems.length,

        solved: problems.filter(
          (problem: any) => problem.solved
        ).length,

        unsolved: problems.filter(
          (problem: any) => !problem.solved
        ).length,

        easy: problems.filter(
          (problem: any) => problem.difficulty === "Easy"
        ).length,

        medium: problems.filter(
          (problem: any) => problem.difficulty === "Medium"
        ).length,

        hard: problems.filter(
          (problem: any) => problem.difficulty === "Hard"
        ).length,

        revisionDue: problems.filter(
          (problem: any) =>
            problem.revisionDate &&
            new Date(problem.revisionDate) <= now &&
            problem.revisionCount < problem.maxRevisions
        ).length,
      });
    } catch (error) {
      console.error("Failed to fetch profile stats:", error);
    }
  }

  const solvingPercentage =
    stats.total === 0
      ? 0
      : Math.round((stats.solved / stats.total) * 100);

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <Card>
        <CardContent className="flex flex-col items-center gap-5 p-8 sm:flex-row">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted text-3xl font-bold">
            A
          </div>

          <div>
            <h1 className="text-2xl font-bold">
              Aanchi Kansal
            </h1>

            <p className="text-sm text-muted-foreground">
              IntelliDSA Learner
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              Keep solving. Keep improving. 🚀
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-6">
            <BookOpen className="h-5 w-5" />

            <p className="mt-4 text-sm text-muted-foreground">
              Total Problems
            </p>

            <p className="mt-1 text-3xl font-bold">
              {stats.total}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CheckCircle2 className="h-5 w-5" />

            <p className="mt-4 text-sm text-muted-foreground">
              Solved
            </p>

            <p className="mt-1 text-3xl font-bold">
              {stats.solved}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <CircleAlert className="h-5 w-5" />

            <p className="mt-4 text-sm text-muted-foreground">
              Unsolved
            </p>

            <p className="mt-1 text-3xl font-bold">
              {stats.unsolved}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <Target className="h-5 w-5" />

            <p className="mt-4 text-sm text-muted-foreground">
              Solving Progress
            </p>

            <p className="mt-1 text-3xl font-bold">
              {solvingPercentage}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Difficulty Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Difficulty Breakdown</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">
              Easy
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.easy}
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">
              Medium
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.medium}
            </p>
          </div>

          <div className="rounded-lg border p-5">
            <p className="text-sm text-muted-foreground">
              Hard
            </p>

            <p className="mt-2 text-2xl font-bold">
              {stats.hard}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Revision */}
      <Card>
        <CardHeader>
          <CardTitle>Revision Progress</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-2xl font-bold">
            {stats.revisionDue}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Problems currently due for revision
          </p>
        </CardContent>
      </Card>
    </div>
  );
}