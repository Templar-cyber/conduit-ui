import {
  LayoutDashboard,
  Workflow,
  Package,
  Truck,
  Boxes,
  BarChart3,
  Settings,
} from "lucide-react";

import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

function MenuIcon({
  children,
  active = false,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition ${
        active
          ? "bg-orange-500/15 text-white"
          : "text-slate-300 hover:bg-slate-800/60 hover:text-white"
      }`}
    >
      {children}
    </div>
  );
}

function DotIcon() {
  return <div className="h-4 w-4 rounded-sm bg-slate-500/60" />;
}

function LogoMark() {
  return (
    <div className="flex items-center gap-3 px-3 py-4">
      {/* Logo Symbol */}
      <div className="relative h-7 w-7">
        {/* Backward C */}
        <div className="absolute inset-0 rounded-full border-[3px] border-orange-500 border-r-transparent"></div>

        {/* Vertical stroke */}
        <div className="absolute left-[9px] top-[6px] h-[12px] w-[3px] bg-orange-500 rounded"></div>
      </div>

      {/* Logo Text */}
      <span className="text-[18px] font-semibold tracking-[0.16em] text-white">
        CONDUIT
      </span>
    </div>
  );
}
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-[#0b1220] text-white antialiased`}
      >
        <div className="flex min-h-screen bg-[radial-gradient(circle_at_top,#182235_0%,#0f172a_32%,#0b1220_100%)]">
          <aside className="w-[255px] border-r border-slate-700/60 bg-[#0b1220]/95">
            <div className="border-b border-slate-700/60 px-6 py-6">
              <div className="flex items-center gap-3">
                <LogoMark />
              </div>
            </div>

            <nav className="px-4 py-5">
              <div className="space-y-2">
                <MenuIcon active>
                  <LayoutDashboard size={20} />
                  Dashboard
                </MenuIcon>

                <MenuIcon>
                  <Workflow size={20} />
                  Workflow
                </MenuIcon>

                <MenuIcon>
                  <Package size={20} />
                  Products
                </MenuIcon>

                <MenuIcon>
                  <Truck size={20} />
                  Suppliers
                </MenuIcon>

                <MenuIcon>
                  <Boxes size={20} />
                  Inventory
                </MenuIcon>

                <MenuIcon>
                  <BarChart3 size={20} />
                  Analytics
                </MenuIcon>

                <MenuIcon>
                  <Settings size={20} />
                  Settings
                </MenuIcon>
              </div>
            </nav>
          </aside>

          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
