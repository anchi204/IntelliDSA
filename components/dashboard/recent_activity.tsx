"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Activity = {
  id: string;
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
        // Problem solved
        if (problem.solved && problem.solvedAt) {
          activityList.push({
            id: `solved-${problem.id}`,
            text: `Solved "${problem.title}"`,
            date: new Date(problem.solvedAt),
          });
        }

        // Problem created
        if (problem.createdAt) {
          activityList.push({
            id: `created-${problem.id}`,
            text: `Added "${problem.title}"`,
            date: new Date(problem.createdAt),
          });
        }
      });

      // Most recent activities first
      activityList.sort(
        (a, b) => b.date.getTime() - a.date.getTime()
      );

      setActivities(activityList.slice(0, 5));
    } catch (error) {
      console.error(
        "Failed to fetch activities:",
        error
      );
    }
  }

  function formatDate(date: Date) {
    return date.toLocaleString("en-IN", {
      day: "numeric",
      month: "short",
      hour: "numeric",
      minute: "2-digit",
    });
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
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div>
                <p className="font-medium">
                  {activity.text}
                </p>

                <p className="mt-1 text-xs text-muted-foreground">
                  {formatDate(activity.date)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}