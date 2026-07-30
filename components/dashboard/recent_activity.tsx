import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  "Solved Two Sum",
  "Revised Binary Search",
  "Completed Sliding Window",
  "AI generated revision plan",
];

export default function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {activities.map((item) => (
          <div
            key={item}
            className="rounded-lg border p-3"
          >
            {item}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}