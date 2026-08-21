"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, ChevronDown, LogOut, Settings, UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string | null; email?: string | null }>({});
  const [open, setOpen] = useState(false);
  const segment = pathname.split("/").filter(Boolean)[0] || "dashboard";
  const titles: Record<string, string> = { dashboard: "Dashboard", problems: "Problems", analytics: "Analytics", ai: "AI Mentor", profile: "Profile", settings: "Settings" };

  useEffect(() => { fetch("/api/user", { cache: "no-store" }).then(async (r) => { if (r.ok) { const d = await r.json(); setUser(d.user); } }).catch(() => {}); }, [pathname]);
  const initials = (user.name || user.email || "U").split(" ").map((x) => x[0]).join("").slice(0, 2).toUpperCase();

  async function logout() { await fetch("/api/auth/logout", { method: "POST" }); window.location.href = "/login"; }

  return <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b bg-background/90 px-4 backdrop-blur sm:px-8">
    <div><h2 className="text-lg font-semibold sm:text-xl">{titles[segment] || "IntelliDSA"}</h2><p className="hidden text-xs text-muted-foreground sm:block">Build consistency. Master DSA.</p></div>
    <div className="flex items-center gap-2">
      <button className="rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Notifications"><Bell className="h-5 w-5" /></button>
      <div className="relative"><button onClick={() => setOpen(!open)} className="flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-muted"><Avatar className="h-8 w-8"><AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">{initials}</AvatarFallback></Avatar><span className="hidden max-w-28 truncate text-sm font-medium sm:block">{user.name || "Account"}</span><ChevronDown className="hidden h-4 w-4 text-muted-foreground sm:block" /></button>
        {open && <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-popover p-2 shadow-xl"><div className="border-b px-3 pb-3 pt-2"><p className="truncate text-sm font-medium">{user.name || "Account"}</p><p className="truncate text-xs text-muted-foreground">{user.email || ""}</p></div><Link href="/profile" onClick={() => setOpen(false)} className="mt-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><UserRound className="h-4 w-4" />Profile</Link><Link href="/settings" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"><Settings className="h-4 w-4" />Settings</Link><button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-destructive hover:bg-destructive/10"><LogOut className="h-4 w-4" />Sign out</button></div>}
      </div>
    </div>
  </header>;
}
