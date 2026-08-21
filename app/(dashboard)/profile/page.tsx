"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3, BookOpen, CheckCircle2, Clock3, Heart, Pencil, Save, Sparkles, Target, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Problem = { difficulty: string; solved: boolean; topic: string; revisionDate?: string | null; revisionCount: number; maxRevisions: number; };
type User = { id: string; name: string | null; email: string | null; image?: string | null; createdAt?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function load() {
    const [u, p] = await Promise.all([fetch("/api/user", { cache: "no-store" }), fetch("/api/problems", { cache: "no-store" })]);
    if (u.ok) { const data = await u.json(); setUser(data.user); setName(data.user.name || ""); setEmail(data.user.email || ""); }
    if (p.ok) setProblems(await p.json());
  }
  useEffect(() => { load(); }, []);

  const solved = problems.filter((p) => p.solved).length;
  const percentage = problems.length ? Math.round((solved / problems.length) * 100) : 0;
  const due = problems.filter((p) => p.revisionDate && new Date(p.revisionDate) <= new Date() && p.revisionCount < p.maxRevisions).length;
  const difficulties = useMemo(() => ["Easy", "Medium", "Hard"].map((difficulty) => ({ difficulty, total: problems.filter((p) => p.difficulty === difficulty).length, solved: problems.filter((p) => p.difficulty === difficulty && p.solved).length })), [problems]);
  const initials = (user?.name || user?.email || "U").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  async function save() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
    const data = await res.json();
    if (res.ok) { setUser(data.user); setEditing(false); setMessage("Profile updated successfully."); } else setMessage(data.message || "Unable to update profile.");
    setSaving(false);
  }

  return <div className="mx-auto max-w-6xl space-y-8">
    <div><p className="text-sm font-medium text-primary">YOUR PROFILE</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Profile & progress</h1><p className="mt-2 text-muted-foreground">A clear picture of your DSA journey, all in one place.</p></div>

    <Card className="overflow-hidden">
      <div className="h-28 bg-gradient-to-r from-primary/20 via-primary/5 to-transparent" />
      <CardContent className="relative -mt-10 flex flex-col gap-5 p-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-end gap-4"><div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-background bg-primary text-xl font-bold text-primary-foreground shadow-lg">{initials}</div><div className="pb-1"><h2 className="text-2xl font-semibold">{user?.name || "Your name"}</h2><p className="text-sm text-muted-foreground">{user?.email || "No email"}</p></div></div>
        {!editing ? <Button variant="outline" onClick={() => setEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit profile</Button> : null}
      </CardContent>
    </Card>

    {editing && <Card><CardHeader><CardTitle>Edit profile</CardTitle></CardHeader><CardContent className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div><div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div><div className="flex gap-2 sm:col-span-2"><Button onClick={save} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save changes"}</Button><Button variant="ghost" onClick={() => setEditing(false)}><X className="mr-2 h-4 w-4" />Cancel</Button></div></CardContent></Card>}
    {message && <p className="text-sm text-muted-foreground">{message}</p>}

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {[[BookOpen,"Problems tracked",problems.length],[CheckCircle2,"Problems solved",solved],[Target,"Completion",`${percentage}%`],[Clock3,"Revision due",due]].map(([Icon,label,value]) => <Card key={String(label)}><CardContent className="p-5"><div className="flex items-center justify-between"><span className="text-sm text-muted-foreground">{String(label)}</span><Icon className="h-5 w-5 text-primary" /></div><p className="mt-3 text-3xl font-bold">{String(value)}</p></CardContent></Card>)}
    </div>

    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3"><CardHeader><CardTitle className="flex items-center gap-2"><BarChart3 className="h-5 w-5 text-primary" />Difficulty breakdown</CardTitle></CardHeader><CardContent className="space-y-6">{difficulties.map((item) => { const pct = item.total ? Math.round(item.solved / item.total * 100) : 0; return <div key={item.difficulty}><div className="mb-2 flex justify-between text-sm"><span className="font-medium">{item.difficulty}</span><span className="text-muted-foreground">{item.solved}/{item.total} solved</span></div><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} /></div></div>})}</CardContent></Card>
      <Card className="lg:col-span-2"><CardHeader><CardTitle>Quick insights</CardTitle></CardHeader><CardContent className="space-y-4">{problems.length === 0 ? <div className="rounded-xl bg-muted/60 p-4 text-sm text-muted-foreground">Start by adding your first DSA problem. Your profile will automatically build your progress here.</div> : <><div className="flex gap-3 rounded-xl bg-muted/60 p-4"><Sparkles className="mt-0.5 h-5 w-5 text-primary" /><p className="text-sm">You have completed <b>{percentage}%</b> of your tracked problems.</p></div><div className="flex gap-3 rounded-xl bg-muted/60 p-4"><Heart className="mt-0.5 h-5 w-5 text-primary" /><p className="text-sm">Keep your strongest problems favorited for quick revision.</p></div></>}</CardContent></Card>
    </div>
  </div>;
}
