"use client";
import ProblemCard from "@/components/problems/problem-card";
import ProblemSearch from "@/components/problems/problem-search";
import FilterBar from "@/components/problems/filter-bar";
import AddProblemDialog from "@/components/problems/add-problem-dialog";
import { useMemo, useState, useEffect } from "react";

export default function ProblemsPage() {
  const [search, setSearch] = useState("");
  const [problems, setProblems] = useState<any[]>([]);

  const fetchProblems = async () => {
    try {
      const res = await fetch("/api/problems");
      const data = await res.json();
      setProblems(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);
  const filteredProblems = useMemo(() => {
    return problems.filter((problem) =>
      problem.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, problems]);
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold">
          Problems
        </h1>

        <AddProblemDialog onProblemAdded={fetchProblems} />
      </div>

      {/* Search & Filters */}
      <div className="space-y-4">
        <ProblemSearch
          value={search}
          onChange={setSearch}
        />
        <FilterBar />
      </div>

      {/* Problems List */}
      <div className="grid gap-6">
        {filteredProblems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
          />
        ))}
      </div>
    </div>
  );
}