"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Difficulty, Problem } from "@/types/problem";

interface Props { onCreated: (problem: Problem) => void; }

export default function AddProblemDialog({ onCreated }: Props) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [platform, setPlatform] = useState("LeetCode");
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [topic, setTopic] = useState("");
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [revisionDate, setRevisionDate] = useState("");
  const [maxRevisions, setMaxRevisions] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function reset() {
    setTitle(""); setTopic(""); setLink(""); setNotes(""); setRevisionDate(""); setMaxRevisions(0); setError("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !topic.trim()) { setError("Title and topic are required."); return; }
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/problems", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, platform, difficulty, topic, link, notes, revisionDate: revisionDate || null, maxRevisions }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to create problem");
      onCreated(data); reset(); setOpen(false);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to add problem"); }
    finally { setLoading(false); }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button>Add Problem</Button>} />
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader><DialogTitle>Add New Problem</DialogTitle></DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><Label>Problem Name</Label><Input placeholder="Two Sum" value={title} onChange={(e) => setTitle(e.target.value)} /></div>
          <div><Label>Platform</Label><Input placeholder="LeetCode" value={platform} onChange={(e) => setPlatform(e.target.value)} /></div>
          <div><Label>Difficulty</Label><select value={difficulty} onChange={(e) => setDifficulty(e.target.value as Difficulty)} className="w-full rounded-lg border bg-background px-3 py-2 text-sm"><option>Easy</option><option>Medium</option><option>Hard</option></select></div>
          <div><Label>Topic</Label><Input placeholder="Array" value={topic} onChange={(e) => setTopic(e.target.value)} /></div>
          <div><Label>Problem Link</Label><Input type="url" placeholder="https://leetcode.com/problems/two-sum/" value={link} onChange={(e) => setLink(e.target.value)} /></div>
          <div><Label>Notes</Label><Textarea placeholder="Approach, mistakes, reminders..." value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
          <div className="grid gap-4 sm:grid-cols-2"><div><Label>Revision Date</Label><Input type="date" value={revisionDate} onChange={(e) => setRevisionDate(e.target.value)} /></div><div><Label>Maximum Revisions</Label><Input type="number" min={0} max={50} value={maxRevisions} onChange={(e) => setMaxRevisions(Math.max(0, Number(e.target.value)))} /></div></div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Saving..." : "Save Problem"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
