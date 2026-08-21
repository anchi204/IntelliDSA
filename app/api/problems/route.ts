import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const problemSchema = z.object({
  title: z.string().trim().min(1).max(200),
  platform: z.string().trim().min(1).max(80),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  topic: z.string().trim().min(1).max(100),
  link: z.string().trim().url().max(1000).optional().or(z.literal("")),
  notes: z.string().max(5000).optional().or(z.literal("")),
  revisionDate: z.coerce.date().nullable().optional(),
  maxRevisions: z.number().int().min(0).max(50).optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const problems = await prisma.problem.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(problems);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    console.error("GET /api/problems", error);
    return NextResponse.json({ message: "Failed to load problems" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const parsed = problemSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid problem data", issues: parsed.error.flatten() }, { status: 400 });
    const data = parsed.data;
    const problem = await prisma.problem.create({ data: { userId: user.id, title: data.title, platform: data.platform, difficulty: data.difficulty, topic: data.topic, link: data.link || null, notes: data.notes || null, revisionDate: data.revisionDate ?? null, maxRevisions: data.maxRevisions ?? 0 } });
    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    console.error("POST /api/problems", error);
    return NextResponse.json({ message: "Failed to create problem" }, { status: 500 });
  }
}
