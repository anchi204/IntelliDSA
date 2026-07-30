import StatCard from "@/components/dashboard/stat-card";
import { dashboardStats } from "@/constants/dashboard";
import Greeting from "@/components/dashboard/greeting";

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
    </div>
  );
}