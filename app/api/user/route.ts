import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";

const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(254),
});

export async function GET() {
  try {
    const user = await requireUser();
    const [problemCount, solvedCount, favoriteCount, revisionCount] = await Promise.all([
      prisma.problem.count({ where: { userId: user.id } }),
      prisma.problem.count({ where: { userId: user.id, solved: true } }),
      prisma.problem.count({ where: { userId: user.id, favorite: true } }),
      prisma.problem.count({ where: { userId: user.id, revisionDate: { lte: new Date() }, revisionCount: { lt: 1 } } }),
    ]);

    return NextResponse.json({
      user: { id: user.id, name: user.name, email: user.email, image: user.image, createdAt: user.createdAt },
      stats: { total: problemCount, solved: solvedCount, favorites: favoriteCount, revisionDue: revisionCount },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    console.error("GET /api/user", error);
    return NextResponse.json({ message: "Unable to load profile" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const parsed = profileSchema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Please enter a valid name and email" }, { status: 400 });

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findFirst({ where: { email, NOT: { id: user.id } }, select: { id: true } });
    if (existing) return NextResponse.json({ message: "That email is already in use" }, { status: 409 });

    const updated = await prisma.user.update({ where: { id: user.id }, data: { name: parsed.data.name, email } });
    return NextResponse.json({ user: { id: updated.id, name: updated.name, email: updated.email, image: updated.image } });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") return NextResponse.json({ message: "Authentication required" }, { status: 401 });
    console.error("PATCH /api/user", error);
    return NextResponse.json({ message: "Unable to update profile" }, { status: 500 });
  }
}
