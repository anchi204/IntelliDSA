import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  const problems = await prisma.problem.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(problems);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const problem = await prisma.problem.create({
    data: {
      title: body.title,
      platform: body.platform,
      difficulty: body.difficulty,
      topic: body.topic,
      solved: false,
      favorite: false,
    },
  });

  return NextResponse.json(problem);
}