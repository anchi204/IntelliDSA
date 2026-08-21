"use client";

import { useState } from "react";
import { ExternalLink, Star, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import EditProblemDialog from "./edit-problem-dialog";
import type { Problem } from "@/types/problem";

interface Props { problem: Problem; onUpdated: (problem: Problem) => void; onDeleted: (id: number) => void; onError: (message: string) => void; }

export default function ProblemCard({ problem, onUpdated, onDeleted, onError }: Props) {
  const [busy, setBusy] = useState(false);
  const due = !!problem.revisionDate && new Date(problem.revisionDate) <= new Date() && problem.revisionCount < problem.maxRevisions;

  async function patch(payload: Record<string, unknown>) {
    setBusy(true); onError("");
    try {
      const response = await fetch(`/api/problems/${problem.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Update failed");
      onUpdated(data);
    } catch (error) { onError(error instanceof Error ? error.message : "Update failed"); }
    finally { setBusy(false); }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete “${problem.title}”?`)) return;
    setBusy(true); onError("");
    try {
      const response = await fetch(`/api/problems/${problem.id}`, { method: "DELETE" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Delete failed");
      onDeleted(problem.id);
    } catch (error) { onError(error instanceof Error ? error.message : "Delete failed"); }
    finally { setBusy(false); }
  }

  return (
    <Card className="transition-all hover:shadow-lg">
      <CardContent className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2"><h2 className="text-lg font-semibold break-words">{problem.title}</h2>{problem.link && <a href={problem.link} target="_blank" rel="noreferrer" aria-label="Open problem"><ExternalLink className="h-4 w-4 text-muted-foreground hover:text-foreground" /></a>}</div>
            <p className="mt-1 text-sm text-muted-foreground">{problem.platform} • {problem.topic}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <Button variant="ghost" size="icon-sm" disabled={busy} onClick={() => patch({ favorite: !problem.favorite })} aria-label="Toggle favorite"><Star className={`h-5 w-5 ${problem.favorite ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`} /></Button>
            <EditProblemDialog problem={problem} onUpdated={onUpdated} />
            <Button variant="ghost" size="icon-sm" disabled={busy} onClick={handleDelete} aria-label="Delete problem"><Trash2 className="h-5 w-5 text-destructive" /></Button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Badge className={problem.difficulty === "Easy" ? "bg-green-500" : problem.difficulty === "Medium" ? "bg-yellow-500" : "bg-red-500"}>{problem.difficulty}</Badge>
          <Button variant="outline" size="sm" disabled={busy} onClick={() => patch({ solved: !problem.solved })}>{problem.solved ? "✓ Solved" : "Mark solved"}</Button>
        </div>

        {problem.notes && <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">{problem.notes}</p>}
        <div className="mt-4 text-sm">
          {problem.maxRevisions > 0 ? <><p className={due ? "font-medium text-red-500" : "text-muted-foreground"}>{due ? "🔴 Revision due" : problem.revisionDate ? `📅 Next revision: ${new Date(problem.revisionDate).toLocaleDateString()}` : "Revision cycle complete"}</p><p className="mt-1 text-xs text-muted-foreground">Revision {problem.revisionCount} / {problem.maxRevisions}</p></> : <p className="text-muted-foreground">No revision scheduled</p>}
        </div>
        {due && <Button className="mt-3" size="sm" disabled={busy} onClick={() => patch({ revisionDone: true })}>✓ Revision Done</Button>}
      </CardContent>
    </Card>
  );
}
