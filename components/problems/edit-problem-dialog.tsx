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
  const [revisionDate, setRevisionDate] = useState("");
  const [maxRevisions, setMaxRevisions] = useState(problem.maxRevisions);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setTitle(problem.title); setPlatform(problem.platform); setTopic(problem.topic); setDifficulty(problem.difficulty);
    setLink(problem.link ?? ""); setNotes(problem.notes ?? ""); setMaxRevisions(problem.maxRevisions); setError("");
    setRevisionDate(problem.revisionDate ? new Date(problem.revisionDate).toISOString().slice(0, 10) : "");
  }, [open, problem]);

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) { setError("Title and topic are required."); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/problems/${problem.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title, platform, topic, difficulty, link, notes, revisionDate: revisionDate || null, maxRevisions }) });
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
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Revision Date</Label><Input type="date" value={revisionDate} onChange={(e) => setRevisionDate(e.target.value)} /></div><div><Label>Maximum Revisions</Label><Input type="number" min={0} max={50} value={maxRevisions} onChange={(e) => setMaxRevisions(Math.max(0, Number(e.target.value)))} /></div></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Updating..." : "Update Problem"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
