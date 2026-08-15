"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Activity = {
  id: number;
  text: string;
  date: Date;
};

export default function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      const activityList: Activity[] = [];

      problems.forEach((problem: any) => {
        // Solved activity
        if (problem.solved && problem.solvedAt) {
          activityList.push({
            id: problem.id * 10,
            text: `Solved ${problem.title}`,
            date: new Date(problem.solvedAt),
          });
        }

        // Created activity
        if (problem.createdAt) {
          activityList.push({
            id: problem.id * 10 + 1,
            text: `Added ${problem.title}`,
            date: new Date(problem.createdAt),
          });
        }
      });

      activityList.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      setActivities(activityList.slice(0, 5));
    } catch (error) {
      console.error("Failed to fetch activities:", error);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        {activities.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No recent activity yet.
          </p>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-lg border p-3"
            >
              <p className="font-medium">
                {activity.text}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {activity.date.toLocaleString()}
              </p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}