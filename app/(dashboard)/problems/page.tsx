"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Filter, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ProblemCard from "@/components/problems/problem-card";
import ProblemSearch from "@/components/problems/problem-search";
import FilterBar from "@/components/problems/filter-bar";
import AddProblemDialog from "@/components/problems/add-problem-dialog";
import type { Problem } from "@/types/problem";

type SortKey = "newest" | "oldest" | "difficulty" | "revision";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");
  const [status, setStatus] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProblems() {
    setLoading(true); setError("");
    try {
      const response = await fetch("/api/problems", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Failed to load problems");
      setProblems(data);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load problems"); }
    finally { setLoading(false); }
  }

  useEffect(() => { void loadProblems(); }, []);

  const topics = useMemo(() => Array.from(new Set(problems.map((p) => p.topic).filter(Boolean))).sort(), [problems]);
  const platforms = useMemo(() => Array.from(new Set(problems.map((p) => p.platform).filter(Boolean))).sort(), [problems]);

  const visibleProblems = useMemo(() => {
    const filtered = problems.filter((problem) => {
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || [problem.title, problem.topic, problem.platform].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = !status || (status === "solved" && problem.solved) || (status === "unsolved" && !problem.solved) || (status === "favorite" && problem.favorite);
      return matchesSearch && matchesStatus && (!difficulty || problem.difficulty === difficulty) && (!topic || problem.topic === topic) && (!platform || problem.platform === platform);
    });
    return filtered.sort((a, b) => {
      if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sort === "difficulty") return ["Easy", "Medium", "Hard"].indexOf(a.difficulty) - ["Easy", "Medium", "Hard"].indexOf(b.difficulty);
      if (sort === "revision") return Number(!!b.revisionDate) - Number(!!a.revisionDate) || (b.revisionCount - a.revisionCount);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [problems, search, difficulty, topic, platform, status, sort]);

  function updateProblem(updated: Problem) { setProblems((current) => current.map((p) => p.id === updated.id ? updated : p)); }
  function deleteProblem(id: number) { setProblems((current) => current.filter((p) => p.id !== id)); }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div><h1 className="text-2xl font-bold">Problems</h1><p className="mt-1 text-sm text-muted-foreground">Track, solve and revise your DSA problems.</p></div>
        <AddProblemDialog onCreated={(problem) => setProblems((current) => [problem, ...current])} />
      </div>

      <Card><CardContent className="space-y-4 p-4 sm:p-5">
        <ProblemSearch value={search} onChange={setSearch} />
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-2"><Filter className="h-4 w-4 text-muted-foreground" /><FilterBar difficulty={difficulty} topic={topic} platform={platform} status={status} topics={topics} platforms={platforms} onDifficultyChange={setDifficulty} onTopicChange={setTopic} onPlatformChange={setPlatform} onStatusChange={setStatus} /></div>
          <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="difficulty">Difficulty</option><option value="revision">Revision priority</option></select>
        </div>
      </CardContent></Card>

      {error && <Card><CardContent className="flex flex-col items-center gap-3 p-8 text-center"><p className="text-sm text-destructive">{error}</p><Button variant="outline" onClick={() => void loadProblems()}>Try again</Button></CardContent></Card>}
      {loading && <div className="flex items-center justify-center py-16 text-muted-foreground"><Loader2 className="mr-2 h-5 w-5 animate-spin" />Loading problems...</div>}
      {!loading && !error && visibleProblems.length === 0 && <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center"><BookOpen className="h-10 w-10 text-muted-foreground" /><h2 className="mt-4 font-semibold">{problems.length ? "No matching problems" : "No problems yet"}</h2><p className="mt-1 max-w-md text-sm text-muted-foreground">{problems.length ? "Try changing your search or filters." : "Add your first DSA problem to start tracking your progress."}</p></CardContent></Card>}
      {!loading && !error && visibleProblems.length > 0 && <div className="grid gap-4 xl:grid-cols-2">{visibleProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} onUpdated={updateProblem} onDeleted={deleteProblem} onError={setError} />)}</div>}
    </div>
  );
}
