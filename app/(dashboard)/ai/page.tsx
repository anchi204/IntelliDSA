"use client";

import { useState } from "react";

const actions = [
  ["plan", "7-Day Study Plan"], ["weakness", "Weak Topic Analysis"], ["revision", "Revision Recommendations"], ["daily-goal", "Daily Goal"], ["performance", "Performance Analysis"],
] as const;

export default function AIPage() {
  const [active, setActive] = useState<(typeof actions)[number][0]>("plan"); const [content, setContent] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function run(action: string) { setLoading(true); setError(""); try { const res = await fetch("/api/ai/mentor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action }) }); const data = await res.json(); if (!res.ok) throw new Error(data.message || "AI request failed"); setContent(data.content || "No guidance returned."); } catch (e) { setError(e instanceof Error ? e.message : "AI request failed"); } finally { setLoading(false); } }
  return <div className="space-y-6"><div><h1 className="text-3xl font-bold">AI Mentor</h1><p className="mt-1 text-muted-foreground">Personalized guidance generated from your IntelliDSA history.</p></div><div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{actions.map(([id, label]) => <button key={id} onClick={() => { setActive(id); run(id); }} className={`rounded-xl border p-4 text-left text-sm transition hover:bg-muted ${active === id ? "border-primary bg-primary/5" : "bg-card"}`}>{label}</button>)}</div><div className="rounded-xl border bg-card p-6 shadow-sm min-h-56">{loading ? <p className="text-muted-foreground">Analyzing your tracker data...</p> : error ? <p className="text-destructive">{error}</p> : content ? <div className="whitespace-pre-wrap leading-7">{content}</div> : <p className="text-muted-foreground">Choose an AI action above.</p>}</div></div>;
}
