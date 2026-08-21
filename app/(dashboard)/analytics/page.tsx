"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Problem } from "@/types/problem";

export default function AnalyticsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/problems", { cache: "no-store" }).then(async (r) => { if (!r.ok) throw new Error(); return r.json(); }).then(setProblems).catch(() => setProblems([])).finally(() => setLoading(false));
  }, []);

  const solved = problems.filter((p) => p.solved);
  const topics = Object.entries(problems.reduce<Record<string, { total: number; solved: number }>>((acc, p) => { acc[p.topic] ??= { total: 0, solved: 0 }; acc[p.topic].total++; if (p.solved) acc[p.topic].solved++; return acc; }, {})).sort((a, b) => (a[1].solved / a[1].total) - (b[1].solved / b[1].total));
  const difficulty = ["Easy", "Medium", "Hard"].map((d) => ({ name: d, total: problems.filter((p) => p.difficulty === d).length, solved: solved.filter((p) => p.difficulty === d).length }));

  return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Analytics</h1><p className="mt-1 text-sm text-muted-foreground">Understand where your DSA practice is strong and where to focus next.</p></div>
    <div className="grid gap-6 sm:grid-cols-3"><Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Completion rate</p><p className="mt-2 text-3xl font-bold">{loading ? "—" : `${problems.length ? Math.round(solved.length / problems.length * 100) : 0}%`}</p></CardContent></Card><Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Topics tracked</p><p className="mt-2 text-3xl font-bold">{loading ? "—" : topics.length}</p></CardContent></Card><Card><CardContent className="p-6"><p className="text-sm text-muted-foreground">Revision cycles</p><p className="mt-2 text-3xl font-bold">{loading ? "—" : problems.reduce((sum, p) => sum + p.revisionCount, 0)}</p></CardContent></Card></div>
    <Card><CardHeader><CardTitle>Difficulty performance</CardTitle></CardHeader><CardContent className="space-y-4">{difficulty.map((item) => <div key={item.name}><div className="flex justify-between text-sm"><span>{item.name}</span><span>{item.solved} / {item.total} solved</span></div><div className="mt-2 h-2 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${item.total ? item.solved / item.total * 100 : 0}%` }} /></div></div>)}</CardContent></Card>
    <Card><CardHeader><CardTitle>Topics needing attention</CardTitle></CardHeader><CardContent>{topics.length === 0 ? <p className="text-sm text-muted-foreground">Add problems to see topic analytics.</p> : <div className="space-y-3">{topics.slice(0, 8).map(([topic, value]) => <div key={topic} className="flex items-center justify-between rounded-lg border p-3"><span className="font-medium">{topic}</span><span className="text-sm text-muted-foreground">{value.solved}/{value.total} solved</span></div>)}</div>}</CardContent></Card>
  </div>;
}
