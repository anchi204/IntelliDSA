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

    const revisionProblems = problems.filter(
      (problem: any) =>
        problem.solved &&
        problem.revisionDate &&
        problem.revisionCount < problem.maxRevisions
    );

    if (revisionProblems.length === 0) {
      return NextResponse.json({
        recommendation:
          "You have no pending revisions right now. Keep solving new problems and stay consistent with your practice.",
      });
    }

    const revisionData = revisionProblems.map((problem: any) => ({
      title: problem.title,
      topic: problem.topic,
      difficulty: problem.difficulty,
      revisionDate: problem.revisionDate,
      revisionCount: problem.revisionCount,
      maxRevisions: problem.maxRevisions,
      favorite: problem.favorite,
    }));

    const prompt = `
You are a DSA revision assistant.

The user has the following problems pending for revision:

${JSON.stringify(revisionData)}

Analyze them and recommend what the user should revise first.

Consider:
- Whether the revision is already due
- Revision count
- Difficulty
- Topic
- Favorite status

Give a short recommendation in 2-4 sentences.

Mention the most important problem or topic to revise first.
Keep the language simple and practical.
Do not use complicated words.
`;

    const response = await openai.responses.create({
      model: "gpt-5-mini",
      input: prompt,
    });

    return NextResponse.json({
      recommendation: response.output_text,
    });
  } catch (error) {
    console.error("AI REVISION ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to generate revision recommendation",
      },
      { status: 500 }
    );
  }
}