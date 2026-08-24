"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Circle, Target, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Problem = { difficulty: string; solved: boolean; topic: string; revisionCount: number };
type MetricIcon = typeof BarChart3;

export default function AnalyticsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/problems", { cache: "no-store" })
      .then(async (r) => { if (r.ok) setProblems(await r.json()); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const solved = problems.filter((p) => p.solved).length;
  const completion = problems.length ? Math.round((solved / problems.length) * 100) : 0;
  const difficulty = ["Easy", "Medium", "Hard"].map((d) => ({
    name: d,
    total: problems.filter((p) => p.difficulty === d).length,
    solved: problems.filter((p) => p.difficulty === d && p.solved).length,
  }));
  const topics = useMemo(() => Object.entries(problems.reduce<Record<string, { total: number; solved: number }>>((acc, p) => {
    acc[p.topic] ??= { total: 0, solved: 0 };
    acc[p.topic].total++;
    if (p.solved) acc[p.topic].solved++;
    return acc;
  }, {})).sort((a, b) => (b[1].total ? b[1].solved / b[1].total : 0) - (a[1].total ? a[1].solved / a[1].total : 0)), [problems]);
  const revisions = problems.reduce((sum, p) => sum + p.revisionCount, 0);

  const metrics: { Icon: MetricIcon; label: string; value: string | number }[] = [
    { Icon: BarChart3, label: "Tracked problems", value: problems.length },
    { Icon: CheckCircle2, label: "Solved", value: solved },
    { Icon: Target, label: "Completion", value: `${completion}%` },
    { Icon: TrendingUp, label: "Revision cycles", value: revisions },
  ];

  return <div className="mx-auto max-w-7xl space-y-8">
    <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/[0.08] via-background to-background px-6 py-7 sm:px-8">
      <div className="relative z-10">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Performance</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">A clear view of your DSA progress, revision habits, and topics that need more practice.</p>
      </div>
      <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-primary/[0.06] blur-2xl" />
    </div>

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {metrics.map(({ Icon, label, value }) => <Card key={label} className="transition-shadow hover:shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{label}</span><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-4 w-4" /></span></div>
          <p className="mt-4 text-3xl font-bold tracking-tight">{loading ? "—" : value}</p>
        </CardContent>
      </Card>)}
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="overflow-hidden"><CardHeader className="border-b"><CardTitle>Difficulty performance</CardTitle><p className="text-sm text-muted-foreground">See how consistently you are completing each difficulty level.</p></CardHeader><CardContent className="space-y-6 pt-6">{difficulty.map((item) => { const pct = item.total ? Math.round(item.solved / item.total * 100) : 0; return <div key={item.name}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{item.name}</span><span className="text-muted-foreground">{item.solved} / {item.total}</span></div><div className="h-2.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div><p className="mt-1.5 text-right text-xs text-muted-foreground">{pct}% completion</p></div>; })}</CardContent></Card>
      <Card className="overflow-hidden"><CardHeader className="border-b"><CardTitle>Topic performance</CardTitle><p className="text-sm text-muted-foreground">Your strongest and weakest tracked topics.</p></CardHeader><CardContent className="pt-5">{topics.length === 0 ? <div className="py-10 text-center text-sm text-muted-foreground">Add problems to unlock topic analytics.</div> : <div className="space-y-2">{topics.slice(0, 8).map(([topic, value]) => { const pct = value.total ? Math.round(value.solved / value.total * 100) : 0; return <div key={topic} className="rounded-xl border p-3.5 transition-colors hover:bg-muted/40"><div className="flex justify-between text-sm"><span className="font-medium">{topic}</span><span className="text-muted-foreground">{value.solved}/{value.total}</span></div><div className="mt-2.5 h-1.5 rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} /></div></div>; })}</div>}</CardContent></Card>
    </div>

    <Card><CardHeader><CardTitle>Solving overview</CardTitle><p className="text-sm text-muted-foreground">A concise snapshot of your current tracker.</p></CardHeader><CardContent><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-2xl border bg-muted/30 p-5"><CheckCircle2 className="h-5 w-5 text-primary" /><p className="mt-3 text-2xl font-bold">{solved}</p><p className="text-sm text-muted-foreground">Solved problems</p></div><div className="rounded-2xl border bg-muted/30 p-5"><Circle className="h-5 w-5 text-muted-foreground" /><p className="mt-3 text-2xl font-bold">{problems.length - solved}</p><p className="text-sm text-muted-foreground">Still to solve</p></div><div className="rounded-2xl border bg-muted/30 p-5"><TrendingUp className="h-5 w-5 text-primary" /><p className="mt-3 text-2xl font-bold">{revisions}</p><p className="text-sm text-muted-foreground">Completed revision cycles</p></div></div></CardContent></Card>
  </div>;
}
