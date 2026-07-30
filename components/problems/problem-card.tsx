import { Problem } from "@/types/problem";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  return (
    <Card className="transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">
              {problem.title}
            </h2>

            <p className="text-sm text-muted-foreground mt-1">
              {problem.platform} • {problem.topic}
            </p>
          </div>

          <Star
            className={`h-5 w-5 ${
              problem.favorite
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-400"
            }`}
          />
        </div>

        <div className="mt-5 flex gap-3">
          <Badge
            className={
                problem.difficulty === "Easy"
                ? "bg-green-500"
                : problem.difficulty === "Medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            }
            >
            {problem.difficulty}
          </Badge>

          <Badge variant={problem.solved ? "default" : "secondary"}>
            {problem.solved ? "Solved" : "Unsolved"}
          </Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Revision: {problem.revisionDate}
        </p>
      </CardContent>
    </Card>
  );
}