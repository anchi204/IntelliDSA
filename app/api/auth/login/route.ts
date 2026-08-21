import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, verifyPassword } from "@/lib/auth";

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid login details" }, { status: 400 });
    const user = await prisma.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
    if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
      return NextResponse.json({ message: "Invalid email or password" }, { status: 401 });
    }
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } });
  } catch (error) {
    console.error("POST /api/auth/login", error);
    return NextResponse.json({ message: "Unable to sign in" }, { status: 500 });
  }
}
