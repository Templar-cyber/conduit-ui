"use client";

import { useEffect, useState } from "react";
import SummaryBar from "@/app/components/SummaryBar";
import { createBrowserClient } from "@supabase/ssr";

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("order_items").select("*");

      if (error) {
        console.error("Error fetching orders:", error.message);
      } else {
        setItems(data || []);
      }
    };

    fetchOrders();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();

    // force redirect back to login
    window.location.href = "/login";
  };

  useEffect(() => {
    const run = async () => {
      // Wait for session to stabilise
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      console.log("LOOKING FOR ID:", user.id);

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      console.log("PROFILE:", profile, error);
    };

    run();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <SummaryBar items={items} />
    </div>
  );
}
