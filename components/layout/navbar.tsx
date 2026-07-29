import { Bell } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Navbar() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-8">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div className="flex items-center gap-6">
        <Bell />

        <Avatar>
          <AvatarFallback>AK</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}