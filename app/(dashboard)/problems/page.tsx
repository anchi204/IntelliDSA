"use client";

import { useEffect, useState } from "react";

import ProblemCard from "@/components/problems/problem-card";
import ProblemSearch from "@/components/problems/problem-search";
import FilterBar from "@/components/problems/filter-bar";
import AddProblemDialog from "@/components/problems/add-problem-dialog";

export default function ProblemsPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [topic, setTopic] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    fetchProblems();
  }, []);

  async function fetchProblems() {
    try {
      const response = await fetch("/api/problems");

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error("Error fetching problems:", error);
    }
  }

  const filteredProblems = problems.filter((problem) => {
    const matchesSearch = problem.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesDifficulty =
      !difficulty || problem.difficulty === difficulty;

    const matchesTopic =
      !topic || problem.topic === topic;

    const matchesPlatform =
      !platform || problem.platform === platform;

    return (
      matchesSearch &&
      matchesDifficulty &&
      matchesTopic &&
      matchesPlatform
    );
  });

  return (
    <div className="space-y-6">

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Problems
          </h1>

          <p className="mt-2 text-muted-foreground">
            Track and revise your DSA problems.
          </p>
        </div>

        <AddProblemDialog />
      </div>

      <div className="space-y-4">
        <ProblemSearch
          value={search}
          onChange={setSearch}
        />

        <FilterBar
          difficulty={difficulty}
          topic={topic}
          platform={platform}
          onDifficultyChange={setDifficulty}
          onTopicChange={setTopic}
          onPlatformChange={setPlatform}
        />
      </div>

      <div className="grid gap-6">
        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
          />
        ))}
      </div>

      {filteredProblems.length === 0 && (
        <div className="rounded-xl border p-8 text-center text-muted-foreground">
          No problems found.
        </div>
      )}

    </div>
  );
}