"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import SupplierOrderCard from "@/app/components/SupplierOrderCard";

type OrderItem = {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  size: string;
  colour: string;
  order_value: number;
  supplier_name: string;
};

export default function OrdersPage() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const groupedItems = items.reduce(
    (acc, item) => {
      const supplier = item.supplier_name || "Unknown Supplier";

      if (!acc[supplier]) {
        acc[supplier] = [];
      }

      acc[supplier].push(item);

      return acc;
    },
    {} as Record<string, OrderItem[]>,
  );

  useEffect(() => {
    const fetchItems = async () => {
      const { data, error } = await supabase
        .from("supplier_orders_view")
        .select("*");

      console.log(JSON.stringify(data, null, 2));
      console.log("ERROR:", error);

      if (data) {
        setItems(data);
      }

      setLoading(false);
    };

    fetchItems();
  }, []);

  if (loading) {
    return <div className="p-10 text-xl">Loading supplier orders...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-10">
        <Link href="/portal/menu" className="text-blue-600 hover:underline">
          ← Back to Menu
        </Link>

        <h1 className="text-5xl font-bold mt-6 mb-10 text-gray-900">
          Supplier Orders
        </h1>

        <div className="space-y-10">
          {Object.entries(groupedItems).map(([supplier, supplierItems]) => (
            <div key={supplier} className="py-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{supplier}</h2>
              </div>
              <div className="grid grid-cols-[120px_2fr_60px_70px_90px_100px] gap-3 border-b border-gray-200 pb-3 mb-3 max-w-[900px]">
                <div className="text-xs font-semibold uppercase text-gray-400">
                  Order ID
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400">
                  Product
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400">
                  Qty
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400">
                  Size
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400">
                  Colour
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-right">
                  Value
                </div>
              </div>
              <div className="space-y-3">
                {supplierItems.map((item) => (
                  <SupplierOrderCard
                    key={item.id}
                    product_name={item.product_name}
                    quantity={item.quantity}
                    supplier_name={item.supplier_name}
                    size={item.size}
                    colour={item.colour}
                    order_id={item.order_id}
                    order_value={item.order_value}
                  />
                ))}
              </div>

              <div className="mt-6 max-w-[900px] flex justify-end items-start pr-[20x]">
                <div className="inline-flex flex-col text-right">
                  <p className="text-sm uppercase tracking-wide text-gray-500 mb-2">
                    Total
                  </p>

                  <div className="text-lg font-bold text-green-600">
                    £
                    {supplierItems
                      .reduce((sum, item) => sum + Number(item.order_value), 0)
                      .toFixed(2)}
                  </div>

                  <div className="text-xs text-gray-500 mt-1">
                    {supplierItems.length} items
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
