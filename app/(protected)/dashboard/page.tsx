"use client";

import { useEffect, useState } from "react";
import SummaryBar from "@/app/components/SummaryBar";
import { supabase } from "@/lib/supabase";

export default function DashboardPage() {
  const [items, setItems] = useState<any[]>([]);

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>

      <SummaryBar items={items} />
    </div>
  );
}
