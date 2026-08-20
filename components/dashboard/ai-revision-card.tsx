"use client";

import { useEffect, useState } from "react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AIRevisionCard() {
  const [recommendation, setRecommendation] = useState(
    "Checking your revision schedule..."
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateRecommendation();
  }, []);

  async function generateRecommendation() {
    try {
      setLoading(true);

      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const problems = await response.json();

      const aiResponse = await fetch("/api/ai/revision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          problems,
        }),
      });

      if (!aiResponse.ok) {
        throw new Error(
          "Failed to generate revision recommendation"
        );
      }

      const data = await aiResponse.json();

      setRecommendation(
        data.recommendation ||
          "No revision recommendation available."
      );
    } catch (error) {
      console.error(
        "Failed to generate revision recommendation:",
        error
      );

      setRecommendation(
        "Unable to generate revision recommendations right now."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Revision Plan 🔄</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="leading-7 text-muted-foreground">
          {loading
            ? "Checking your revision schedule..."
            : recommendation}
        </p>
      </CardContent>
    </Card>
  );
}