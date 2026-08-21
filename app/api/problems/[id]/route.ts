import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireUser } from "@/lib/auth";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(200).optional(), platform: z.string().trim().min(1).max(80).optional(), difficulty: z.enum(["Easy", "Medium", "Hard"]).optional(), topic: z.string().trim().min(1).max(100).optional(), link: z.string().trim().url().max(1000).optional().or(z.literal("")), notes: z.string().max(5000).optional().or(z.literal("")), solved: z.boolean().optional(), favorite: z.boolean().optional(), revisionDate: z.coerce.date().nullable().optional(), revisionDone: z.boolean().optional(), maxRevisions: z.number().int().min(0).max(50).optional(),
});
function parseId(value: string) { const id = Number(value); return Number.isInteger(id) && id > 0 ? id : null; }

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try { const user = await requireUser(); const id = parseId((await params).id); if (!id) return NextResponse.json({ message: "Invalid problem id" }, { status: 400 }); const existing = await prisma.problem.findFirst({ where: { id, userId: user.id } }); if (!existing) return NextResponse.json({ message: "Problem not found" }, { status: 404 }); await prisma.problem.delete({ where: { id } }); return NextResponse.json({ message: "Problem deleted successfully" }); }
  catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error("DELETE /api/problems/[id]", error); return NextResponse.json({ message: "Failed to delete problem" }, { status: 500 }); }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const id = parseId((await params).id); if (!id) return NextResponse.json({ message: "Invalid problem id" }, { status: 400 });
    const existing = await prisma.problem.findFirst({ where: { id, userId: user.id } }); if (!existing) return NextResponse.json({ message: "Problem not found" }, { status: 404 });
    const parsed = updateSchema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ message: "Invalid update data", issues: parsed.error.flatten() }, { status: 400 });
    const body = parsed.data; const data: Record<string, unknown> = {};
    for (const key of ["title", "platform", "difficulty", "topic", "favorite", "link", "notes", "revisionDate", "maxRevisions"] as const) if (body[key] !== undefined) data[key] = body[key] === "" ? null : body[key];
    if (body.solved !== undefined) {
      if (body.solved) { const solvedAt = new Date(); const difficulty = body.difficulty ?? existing.difficulty; const maxRevisions = difficulty === "Medium" ? 3 : difficulty === "Hard" ? 5 : 0; data.solved = true; data.solvedAt = solvedAt; data.revisionCount = 0; data.maxRevisions = maxRevisions; data.revisionDate = maxRevisions > 0 ? new Date(solvedAt.getTime() + 4 * 86400000) : null; }
      else { data.solved = false; data.solvedAt = null; data.revisionDate = null; data.revisionCount = 0; data.maxRevisions = 0; }
    }
    if (body.revisionDone) { if (!existing.revisionDate || existing.revisionCount >= existing.maxRevisions) return NextResponse.json({ message: "No revision is currently due" }, { status: 400 }); const nextCount = existing.revisionCount + 1; data.revisionCount = nextCount; data.revisionDate = nextCount >= existing.maxRevisions ? null : new Date(existing.revisionDate.getTime() + 4 * 86400000); }
    const updated = await prisma.problem.update({ where: { id }, data }); return NextResponse.json(updated);
  } catch (error) { if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 }); console.error("PATCH /api/problems/[id]", error); return NextResponse.json({ message: "Failed to update problem" }, { status: 500 }); }
}
