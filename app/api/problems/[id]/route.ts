import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getAdaptiveRevisionSchedule } from "@/lib/revision-engine";

const results = ["EASY", "OKAY", "STRUGGLED", "FAILED"] as const;
const schema = z.object({
  title: z.string().trim().min(1).max(200).optional(), platform: z.string().trim().min(1).max(80).optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(), topic: z.string().trim().min(1).max(100).optional(),
  link: z.string().trim().url().max(1000).optional().or(z.literal("")), notes: z.string().max(5000).optional().or(z.literal("")),
  solved: z.boolean().optional(), attempted: z.boolean().optional(), favorite: z.boolean().optional(),
  revisionEnabled: z.boolean().optional(), maxRevisions: z.number().int().min(1).max(50).optional(),
  revisionIntervalDays: z.number().int().min(1).max(30).optional(), revisionResult: z.enum(results).optional()
});
function parseId(v: string) { const id = Number(v); return Number.isInteger(id) && id > 0 ? id : null; }

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const id = parseId((await params).id);
    if (!id) return NextResponse.json({ message: "Invalid problem id" }, { status: 400 });
    const p = await prisma.problem.findFirst({ where: { id, userId: user.id } });
    if (!p) return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    await prisma.problem.delete({ where: { id } }); return NextResponse.json({ message: "Problem deleted successfully" });
  } catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error(error); return NextResponse.json({ message: "Failed to delete problem" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const id = parseId((await params).id);
    if (!id) return NextResponse.json({ message: "Invalid problem id" }, { status: 400 });
    const existing = await prisma.problem.findFirst({ where: { id, userId: user.id }, include: {
      attempts: { orderBy: { attemptedAt: "desc" }, take: 20 }, revisions: { orderBy: { revisedAt: "desc" }, take: 10 }
    }});
    if (!existing) return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid update data", issues: parsed.error.flatten() }, { status: 400 });
    const b = parsed.data; const data: Record<string, unknown> = {};
    for (const k of ["title","platform","difficulty","topic","favorite","link","notes","revisionEnabled","maxRevisions","revisionIntervalDays"] as const)
      if (b[k] !== undefined) data[k] = b[k] === "" ? null : b[k];

    if (b.revisionEnabled === false) { data.maxRevisions = 0; data.revisionDate = null; }
    if (b.revisionEnabled === true) {
      data.maxRevisions = b.maxRevisions ?? (existing.maxRevisions || 5);
      data.revisionIntervalDays = b.revisionIntervalDays ?? existing.revisionIntervalDays;
      if (existing.solved && existing.revisionCount < Number(data.maxRevisions) && !existing.revisionDate)
        data.revisionDate = new Date(Date.now() + Number(data.revisionIntervalDays) * 86400000);
    }

    if (b.attempted) await prisma.problemAttempt.create({ data: { problemId: id, solved: false } });

    if (b.solved !== undefined) {
      if (b.solved) {
        await prisma.problemAttempt.create({ data: { problemId: id, solved: true } });
        data.solved = true; data.solvedAt = new Date();
        const enabled = b.revisionEnabled ?? existing.revisionEnabled;
        const max = b.maxRevisions ?? existing.maxRevisions;
        const gap = b.revisionIntervalDays ?? existing.revisionIntervalDays;
        if (enabled && max > 0) { data.revisionDate = new Date(Date.now() + gap * 86400000); data.revisionCount = 0; }
      } else { data.solved = false; data.solvedAt = null; data.revisionDate = null; }
    }

    if (b.revisionResult) {
      const now = new Date();
      if (!existing.revisionEnabled || existing.maxRevisions <= existing.revisionCount || !existing.revisionDate || existing.revisionDate > now)
        return NextResponse.json({ message: "No revision is currently due" }, { status: 400 });
      const schedule = await getAdaptiveRevisionSchedule({ problem: existing, result: b.revisionResult, userPreferredGapDays: user.preferredRevisionIntervalDays });
      const nextCount = existing.revisionCount + 1;
      const nextDate = nextCount >= existing.maxRevisions ? null : schedule.nextDate;
      await prisma.revisionHistory.create({ data: { problemId: id, revisionNumber: nextCount, result: b.revisionResult, nextRevisionDate: nextDate }});
      data.revisionCount = nextCount; data.revisionDate = nextDate;
    }

    return NextResponse.json(await prisma.problem.update({ where: { id }, data }));
  } catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error("PATCH /api/problems/[id]", error); return NextResponse.json({ message: "Failed to update problem" }, { status: 500 }); }
}