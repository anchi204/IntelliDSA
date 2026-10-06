"use client";

import { useEffect, useState } from "react";
import type { Difficulty, Problem } from "@/types/problem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Props { problem: Problem; onUpdated: (problem: Problem) => void; }

export default function EditProblemDialog({ problem, onUpdated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(problem.title);
  const [platform, setPlatform] = useState(problem.platform);
  const [topic, setTopic] = useState(problem.topic);
  const [difficulty, setDifficulty] = useState<Difficulty>(problem.difficulty);
  const [link, setLink] = useState(problem.link ?? "");
  const [notes, setNotes] = useState(problem.notes ?? "");
  const [revisionEnabled, setRevisionEnabled] = useState(problem.revisionEnabled);
  const [maxRevisions, setMaxRevisions] = useState(Math.max(1, problem.maxRevisions || 5));
  const [revisionIntervalDays, setRevisionIntervalDays] = useState(problem.revisionIntervalDays || 4);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(problem.title); setPlatform(problem.platform); setTopic(problem.topic); setDifficulty(problem.difficulty);
    setLink(problem.link ?? ""); setNotes(problem.notes ?? ""); setRevisionEnabled(problem.revisionEnabled); setMaxRevisions(Math.max(1, problem.maxRevisions || 5)); setRevisionIntervalDays(problem.revisionIntervalDays || 4); setError("");
  }, [open, problem]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) { setError("Title and topic are required."); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/problems/${problem.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, platform, topic, difficulty, link, notes, revisionEnabled, maxRevisions, revisionIntervalDays }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to update problem");
      onUpdated(data); setOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to update problem"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" size="sm">Edit</Button>} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Edit Problem</DialogTitle></DialogHeader>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div><Label>Problem Name</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Platform</Label><Input value={platform} onChange={(e) => setPlatform(e.target.value)} /></div>
          <div><Label>Topic</Label><Input value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
          <div><Label>Difficulty</Label><select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm"><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
          <div><Label>Problem Link</Label><Input type="url" value={link} onChange={(e) => setLink(e.target.value)} /></div>
          <div><Label>Notes</Label><Textarea value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="rounded-xl border p-4 space-y-4"><div className="flex items-center justify-between"><div><Label>AI Revision</Label><p className="text-xs text-muted-foreground">You set limits; AI sets dates.</p></div><button type="button" onClick={() => setRevisionEnabled(!revisionEnabled)}>{revisionEnabled ? "ON" : "OFF"}</button></div>{revisionEnabled && <div className="grid gap-4 sm:grid-cols-2"><div><Label>Maximum revisions</Label><Input type="number" min={1} max={50} value={maxRevisions} onChange={(e) => setMaxRevisions(Math.max(1, Number(e.target.value)))} /></div><div><Label>Preferred gap</Label><select value={revisionIntervalDays} onChange={(e) => setRevisionIntervalDays(Number(e.target.value))} className="w-full rounded-lg border bg-background px-3 py-2 text-sm">{[1,2,3,4,5,7,10,14].map(d => <option key={d} value={d}>Every {d} day{d>1?"s":""}</option>)}</select></div></div>}</div>{error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Problem"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
