export default function FilterBar() {
  return (
    <div className="flex gap-4">
      <select className="rounded-lg border p-2">
        <option>All Difficulty</option>
        <option>Easy</option>
        <option>Medium</option>
        <option>Hard</option>
      </select>

      <select className="rounded-lg border p-2">
        <option>All Topics</option>
        <option>Array</option>
        <option>Graph</option>
        <option>DP</option>
      </select>
    </div>
  );
}