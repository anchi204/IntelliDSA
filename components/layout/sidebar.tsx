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
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  return <aside className="w-full shrink-0 border-b p-4 sm:w-64 sm:border-b-0 sm:border-r sm:p-6">
    <div className="mb-4 sm:mb-8"><Logo /></div>
    <nav className="flex gap-2 overflow-x-auto sm:block sm:space-y-2">
      {links.map(({ name, href, icon: Icon }) => <Link key={name} href={href} className={`flex shrink-0 items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition sm:px-4 sm:py-3 ${pathname === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-5 w-5" />{name}</Link>)}
    </nav>
  </aside>;
}
