"use client";

type FilterBarProps = {
  difficulty: string;
  topic: string;
  platform: string;
  onDifficultyChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
};

export default function FilterBar({
  difficulty,
  topic,
  platform,
  onDifficultyChange,
  onTopicChange,
  onPlatformChange,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <select
        value={difficulty}
        onChange={(e) => onDifficultyChange(e.target.value)}
        className="rounded-lg border bg-background px-3 py-2 text-sm"
      >
        <option value="">All Difficulties</option>
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <select
        value={platform}
        onChange={(e) => onPlatformChange(e.target.value)}
        className="rounded-lg border bg-background px-3 py-2 text-sm"
      >
        <option value="">All Platforms</option>
        <option value="LeetCode">LeetCode</option>
        <option value="Codeforces">Codeforces</option>
        <option value="GeeksforGeeks">GeeksforGeeks</option>
      </select>

      <select
        value={topic}
        onChange={(e) => onTopicChange(e.target.value)}
        className="rounded-lg border bg-background px-3 py-2 text-sm"
      >
        <option value="">All Topics</option>
        <option value="Array">Array</option>
        <option value="String">String</option>
        <option value="Linked List">Linked List</option>
        <option value="Stack">Stack</option>
        <option value="Queue">Queue</option>
        <option value="Tree">Tree</option>
        <option value="Graph">Graph</option>
        <option value="DP">DP</option>
      </select>

      {(difficulty || platform || topic) && (
        <button
          onClick={() => {
            onDifficultyChange("");
            onPlatformChange("");
            onTopicChange("");
          }}
          className="rounded-lg border px-3 py-2 text-sm hover:bg-muted"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}