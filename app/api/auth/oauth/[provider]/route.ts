import crypto from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

const allowed = new Set(["google", "github"]);
export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider.toLowerCase(); if (!allowed.has(provider)) return NextResponse.json({ message: "Unsupported provider" }, { status: 400 });
  const state = crypto.randomBytes(24).toString("hex"); const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin; const callback = `${origin}/api/auth/oauth/${provider}/callback`;
  const store = await import("next/headers").then((m) => m.cookies()); store.set(`oauth_state_${provider}`, state, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", maxAge: 600, path: "/" });
  if (provider === "google") {
    const url = new URL("https://accounts.google.com/o/oauth2/v2/auth"); url.searchParams.set("client_id", process.env.GOOGLE_CLIENT_ID || ""); url.searchParams.set("redirect_uri", callback); url.searchParams.set("response_type", "code"); url.searchParams.set("scope", "openid email profile"); url.searchParams.set("state", state); return NextResponse.redirect(url);
  }
  const url = new URL("https://github.com/login/oauth/authorize"); url.searchParams.set("client_id", process.env.GITHUB_CLIENT_ID || ""); url.searchParams.set("redirect_uri", callback); url.searchParams.set("scope", "read:user user:email"); url.searchParams.set("state", state); return NextResponse.redirect(url);
}
