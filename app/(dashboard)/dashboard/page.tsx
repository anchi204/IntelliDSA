"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, BrainCircuit, CheckCircle2, Clock3, ListChecks, Sparkles } from "lucide-react";
import Greeting from "@/components/dashboard/greeting";
import TodaysGoal from "@/components/dashboard/todays-goal";
import AIInsightCard from "@/components/dashboard/ai-insight-card";
import RecentActivity from "@/components/dashboard/recent_activity";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Problem = { id: string | number; title: string; difficulty: "Easy" | "Medium" | "Hard"; topic: string; revisionDate?: string | null; revisionCount: number; maxRevisions: number; solved: boolean; };

export default function DashboardPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetch("/api/problems", { cache: "no-store" }).then(async (r) => { if (r.ok) setProblems(await r.json()); }).catch(() => {}).finally(() => setLoading(false)); }, []);

  const due = useMemo(() => problems.filter((p) => p.revisionDate && new Date(p.revisionDate) <= new Date() && p.revisionCount < p.maxRevisions), [problems]);
  const grouped = useMemo(() => ["Easy", "Medium", "Hard"].map((difficulty) => ({ difficulty, problems: due.filter((p) => p.difficulty === difficulty) })).filter((x) => x.problems.length), [due]);

  return <div className="mx-auto max-w-7xl space-y-8">
    <Greeting />
    <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
      <TodaysGoal />
      <Card className="overflow-hidden border-primary/15 bg-gradient-to-br from-primary/10 via-background to-background"><CardContent className="flex h-full min-h-[180px] flex-col justify-between p-6"><div><div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><BrainCircuit className="h-5 w-5" /></div><p className="text-xs font-semibold uppercase tracking-wider text-primary">AI Mentor</p><h2 className="mt-1 text-xl font-semibold">Know what to focus on next.</h2><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Get a personalized study direction from your tracked problems and revision history.</p></div><Link href="/ai" className="mt-5 inline-flex items-center text-sm font-medium text-primary hover:underline">Open AI Mentor <ArrowRight className="ml-1 h-4 w-4" /></Link></CardContent></Card>
    </div>

    <Card className="overflow-hidden"><CardHeader className="flex flex-row items-start justify-between gap-4 border-b"><div><div className="flex items-center gap-2"><Clock3 className="h-5 w-5 text-primary" /><CardTitle>Revise today</CardTitle></div><p className="mt-1 text-sm text-muted-foreground">Problems whose next revision is due right now.</p></div><div className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">{due.length} due</div></CardHeader><CardContent className="p-0">{loading ? <div className="p-8 text-sm text-muted-foreground">Loading your revision queue...</div> : due.length === 0 ? <div className="flex flex-col items-center justify-center px-6 py-14 text-center"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted"><CheckCircle2 className="h-6 w-6 text-muted-foreground" /></div><h3 className="mt-4 font-semibold">You're all caught up</h3><p className="mt-1 max-w-sm text-sm text-muted-foreground">No revisions are due today. Add more problems or keep solving to build your queue.</p><Link href="/problems" className="mt-4"><Button variant="outline">Browse problems</Button></Link></div> : <div>{grouped.map((group) => <div key={group.difficulty}><div className="border-b bg-muted/30 px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{group.difficulty} · {group.problems.length}</div>{group.problems.map((p) => <div key={p.id} className="flex flex-col gap-3 border-b px-5 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between"><div className="min-w-0"><p className="truncate font-medium">{p.title}</p><div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground"><span>{p.topic}</span><span>•</span><span>Revision {p.revisionCount + 1}</span></div></div><Link href={`/problems?focus=${p.id}`}><Button size="sm" variant="outline">Revise <ArrowRight className="ml-1 h-4 w-4" /></Button></Link></div>)}</div>)}</div>}</CardContent></Card>

    <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]"><RecentActivity /><AIInsightCard /></div>
    <div className="flex items-center gap-2 text-xs text-muted-foreground"><ListChecks className="h-4 w-4" /> Your dashboard stays focused on what matters today. Detailed performance lives in Analytics.</div>
  </div>;
}
