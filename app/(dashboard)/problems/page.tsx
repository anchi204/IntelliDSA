import { problems } from "@/constants/problems";
import ProblemCard from "@/components/problems/problem-card";
import ProblemSearch from "@/components/problems/problem-search";
import FilterBar from "@/components/problems/filter-bar";

export default function ProblemsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">
        Problems
      </h1>

      {/* Search & Filters */}
      <div className="space-y-4">
        <ProblemSearch />
        <FilterBar />
      </div>

      {/* Problems List */}
      <div className="grid gap-6">
        {problems.map((problem) => (
          <ProblemCard
            key={problem.id}
            problem={problem}
          />
        ))}
      </div>
    </div>
  );
}