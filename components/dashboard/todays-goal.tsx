import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function TodaysGoal() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Goal 🎯</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-3xl font-bold">
          3 / 5 Problems
        </p>

        <Progress value={60} className="mt-5" />

        <p className="mt-3 text-sm text-muted-foreground">
          Solve 2 more problems to reach today's goal.
        </p>
      </CardContent>
    </Card>
  );
}