"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/logo";
import { LayoutDashboard, BookOpen, BarChart3, User, Settings, Sparkles } from "lucide-react";

const links = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Problems", href: "/problems", icon: BookOpen },
  { name: "AI Mentor", href: "/ai", icon: Sparkles },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
];
const accountLinks = [
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

function NavItem({ name, href, icon: Icon, pathname }: { name: string; href: string; icon: typeof User; pathname: string }) {
  const active = pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-[18px] w-[18px] transition-transform group-hover:scale-105" />{name}</Link>;
}

export default function Sidebar() {
  const pathname = usePathname();
  return <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-background px-4 py-5 lg:block"><div className="px-2"><Logo /></div><div className="mt-10"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Workspace</p><nav className="space-y-1">{links.map((item) => <NavItem key={item.href} {...item} pathname={pathname} />)}</nav></div><div className="mt-8"><p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Account</p><nav className="space-y-1">{accountLinks.map((item) => <NavItem key={item.href} {...item} pathname={pathname} />)}</nav></div><div className="absolute bottom-5 left-4 right-4 rounded-2xl bg-muted/60 p-4"><p className="text-sm font-semibold">Keep going 🚀</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Consistency beats intensity. Solve one more problem today.</p></div></aside>;
}
