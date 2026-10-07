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
  revisionEnabled: z.boolean().optional(),
  maxRevisions: z.number().int().min(1).max(50).optional(),
  revisionIntervalDays: z.number().int().min(1).max(30).optional(),
});

export async function GET() {
  try {
    const user = await requireUser();
    const problems = await prisma.problem.findMany({
      where: { userId: user.id },
      include: {
        _count: { select: { attempts: true, revisions: true } },
        attempts: { orderBy: { attemptedAt: "desc" }, take: 1, select: { solved: true, attemptedAt: true } },
        revisions: { orderBy: { revisedAt: "desc" }, take: 1, select: { result: true, revisedAt: true, nextRevisionDate: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(
      problems.map(function (p) {
        const { _count, attempts, revisions, ...problem } = p;
        return {
          ...problem,
          attempted: _count.attempts > 0,
          attemptCount: _count.attempts,
          lastAttempt: attempts[0] || null,
          lastRevision: revisions[0] || null,
        };
      }),
    );
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    console.error("GET /api/problems", error);
    return NextResponse.json({ message: "Failed to load problems" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const parsed = problemSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ message: "Invalid problem data", issues: parsed.error.flatten() }, { status: 400 });
    }

    const d = parsed.data;
    const enabled = d.revisionEnabled ?? false;
    const problem = await prisma.problem.create({
      data: {
        userId: user.id,
        title: d.title,
        platform: d.platform,
        difficulty: d.difficulty,
        topic: d.topic,
        link: d.link || null,
        notes: d.notes || null,
        revisionEnabled: enabled,
        maxRevisions: enabled ? (d.maxRevisions ?? 5) : 0,
        revisionIntervalDays: d.revisionIntervalDays ?? user.preferredRevisionIntervalDays,
      },
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    }
    console.error("POST /api/problems", error);
    return NextResponse.json({ message: "Failed to create problem" }, { status: 500 });
  }
}