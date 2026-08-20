"use client";

import StatCard from "@/components/dashboard/stat-card";
import Greeting from "@/components/dashboard/greeting";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import TodaysGoal from "@/components/dashboard/todays-goal";
import AIInsightCard from "@/components/dashboard/ai-insight-card";
import RecentActivity from "@/components/dashboard/recent_activity";
import AIRevisionCard from "@/components/dashboard/ai-revision-card";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
} from "lucide-react";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    unsolved: 0,
    revisionDue: 0,
    easy: 0,
    medium: 0,
    hard: 0,
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

        solved: problems.filter((p: any) => p.solved).length,

        unsolved: problems.filter((p: any) => !p.solved).length,

        revisionDue: problems.filter(
          (p: any) =>
            p.revisionDate &&
            new Date(p.revisionDate) <= now &&
            p.revisionCount < p.maxRevisions
        ).length,

        easy: problems.filter(
          (p: any) => p.difficulty === "Easy"
        ).length,

        medium: problems.filter(
          (p: any) => p.difficulty === "Medium"
        ).length,

        hard: problems.filter(
          (p: any) => p.difficulty === "Hard"
        ).length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  }

  return (
    <div className="space-y-8">
      <Greeting />

      {/* Main Stats */}
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Problems"
          value={stats.total}
          subtitle="All tracked problems"
          icon={BookOpen}
        />

        <StatCard
          title="Solved"
          value={stats.solved}
          subtitle="Problems solved"
          icon={CheckCircle2}
        />

        <StatCard
          title="Unsolved"
          value={stats.unsolved}
          subtitle="Problems remaining"
          icon={CircleAlert}
        />

        <StatCard
          title="Revision Due"
          value={stats.revisionDue}
          subtitle="Problems to revise"
          icon={CircleAlert}
        />
      </div>

      {/* Difficulty Breakdown */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Easy
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.easy}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Easy problems
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Medium
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.medium}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Medium problems
          </p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Hard
          </p>

          <p className="mt-2 text-3xl font-bold">
            {stats.hard}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Hard problems
          </p>
        </div>
      </div>

      {/* Charts and Insights */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyChart />
        </div>

        <div className="space-y-6">
          <TodaysGoal />
          <AIInsightCard />
          <AIRevisionCard />
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity />
    </div>
  );
}