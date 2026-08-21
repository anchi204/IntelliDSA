"use client";

import { useEffect, useState } from "react";
import { Bell, BrainCircuit, Check, LogOut, Palette, Shield, UserRound } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saved, setSaved] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => { fetch("/api/user", { cache: "no-store" }).then(async (r) => { if (!r.ok) return; const d = await r.json(); setName(d.user.name || ""); setEmail(d.user.email || ""); }); }, []);

  async function saveProfile() {
    const r = await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
    if (r.ok) { setSaved(true); setTimeout(() => setSaved(false), 2500); }
  }

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }

  function toggleTheme() { const next = !dark; setDark(next); document.documentElement.classList.toggle("dark", next); localStorage.setItem("intellidsa-theme", next ? "dark" : "light"); }

  useEffect(() => { setDark(localStorage.getItem("intellidsa-theme") === "dark"); }, []);

  return <div className="mx-auto max-w-5xl space-y-8">
    <div><p className="text-sm font-medium text-primary">PREFERENCES</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Settings</h1><p className="mt-2 text-muted-foreground">Manage your account and make IntelliDSA feel like yours.</p></div>

    <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
      <div className="hidden space-y-1 lg:block"><p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Account</p><a href="#profile" className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-sm font-medium"><UserRound className="h-4 w-4" />Profile</a><a href="#appearance" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Palette className="h-4 w-4" />Appearance</a><a href="#preferences" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground hover:bg-muted"><Bell className="h-4 w-4" />Preferences</a></div>
      <div className="space-y-6">
        <Card id="profile"><CardHeader><CardTitle className="flex items-center gap-2"><UserRound className="h-5 w-5 text-primary" />Profile information</CardTitle><p className="text-sm text-muted-foreground">Update the information associated with your account.</p></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div><div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div><div className="sm:col-span-2"><Button onClick={saveProfile}>{saved ? <><Check className="mr-2 h-4 w-4" />Saved</> : "Save changes"}</Button></div></CardContent></Card>

        <Card id="appearance"><CardHeader><CardTitle className="flex items-center gap-2"><Palette className="h-5 w-5 text-primary" />Appearance</CardTitle><p className="text-sm text-muted-foreground">Choose how IntelliDSA looks on this device.</p></CardHeader><CardContent><button onClick={toggleTheme} className="flex w-full items-center justify-between rounded-xl border p-4 text-left transition hover:bg-muted/50"><div><p className="font-medium">Dark mode</p><p className="text-sm text-muted-foreground">Use a darker interface that is easier on the eyes.</p></div><span className={`relative h-6 w-11 rounded-full transition ${dark ? "bg-primary" : "bg-muted"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-background transition ${dark ? "left-6" : "left-1"}`} /></span></button></CardContent></Card>

        <Card id="preferences"><CardHeader><CardTitle className="flex items-center gap-2"><BrainCircuit className="h-5 w-5 text-primary" />Tracker preferences</CardTitle><p className="text-sm text-muted-foreground">Understand how the intelligent revision system works.</p></CardHeader><CardContent className="space-y-3"><div className="rounded-xl bg-muted/60 p-4 text-sm"><b>Revision scheduling</b><p className="mt-1 text-muted-foreground">Medium problems can receive up to 3 revision cycles and Hard problems up to 5. Revision dates are managed automatically when you complete a revision.</p></div><div className="rounded-xl bg-muted/60 p-4 text-sm"><b>AI Mentor</b><p className="mt-1 text-muted-foreground">AI features run server-side. Your API key is never exposed to the browser.</p></div></CardContent></Card>

        <Card className="border-destructive/20"><CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><Shield className="h-5 w-5" />Account security</CardTitle></CardHeader><CardContent><Button variant="outline" onClick={logout}><LogOut className="mr-2 h-4 w-4" />Sign out</Button><p className="mt-3 text-xs text-muted-foreground">Your current session will be ended on this device.</p></CardContent></Card>
      </div>
    </div>
  </div>;
}
