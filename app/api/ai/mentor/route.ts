import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const schema = z.object({ action: z.enum(["plan", "weakness", "revision", "daily-goal", "hint", "performance"]), problemId: z.number().int().positive().optional(), question: z.string().trim().max(4000).optional() });
const json = (value: unknown) => JSON.stringify(value);

async function ask(prompt: string) {
  if (!process.env.OPENAI_API_KEY) return null;
  const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` }, body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", temperature: 0.25, messages: [{ role: "system", content: "You are IntelliDSA, a concise DSA mentor. Use only supplied facts. Never invent a user's performance. For hints, do not reveal the complete solution unless explicitly requested." }, { role: "user", content: prompt }] }) });
  if (!response.ok) return null;
  const data = await response.json(); const content = data.choices?.[0]?.message?.content; return typeof content === "string" ? content.trim() : null;
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(); const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid AI request" }, { status: 400 });
    const { action, problemId, question } = parsed.data;
    const problems = await prisma.problem.findMany({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, take: 500 });
    const now = new Date();
    const due = problems.filter((p) => p.revisionDate && p.revisionDate <= now && p.revisionCount < p.maxRevisions);
    const topicStats = problems.reduce<Record<string, { total: number; solved: number }>>((a, p) => { a[p.topic] ??= { total: 0, solved: 0 }; a[p.topic].total++; if (p.solved) a[p.topic].solved++; return a; }, {});
    let target = null;
    if (problemId) target = problems.find((p) => p.id === problemId) ?? null;
    const context = json(problems.map((p) => ({ id: p.id, title: p.title, topic: p.topic, difficulty: p.difficulty, solved: p.solved, favorite: p.favorite, revisionCount: p.revisionCount, maxRevisions: p.maxRevisions, due: !!p.revisionDate && p.revisionDate <= now && p.revisionCount < p.maxRevisions })));
    const prompts: Record<string, string> = {
      plan: `Create a personalized 7-day DSA study plan for this user. Balance unsolved work, weak topics and revision due dates. Give a day-by-day plan with realistic actions. Topic stats: ${json(topicStats)} Problems: ${context}`,
      weakness: `Analyze weak DSA topics from these solve rates and difficulty patterns. Rank the weakest topics, explain why, and give one concrete practice action per topic. Topic stats: ${json(topicStats)} Problems: ${context}`,
      revision: `Recommend the best 5 problems to revise next. Prioritize overdue revisions, low solved confidence signals available in the data, favorites and topic weakness. Give a reason for each. Problems: ${context}`,
      "daily-goal": `Set a personalized daily goal using this user's workload. Give a target number of problems, revision tasks and a focus topic. Keep it achievable. Topic stats: ${json(topicStats)} Problems: ${context}`,
      performance: `Summarize this user's tracker performance without inventing trends. Mention solved/total, unsolved, due revisions, topic strengths/weaknesses and 3 actions. Problems: ${context}`,
      hint: target ? `Give progressive hints for this DSA problem without giving the final code. Problem: ${json({ title: target.title, topic: target.topic, difficulty: target.difficulty, link: target.link, notes: target.notes })}. User question: ${question || "Give me a helpful first hint."}` : "No problem was selected. Ask the user to select a problem first.",
    };
    const content = await ask(prompts[action]);
    if (content) return NextResponse.json({ available: true, action, content });
    const fallback: Record<string, string> = { plan: `Start with ${due.length} revision${due.length === 1 ? "" : "s"} due today, then solve 2 unsolved problems from your weakest topic.`, weakness: "Add more solved problems across topics to unlock stronger AI weakness analysis.", revision: due.length ? `You have ${due.length} revision${due.length === 1 ? "" : "s"} currently due. Start with the oldest due problem.` : "No revisions are currently due.", "daily-goal": `Today's baseline goal: solve 2 unsolved problems and complete all due revisions.`, performance: `You have solved ${problems.filter((p) => p.solved).length} of ${problems.length} tracked problems.`, hint: target ? `Review the problem's constraints, identify the core data structure, and write down a brute-force approach before optimizing.` : "Select a problem to get a hint." };
    return NextResponse.json({ available: false, action, content: fallback[action] });
  } catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error("POST /api/ai/mentor", error); return NextResponse.json({ message: "Unable to process AI request" }, { status: 500 }); }
}
