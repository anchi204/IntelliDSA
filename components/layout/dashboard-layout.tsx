import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-muted/20"><div className="flex min-h-screen"><Sidebar /><main className="min-w-0 flex-1"><Navbar /><div className="p-4 sm:p-6 lg:p-8">{children}</div></main></div></div>;
}
