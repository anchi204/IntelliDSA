import Sidebar from "./sidebar";
import Navbar from "./navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1">
        <Navbar />

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}