"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AIInsightCard() {
  const [insight, setInsight] = useState(
    "Analyzing your problem-solving activity..."
  );

  useEffect(() => {
    fetchInsight();
  }, []);

  async function fetchInsight() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      if (problems.length === 0) {
        setInsight(
          "Start solving problems to get personalized insights."
        );
        return;
      }

      const solvedProblems = problems.filter(
        (problem: any) => problem.solved
      );

      if (solvedProblems.length === 0) {
        setInsight(
          "You haven't solved any problems yet. Start with an Easy problem and build your consistency."
        );
        return;
      }

      // Count solved problems by topic
      const topicCount: Record<string, number> = {};

      solvedProblems.forEach((problem: any) => {
        topicCount[problem.topic] =
          (topicCount[problem.topic] || 0) + 1;
      });

      const strongestTopic = Object.entries(topicCount).sort(
        (a, b) => b[1] - a[1]
      )[0];

      const unsolvedProblems = problems.filter(
        (problem: any) => !problem.solved
      );

      if (unsolvedProblems.length > 0) {
        setInsight(
          `You've solved ${solvedProblems.length} ${
            solvedProblems.length === 1 ? "problem" : "problems"
          } so far. ${strongestTopic[0]} is currently your strongest topic. Keep practicing your ${unsolvedProblems.length} remaining problems to build consistency.`
        );
      } else {
        setInsight(
          `Great work! You've solved all ${solvedProblems.length} problems in your tracker. ${strongestTopic[0]} is your strongest topic right now.`
        );
      }
    } catch (error) {
      console.error("Failed to generate insight:", error);

      setInsight(
        "Unable to generate insights right now."
      );
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insight 🧠</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="leading-7 text-muted-foreground">
          {insight}
        </p>
      </CardContent>
    </Card>
  );
}