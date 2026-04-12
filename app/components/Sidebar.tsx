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
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all ${
        isActive
          ? "bg-slate-800 text-white"
          : "text-slate-400 hover:text-white hover:bg-slate-800/50"
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
          icon={<LayoutDashboard size={18} />}
          label="Dashboard"
        />
        <MenuItem
          href="/workflow"
          icon={<Workflow size={18} />}
          label="Workflow"
        />
        <MenuItem href="/products" icon={<Box size={18} />} label="Products" />
        <MenuItem
          href="/suppliers"
          icon={<Truck size={18} />}
          label="Suppliers"
        />
        <MenuItem
          href="/inventory"
          icon={<Boxes size={18} />}
          label="Inventory"
        />
        <MenuItem
          href="/analytics"
          icon={<BarChart3 size={18} />}
          label="Analytics"
        />
        <MenuItem
          href="/settings"
          icon={<Settings size={18} />}
          label="Settings"
        />
      </nav>
    </aside>
  );
}
