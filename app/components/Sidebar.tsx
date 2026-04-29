"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Workflow,
  Box,
  Truck,
  Boxes,
  BarChart3,
  Settings,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
const handleLogout = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login";
};
function MenuItem({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center gap-2.5 rounded-md px-3 py-2.5 text-[13px] font-medium tracking-tight transition-colors duration-200 border border-transparent focus:outline-none focus:ring-0 ${
        isActive
          ? "bg-slate-800 text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]"
          : "text-slate-300 hover:text-white hover:bg-slate-800/50"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

export default function Sidebar() {
  return (
    <aside className="w-[240px] border-r border-slate-700/60 bg-[#0b1220]">
      <div className="border-b border-slate-700/60 px-6 py-6">
        <img src="/conduit-logo.png" className="h-8 w-auto opacity-90" />
      </div>

      <nav className="px-4 py-5 space-y-2">
        <MenuItem
          href="/"
          icon={<LayoutDashboard size={16} strokeWidth={2.2} />}
          label="Dashboard"
        />

        <MenuItem
          href="/workflow"
          icon={<Workflow size={16} strokeWidth={2.2} />}
          label="Workflow"
        />

        <MenuItem
          href="/products"
          icon={<Box size={16} strokeWidth={2.2} />}
          label="Products"
        />

        <MenuItem
          href="/suppliers"
          icon={<Truck size={16} strokeWidth={2.2} />}
          label="Suppliers"
        />

        <MenuItem
          href="/inventory"
          icon={<Boxes size={16} strokeWidth={2.2} />}
          label="Inventory"
        />

        <MenuItem
          href="/analytics"
          icon={<BarChart3 size={16} strokeWidth={2.2} />}
          label="Analytics"
        />

        <MenuItem
          href="/settings"
          icon={<Settings size={16} strokeWidth={2.2} />}
          label="Settings"
        />
        <div className="mt-auto p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-slate-400 rounded-md transition-colors hover:bg-slate-800 hover:text-white"
          >
            Log out
          </button>
        </div>
      </nav>
    </aside>
  );
}
