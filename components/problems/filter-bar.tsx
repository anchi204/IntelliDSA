"use client";

type FilterBarProps = {
  difficulty: string;
  topic: string;
  platform: string;
  topics?: string[];
  platforms?: string[];
  onDifficultyChange: (value: string) => void;
  onTopicChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
};

export default function FilterBar({ difficulty, topic, platform, topics = [], platforms = [], onDifficultyChange, onTopicChange, onPlatformChange }: FilterBarProps) {
  return <div className="flex flex-wrap gap-2">
    <select value={difficulty} onChange={(e) => onDifficultyChange(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option value="">All Difficulties</option><option value="Easy">Easy</option><option value="Medium">Medium</option><option value="Hard">Hard</option></select>
    <select value={platform} onChange={(e) => onPlatformChange(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option value="">All Platforms</option>{platforms.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    <select value={topic} onChange={(e) => onTopicChange(e.target.value)} className="rounded-lg border bg-background px-3 py-2 text-sm"><option value="">All Topics</option>{topics.map((value) => <option key={value} value={value}>{value}</option>)}</select>
    {(difficulty || platform || topic) && <button type="button" onClick={() => { onDifficultyChange(""); onPlatformChange(""); onTopicChange(""); }} className="rounded-lg border px-3 py-2 text-sm hover:bg-muted">Clear Filters</button>}
  </div>;
}
