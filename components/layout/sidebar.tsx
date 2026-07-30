"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/common/logo";
import {
  LayoutDashboard,
  BookOpen,
  BarChart3,
  User,
  Settings,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Problems",
    href: "/problems",
    icon: BookOpen,
  },
  {
    name: "Analytics",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r h-screen p-6">
      <div className="mb-8">
        <Logo />
      </div>

      <div className="space-y-2">
        {links.map((link) => {
          const Icon = link.icon;

          return (
            <Link
              key={link.name}
              href={link.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                pathname === link.href
                  ? "bg-primary text-white"
                  : "hover:bg-muted"
              }`}
            >
              <Icon size={20} />
              {link.name}
            </Link>
          );
        })}
      </div>
    </aside>
  );
}