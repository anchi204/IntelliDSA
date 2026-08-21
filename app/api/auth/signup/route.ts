import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession, hashPassword } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json());
    if (!parsed.success) return NextResponse.json({ message: "Invalid signup details" }, { status: 400 });
    const { name, email, password } = parsed.data;
    const normalizedEmail = email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) return NextResponse.json({ message: "An account with this email already exists" }, { status: 409 });
    const user = await prisma.user.create({ data: { name: name || null, email: normalizedEmail, passwordHash: await hashPassword(password) } });
    await createSession(user.id);
    return NextResponse.json({ user: { id: user.id, name: user.name, email: user.email } }, { status: 201 });
  } catch (error) {
    console.error("POST /api/auth/signup", error);
    return NextResponse.json({ message: "Unable to create account" }, { status: 500 });
  }
}
