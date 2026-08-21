import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const provider = (await params).provider.toLowerCase(); if (provider !== "google" && provider !== "github") return NextResponse.redirect(new URL("/login?error=provider", req.url));
  const code = req.nextUrl.searchParams.get("code"); const state = req.nextUrl.searchParams.get("state"); const store = await import("next/headers").then((m) => m.cookies()); const expected = store.get(`oauth_state_${provider}`)?.value; store.delete(`oauth_state_${provider}`);
  if (!code || !state || !expected || state !== expected) return NextResponse.redirect(new URL("/login?error=oauth_state", req.url));
  try {
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.nextUrl.origin; const redirectUri = `${origin}/api/auth/oauth/${provider}/callback`;
    let providerId = "", email = "", name = "", image: string | null = null;
    if (provider === "google") {
      const tokenRes = await fetch("https://oauth2.googleapis.com/token", { method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" }, body: new URLSearchParams({ code, client_id: process.env.GOOGLE_CLIENT_ID || "", client_secret: process.env.GOOGLE_CLIENT_SECRET || "", redirect_uri: redirectUri, grant_type: "authorization_code" }) });
      if (!tokenRes.ok) throw new Error("Google token exchange failed"); const token = await tokenRes.json(); const infoRes = await fetch("https://openidconnect.googleapis.com/v1/userinfo", { headers: { Authorization: `Bearer ${token.access_token}` } }); if (!infoRes.ok) throw new Error("Google userinfo failed"); const info = await infoRes.json(); providerId = String(info.sub); email = String(info.email || "").toLowerCase(); name = String(info.name || ""); image = typeof info.picture === "string" ? info.picture : null;
    } else {
      const tokenRes = await fetch("https://github.com/login/oauth/access_token", { method: "POST", headers: { Accept: "application/json", "Content-Type": "application/json" }, body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID || "", client_secret: process.env.GITHUB_CLIENT_SECRET || "", code, redirect_uri: redirectUri }) }); if (!tokenRes.ok) throw new Error("GitHub token exchange failed"); const token = await tokenRes.json();
      const infoRes = await fetch("https://api.github.com/user", { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}`, "X-GitHub-Api-Version": "2022-11-28" } }); if (!infoRes.ok) throw new Error("GitHub profile failed"); const info = await infoRes.json(); providerId = String(info.id); name = String(info.name || info.login || ""); image = typeof info.avatar_url === "string" ? info.avatar_url : null;
      const emailRes = await fetch("https://api.github.com/user/emails", { headers: { Accept: "application/vnd.github+json", Authorization: `Bearer ${token.access_token}`, "X-GitHub-Api-Version": "2022-11-28" } }); const emails = emailRes.ok ? await emailRes.json() : []; email = String((emails.find((e: { email?: string; primary?: boolean; verified?: boolean }) => e.primary && e.verified) || emails.find((e: { email?: string; verified?: boolean }) => e.verified))?.email || "").toLowerCase();
    }
    if (!providerId || !email) return NextResponse.redirect(new URL("/login?error=no_email", req.url));
    let user = await prisma.user.findUnique({ where: { email } });
    if (!user) user = await prisma.user.create({ data: { email, name: name || null, image } }); else if ((!user.image && image) || (!user.name && name)) user = await prisma.user.update({ where: { id: user.id }, data: { image: user.image || image, name: user.name || name } });
    await prisma.account.upsert({ where: { provider_providerAccountId: { provider, providerAccountId: providerId } }, create: { provider, providerAccountId: providerId, userId: user.id, type: "oauth" }, update: { userId: user.id } });
    await createSession(user.id); return NextResponse.redirect(new URL("/dashboard", req.url));
  } catch (error) { console.error("OAuth callback", error); return NextResponse.redirect(new URL("/login?error=oauth", req.url)); }
}
