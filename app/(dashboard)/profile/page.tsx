"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Mail, Pencil, Save, UserRound, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = { id: string; name: string | null; email: string | null; image?: string | null; createdAt?: string };

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => { fetch("/api/user", { cache: "no-store" }).then(async (r) => { if (r.ok) { const d = await r.json(); setUser(d.user); setName(d.user.name || ""); setEmail(d.user.email || ""); } }); }, []);

  const initials = (user?.name || user?.email || "U").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();
  const joined = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" }) : "—";

  async function save() {
    setSaving(true); setMessage("");
    const res = await fetch("/api/user", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email }) });
    const data = await res.json();
    if (res.ok) { setUser(data.user); setEditing(false); setMessage("Profile updated successfully."); } else setMessage(data.message || "Unable to update profile.");
    setSaving(false);
  }

  return <div className="mx-auto max-w-4xl space-y-8">
    <div><p className="text-sm font-medium text-primary">ACCOUNT</p><h1 className="mt-1 text-3xl font-bold tracking-tight">Your profile</h1><p className="mt-2 text-muted-foreground">Manage the personal details connected to your IntelliDSA account.</p></div>
    <Card className="overflow-hidden">
      <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
      <CardContent className="relative px-6 pb-7 pt-0 sm:px-8">
        <div className="-mt-10 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between"><div className="flex items-end gap-4"><div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border-4 border-background bg-primary text-xl font-bold text-primary-foreground shadow-lg">{initials}</div><div className="pb-1"><h2 className="text-2xl font-semibold">{user?.name || "Your name"}</h2><p className="text-sm text-muted-foreground">{user?.email || "No email"}</p></div></div><Button variant="outline" onClick={() => setEditing(!editing)}>{editing ? <><X className="mr-2 h-4 w-4" />Cancel</> : <><Pencil className="mr-2 h-4 w-4" />Edit profile</>}</Button></div>
        <div className="mt-8 grid gap-4 sm:grid-cols-2"><div className="rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"><Mail className="h-4 w-4" />Email address</div><p className="mt-2 font-medium">{user?.email || "—"}</p></div><div className="rounded-xl border bg-muted/30 p-4"><div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground"><CalendarDays className="h-4 w-4" />Member since</div><p className="mt-2 font-medium">{joined}</p></div></div>
      </CardContent>
    </Card>

    {editing && <Card><CardContent className="space-y-5 p-6 sm:p-8"><div className="flex items-center gap-3"><div className="rounded-lg bg-primary/10 p-2 text-primary"><UserRound className="h-5 w-5" /></div><div><h2 className="font-semibold">Edit your details</h2><p className="text-sm text-muted-foreground">These details are used across your account.</p></div></div><div className="grid gap-5 sm:grid-cols-2"><div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} /></div><div className="space-y-2"><Label>Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" /></div></div><Button onClick={save} disabled={saving}><Save className="mr-2 h-4 w-4" />{saving ? "Saving..." : "Save changes"}</Button>{message && <p className="text-sm text-muted-foreground">{message}</p>}</CardContent></Card>}
  </div>;
}
