"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import SummaryBar from "@/app/components/SummaryBar";

export default function Page() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data, error } = await supabase.from("orders").select("*");

      console.log("ORDERS DATA:", data);
      console.log("ORDERS ERROR:", error);

      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-white mb-4">Dashboard</h1>

      <SummaryBar items={orders} />
    </div>
  );
}
