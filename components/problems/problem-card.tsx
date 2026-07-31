import { Problem } from "@/types/problem";
import { Card, CardContent } from "@/components/ui/card";
import { Star, Trash2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import EditProblemDialog from "./edit-problem-dialog";

interface Props {
  problem: Problem;
}

export default function ProblemCard({ problem }: Props) {
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this problem?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "DELETE",
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleFavorite = async () => {
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          favorite: !problem.favorite,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  const handleSolved = async () => {
    try {
      await fetch(`/api/problems/${problem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solved: !problem.solved,
        }),
      });

      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
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

          <div className="flex items-center gap-3">
            <Star
              onClick={handleFavorite}
              className={`h-5 w-5 cursor-pointer ${
                problem.favorite
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-400"
              }`}
            />
            <EditProblemDialog problem={problem} />
            <Trash2
              className="h-5 w-5 text-red-500 cursor-pointer"
              onClick={handleDelete}
            />
          </div>
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

          <Badge
            className={
              problem.solved
                ? "bg-green-500 cursor-pointer"
                : "bg-gray-500 cursor-pointer"
            }
            onClick={handleSolved}
          >
            {problem.solved ? "Solved" : "Unsolved"}
          </Badge>
        </div>

        <p className="mt-4 text-sm text-muted-foreground">
          Revision:{" "}
          {problem.revisionDate
            ? new Date(problem.revisionDate).toLocaleDateString()
            : "Not Set"}
        </p>
      </CardContent>
    </Card>
  );
}