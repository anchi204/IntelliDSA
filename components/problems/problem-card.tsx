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
    const response = await fetch(`/api/problems/${problem.id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete problem");
    }

    window.location.reload();
  } catch (error) {
    console.error("Delete error:", error);
  }
};
  const handleFavorite = async () => {
  try {
    const response = await fetch(`/api/problems/${problem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        favorite: !problem.favorite,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update favorite");
    }

    window.location.reload();
  } catch (error) {
    console.error("Favorite error:", error);
  }
};
  const handleSolved = async () => {
  try {
    const newSolvedStatus = !problem.solved;

    const response = await fetch(`/api/problems/${problem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        solved: newSolvedStatus,
        difficulty: problem.difficulty,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update solved status");
    }

    window.location.reload();
  } catch (error) {
    console.error("Solved error:", error);
  }
};
const handleRevisionDone = async () => {
  try {
    const response = await fetch(`/api/problems/${problem.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        revisionDone: true,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to complete revision");
    }

    window.location.reload();
  } catch (error) {
    console.error("Revision error:", error);
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

        <div className="mt-4 text-sm">
          {problem.difficulty === "Easy" ? (
            <p className="text-muted-foreground">
              No revision scheduled
            </p>
          ) : problem.revisionDate ? (
            <p
              className={
                new Date(problem.revisionDate) <= new Date()
                  ? "font-medium text-red-500"
                  : "font-medium text-green-500"
              }
            >
              {new Date(problem.revisionDate) <= new Date()
                ? "🔴 Revision due"
                : `📅 Next revision: ${new Date(
                    problem.revisionDate
                  ).toLocaleDateString()}`}
            </p>
          ) : (
            <p className="text-muted-foreground">
              Revision not scheduled
            </p>
          )}
        </div>
        {problem.maxRevisions > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Revision {problem.revisionCount} / {problem.maxRevisions}
          </p>
        )}

        {problem.revisionDate &&
          new Date(problem.revisionDate) <= new Date() &&
          problem.revisionCount < problem.maxRevisions && (
            <button
              onClick={handleRevisionDone}
              className="mt-3 rounded-md bg-blue-500 px-3 py-2 text-sm text-white hover:bg-blue-600"
            >
              ✓ Revision Done
            </button>
          )}
      </CardContent>
    </Card>
  );
}