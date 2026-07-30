import StatCard from "@/components/dashboard/stat-card";
import { dashboardStats } from "@/constants/dashboard";
import Greeting from "@/components/dashboard/greeting";
import WeeklyChart from "@/components/dashboard/weekly-chart";
import TodaysGoal from "@/components/dashboard/todays-goal";
import AIInsightCard from "@/components/dashboard/ai-insight-card";
import RecentActivity from "@/components/dashboard/recent_activity";


export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <Greeting />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={stat.icon}
          />
        ))}
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