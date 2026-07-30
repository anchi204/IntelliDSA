import { Search } from "lucide-react";

export default function ProblemSearch() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

      <input
        placeholder="Search problems..."
        className="w-full rounded-xl border py-2 pl-10 pr-4 outline-none focus:ring-2 focus:ring-violet-500"
      />
    </div>
  );
}