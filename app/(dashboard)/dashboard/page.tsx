"use client";
import StatCard from "@/components/dashboard/stat-card";
import Greeting from "@/components/dashboard/greeting";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import TodaysGoal from "@/components/dashboard/todays-goal";
import AIInsightCard from "@/components/dashboard/ai-insight-card";
import RecentActivity from "@/components/dashboard/recent_activity";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  CircleAlert,
  Star,
} from "lucide-react";


export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    solved: 0,
    unsolved: 0,
    favorites: 0,
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

      setStats({
        total: problems.length,
        solved: problems.filter((p: any) => p.solved).length,
        unsolved: problems.filter((p: any) => !p.solved).length,
        favorites: problems.filter((p: any) => p.favorite).length,
      });
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
    }
  }
  return (
    <div className="space-y-8">
      <Greeting />

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
          title="Favorites"
          value={stats.favorites}
          subtitle="Saved for revision"
          icon={Star}
        />
      </div>
        <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <WeeklyChart />
        </div>
        <div className="space-y-6">
          <TodaysGoal />
          <AIInsightCard />
        </div>
      </div>
      <RecentActivity />
    </div>
  );
}