import StatCard from "@/components/dashboard/stat-card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">
        Dashboard
      </h1>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Problems Solved" value="128" />
        <StatCard title="Current Streak" value="14 Days" />
        <StatCard title="Revision Due" value="9" />
        <StatCard title="AI Insights" value="4" />
      </div>
    </div>
  );
}