import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({ orderBy: { updatedAt: "desc" }, take: 1000 });
    if (problems.length === 0) return NextResponse.json({ available: false, message: "Add a few problems to unlock personalized AI insights." });

    const topicStats = problems.reduce<Record<string, { total: number; solved: number }>>((acc, problem) => {
      acc[problem.topic] ??= { total: 0, solved: 0 };
      acc[problem.topic].total += 1;
      if (problem.solved) acc[problem.topic].solved += 1;
      return acc;
    }, {});
    const due = problems.filter((p) => p.revisionDate && p.revisionDate <= new Date() && p.revisionCount < p.maxRevisions);
    const solved = problems.filter((p) => p.solved);

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({
        available: false,
        message: "AI insights are unavailable because OPENAI_API_KEY is not configured. Your tracker data is still working normally.",
        fallback: `You have solved ${solved.length} of ${problems.length} problems. ${due.length} problem${due.length === 1 ? " is" : "s are"} due for revision.`,
      });
    }

    const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
    const compactProblems = problems.map((p) => ({ title: p.title, topic: p.topic, difficulty: p.difficulty, solved: p.solved, favorite: p.favorite, revisionCount: p.revisionCount, maxRevisions: p.maxRevisions, revisionDue: !!p.revisionDate && p.revisionDate <= new Date() && p.revisionCount < p.maxRevisions }));
    const prompt = `You are a DSA mentor. Analyze this user's tracker data and return concise personalized guidance. Identify weak topics using solve rate, revision priorities, recent gaps, and difficulty balance. Recommend 3 next actions. Do not invent problems or statistics. Keep the response under 180 words.\n\nTopic stats: ${JSON.stringify(topicStats)}\nProblems: ${JSON.stringify(compactProblems)}`;

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: JSON.stringify({ model, temperature: 0.3, messages: [{ role: "system", content: "You give practical, honest DSA study advice." }, { role: "user", content: prompt }] }),
    });
    if (!response.ok) {
      console.error("OpenAI API error", await response.text());
      return NextResponse.json({ available: false, message: "AI service is temporarily unavailable. Try again later.", fallback: `You have ${due.length} revision${due.length === 1 ? "" : "s"} due and ${problems.length - solved.length} unsolved problem${problems.length - solved.length === 1 ? "" : "s"}.` });
    }
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    if (typeof content !== "string" || !content.trim()) throw new Error("AI returned no content");
    return NextResponse.json({ available: true, insight: content.trim() });
  } catch (error) {
    console.error("GET /api/ai/insight", error);
    return NextResponse.json({ available: false, message: "Unable to generate AI insights right now." }, { status: 200 });
  }
}
