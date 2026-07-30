import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AIInsightCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Insight 🧠</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground leading-7">
          You've solved many Array problems recently.
          Consider revising Graphs and Dynamic Programming to improve retention.
        </p>
      </CardContent>
    </Card>
  );
}