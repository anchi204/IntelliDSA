import OpenAI from "openai";
import { NextRequest, NextResponse } from "next/server";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { problems } = await req.json();

    if (!Array.isArray(problems)) {
      return NextResponse.json(
        { message: "Problems data is required" },
        { status: 400 }
      );
    }

    const solvedProblems = problems.filter(
      (problem: any) => problem.solved
    );

    const unsolvedProblems = problems.filter(
      (problem: any) => !problem.solved
    );

    const topicCount: Record<string, number> = {};

    solvedProblems.forEach((problem: any) => {
      topicCount[problem.topic] =
        (topicCount[problem.topic] || 0) + 1;
    });

    const difficultyCount: Record<string, number> = {};

    solvedProblems.forEach((problem: any) => {
      difficultyCount[problem.difficulty] =
        (difficultyCount[problem.difficulty] || 0) + 1;
    });

    const prompt = `
You are a DSA learning assistant.

Analyze this user's DSA progress and give a short personalized insight.

Total problems: ${problems.length}
Solved: ${solvedProblems.length}
Unsolved: ${unsolvedProblems.length}

Solved by topic:
${JSON.stringify(topicCount)}

Solved by difficulty:
${JSON.stringify(difficultyCount)}

Give:
1. One positive observation.
2. One area to improve.
3. One practical next step.

Keep it short, simple and useful. Maximum 4 sentences.
`;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    return NextResponse.json({
      insight: response.output_text,
    });
  } catch (error) {
    console.error("AI INSIGHT ERROR:", error);

    return NextResponse.json(
      { message: "Failed to generate AI insight" },
      { status: 500 }
    );
  }
}