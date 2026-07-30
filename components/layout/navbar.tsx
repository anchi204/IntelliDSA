"use client";

import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();

  const title =
    pathname.split("/")[1].charAt(0).toUpperCase() +
    pathname.split("/")[1].slice(1);

  return (
    <header className="flex h-16 items-center justify-between border-b px-8">
      <h2 className="text-2xl font-bold">
        {title}
      </h2>

      <div className="flex items-center gap-5">
        <Bell className="cursor-pointer" />

        <Avatar>
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}