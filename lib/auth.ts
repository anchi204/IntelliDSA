import crypto from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "intellidsa_session";
const SESSION_DAYS = 30;
const secret = () => process.env.AUTH_SECRET || "development-only-change-me";
const b64 = (value: string | Buffer) => Buffer.from(value).toString("base64url");
const sign = (value: string) => b64(crypto.createHmac("sha256", secret()).update(value).digest());

function issueJwt(userId: string, expiresAt: Date) {
  const header = b64(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = b64(JSON.stringify({ sub: userId, exp: Math.floor(expiresAt.getTime() / 1000) }));
  return `${header}.${payload}.${sign(`${header}.${payload}`)}`;
}

function verifyJwt(token: string) {
  try {
    const [header, payload, signature] = token.split(".");
    if (!header || !payload || !signature) return null;
    const expected = sign(`${header}.${payload}`);
    const actualBuffer = Buffer.from(signature), expectedBuffer = Buffer.from(expected);
    if (actualBuffer.length !== expectedBuffer.length || !crypto.timingSafeEqual(actualBuffer, expectedBuffer)) return null;
    const data = JSON.parse(Buffer.from(payload, "base64url").toString()) as { sub?: string; exp?: number };
    return data.sub && data.exp && data.exp * 1000 > Date.now() ? data.sub : null;
  } catch { return null; }
}

export async function hashPassword(password: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}
export async function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split(":");
  if (!salt || !expected) return false;
  const actual = crypto.scryptSync(password, salt, 64), expectedBuffer = Buffer.from(expected, "hex");
  return actual.length === expectedBuffer.length && crypto.timingSafeEqual(actual, expectedBuffer);
}
export async function createSession(userId: string) {
  const sessionToken = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + SESSION_DAYS * 86400000);
  await prisma.session.create({ data: { sessionToken, userId, expires } });
  const store = await cookies();
  store.set(SESSION_COOKIE, issueJwt(userId, expires), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", expires, path: "/" });
}
export async function getCurrentUser() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const userId = verifyJwt(token);
  if (!userId) return null;
  const session = await prisma.session.findFirst({ where: { userId, expires: { gt: new Date() } } });
  if (!session) return null;
  return prisma.user.findUnique({ where: { id: userId } });
}
export async function requireUser() { const user = await getCurrentUser(); if (!user) throw new Error("UNAUTHORIZED"); return user; }
export async function destroySession() { (await cookies()).delete(SESSION_COOKIE); }
