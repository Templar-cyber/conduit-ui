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
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [bulkStatus, setBulkStatus] = useState("Ordered");
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
              <div className="flex items-center justify-between mb-4 max-w-[900px]">
                <h2 className="text-2xl font-bold text-gray-800">{supplier}</h2>

                <div className="flex gap-3 items-center">
                  <select
                    value={bulkStatus}
                    onChange={(e) => setBulkStatus(e.target.value)}
                    className="w-[140px] px-2 py-1 text-xs font-small border border-gray-300 rounded-lg bg-white text-s"
                  >
                    <option value="Ordered">Ordered</option>
                    <option value="Awaiting Garment">Awaiting Garment</option>
                    <option value="Mailed Out">Mailed Out</option>
                  </select>

                  <button
                    onClick={() => {
                      const updatedStatuses = { ...statuses };

                      selectedItems.forEach((id) => {
                        updatedStatuses[id] = bulkStatus;
                      });

                      setStatuses(updatedStatuses);

                      setSelectedItems([]);
                    }}
                    className="px-4 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition"
                  >
                    Apply to Selected
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-[52px_130px_2fr_65px_65px_95px_160px_85px] gap-3 bg-gray-50 border border-gray-200 rounded-t-xl px-2.5 py-2 mb-2 max-w-[900px] ">
                <div className="flex items-center justify-start pl-[1px] pr-[4px]">
                  <input
                    type="checkbox"
                    checked={
                      supplierItems.length > 0 &&
                      supplierItems.every((item) =>
                        selectedItems.includes(item.id),
                      )
                    }
                    onChange={() => {
                      const supplierItemIds = supplierItems.map(
                        (item) => item.id,
                      );

                      const allSelected = supplierItemIds.every((id) =>
                        selectedItems.includes(id),
                      );

                      if (allSelected) {
                        setSelectedItems((prev) =>
                          prev.filter((id) => !supplierItemIds.includes(id)),
                        );
                      } else {
                        setSelectedItems((prev) => [
                          ...new Set([...prev, ...supplierItemIds]),
                        ]);
                      }
                    }}
                    className="h-4 w-4 rounded border-gray-300"
                  />
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-left">
                  Order ID
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-left">
                  Product
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-left">
                  Qty
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-left">
                  Size
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-left">
                  Colour
                </div>

                <div className="text-xs font-semibold uppercase text-gray-400 text-center">
                  Value
                </div>
                <div className="text-xs font-semibold uppercase text-gray-400 text-centre">
                  Status
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
                    status={statuses[item.id] || "Ordered"}
                    selected={selectedItems.includes(item.id)}
                    onSelect={() => {
                      setSelectedItems((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id],
                      );
                    }}
                    onStatusChange={() => {
                      setStatuses((prev) => ({
                        ...prev,
                        [item.id]:
                          item.supplier_name === "Murgens Keep"
                            ? prev[item.id] === "Ordered"
                              ? "Awaiting Garment"
                              : prev[item.id] === "Awaiting Garment"
                                ? "Mailed Out"
                                : "Ordered"
                            : prev[item.id] === "Mailed Out"
                              ? "Ordered"
                              : "Mailed Out",
                      }));
                    }}
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
