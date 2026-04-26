import Sidebar from "../components/Sidebar"; // adjust if your path differs

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* SIDEBAR */}
      <div className="w-64 border-r bg-white">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 overflow-auto p-6">{children}</div>
    </div>
  );
}
