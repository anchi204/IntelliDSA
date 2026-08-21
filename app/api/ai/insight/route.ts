import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await requireUser();
    const problems = await prisma.problem.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 1000 });
    if (problems.length === 0) return NextResponse.json({ available: false, message: "Add a few problems to unlock personalized AI insights." });
    const now = new Date();
    const topicStats = problems.reduce<Record<string, { total: number; solved: number }>>((acc, problem) => { acc[problem.topic] ??= { total: 0, solved: 0 }; acc[problem.topic].total += 1; if (problem.solved) acc[problem.topic].solved += 1; return acc; }, {});
    const due = problems.filter((p) => p.revisionDate && p.revisionDate <= now && p.revisionCount < p.maxRevisions);
    const solved = problems.filter((p) => p.solved);
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ available: false, message: "AI insights are unavailable because OPENAI_API_KEY is not configured.", fallback: `You have solved ${solved.length} of ${problems.length} problems. ${due.length} problem${due.length === 1 ? " is" : "s are"} due for revision.` });
    const compact = problems.map((p) => ({ title: p.title, topic: p.topic, difficulty: p.difficulty, solved: p.solved, favorite: p.favorite, revisionCount: p.revisionCount, maxRevisions: p.maxRevisions, revisionDue: !!p.revisionDate && p.revisionDate <= now && p.revisionCount < p.maxRevisions }));
    const prompt = `You are a DSA mentor. Analyze only the supplied tracker data. Identify weak topics from solve rates, revision priorities, recent gaps and difficulty balance. Recommend exactly 3 next actions. Never invent statistics or problems. Keep under 180 words. Topic stats: ${JSON.stringify(topicStats)} Problems: ${JSON.stringify(compact)}`;
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.3, messages: [{ role: "system", content: "Give practical, honest DSA study advice." }, { role: "user", content: prompt }] }) });
    if (!response.ok) return NextResponse.json({ available: false, message: "AI service is temporarily unavailable.", fallback: `You have ${due.length} revision${due.length === 1 ? "" : "s"} due and ${problems.length - solved.length} unsolved problem${problems.length - solved.length === 1 ? "" : "s"}.` });
    const data = await response.json(); const content = data.choices?.[0]?.message?.content; if (typeof content !== "string" || !content.trim()) throw new Error("AI returned no content");
    return NextResponse.json({ available: true, insight: content.trim() });
  } catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error("GET /api/ai/insight", error); return NextResponse.json({ available: false, message: "Unable to generate AI insights right now." }, { status: 200 }); }
}
