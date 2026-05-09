"use client";
import { Outfit } from "next/font/google";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export default function PortalMenuPage() {
  const router = useRouter();
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.push("/portal-login");
      }
    };

    checkUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/portal-login");
  };
  const menuItems = [
    { label: "Latest Orders", route: "/portal/orders" },
    { label: "Order History", route: "/portal/history" },
    { label: "Available Stock (CSV)", route: "/portal/stock" },
    { label: "Print Files", route: "/portal/prints" },
    { label: "Update Shipping", route: "/portal/shipping" },
    { label: "Report Issue", route: "/portal/issues" },
  ];

  return (
    <div className="min-h-screen flex relative">
      {/* LEFT SIDE */}
      <div className="w-1/2 bg-white flex items-center justify-center relative">
        <button
          onClick={handleLogout}
          className="absolute top-6 right-6 text-base font-medium text-gray-700 hover:text-red-600 transition cursor-pointer px-3 py-1 rounded-md hover:bg-red-50"
        >
          Log out
        </button>

        <div className="w-[420px] space-y-8">
          {/* LOGO */}
          <div className="flex justify-center">
            <img
              src="/CONDUIT_logo_on_white.jpeg"
              alt="CONDUIT"
              className="h-60
               object-contain"
            />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-semibold text-black text-center">
            Supplier Portal
          </h1>

          {/* MENU */}
          <div className="space-y-4">
            {menuItems.map((item) => (
              <div
                key={item.label}
                onClick={() => router.push(item.route)}
                className="p-4 rounded-lg cursor-pointer text-black font-medium bg-yellow-100 hover:bg-yellow-200 transition"
              >
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-1/2 relative overflow-hidden">
        {/* Background image */}
        <img
          src="/portal-bg.jpeg"
          alt="Supply chain network"
          className="absolute inset-0 w-full h-full object-cover scale-105"
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-700/80 to-indigo-900/80" />

        {/* Depth layer */}
        <div className="absolute inset-0 bg-black/10" />

        {/* Center brand */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          {/* SaaS background words */}
          <div className="absolute inset-0 pointer-events-none">
            <span className="absolute top-[15%] left-[10%] text-white/10 text-[28px]">
              Achievement
            </span>

            <span className="absolute top-[30%] right-[12%] text-white/10 text-[22px]">
              Gratification
            </span>

            <span className="absolute bottom-[25%] left-[8%] text-white/10 text-[26px]">
              Realisation
            </span>

            <span className="absolute top-[50%] right-[18%] text-white/10 text-[20px]">
              Contentment
            </span>

            <span className="absolute bottom-[15%] right-[10%] text-white/10 text-[30px]">
              Completion
            </span>

            <span className="absolute top-[32%] left-[20%] text-white/10 text-[24px]">
              Execution
            </span>

            <span className="absolute bottom-[35%] left-[25%] text-white/10 text-[18px]">
              Satisfaction
            </span>
          </div>

          {/* Ghosted logo */}
          <img
            src="/CONDUIT_logo_on_white.jpeg"
            alt="CONDUIT"
            className="w-[320px] max-w-[70%] object-contain opacity-40"
          />

          {/* Strapline */}

          <div className={`${outfit.className} text-center -mt-6`}>
            <div className="text-[72px] font-semibold tracking-[0.12em] leading-tight opacity-30">
              Fulfilment
            </div>

            <div className="text-[32px] font-light tracking-[0.3em] uppercase opacity-30 mt-2">
              made simple
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
