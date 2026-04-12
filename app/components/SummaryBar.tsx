"use client";

import { OrderItem } from "../types";

type Props = {
  items: OrderItem[];
};

export default function SummaryBar({ items = [] }) {
  const grouped: Record<string, OrderItem[]> = {};

  const STATUSES = [
    "NEW",
    "GARMENT_ORDERED",
    "IN_TRANSIT_TO_PRINTER",
    "WITH_PRINTER",
    "PRINTING_COMPLETE_IN_TRANSIT",
    "QA",
    "SHIPPED_TO_CUSTOMER",
  ];

  STATUSES.forEach((s) => {
    grouped[s] = [];
  });

  if (!items || items.length === 0) return null;
  items.forEach((item) => {
    console.log("ITEM SAMPLE:", item);

    const status = item.status || item.order_status;

    if (grouped[status]) {
      grouped[status].push(item);
    }
  });
  const newOrders = grouped["NEW"]?.length || 0;

  const inProduction =
    (grouped["GARMENT_ORDERED"]?.length || 0) +
    (grouped["IN_TRANSIT_TO_PRINTER"]?.length || 0) +
    (grouped["WITH_PRINTER"]?.length || 0);

  const readyToShip =
    (grouped["PRINTING_COMPLETE_IN_TRANSIT"]?.length || 0) +
    (grouped["QA"]?.length || 0);

  const delayed = 0;

  return (
    <div className="flex gap-12 pl-5 pr-4 mb-6 border-b border-slate-700/40 pb-4">
      {/* NEW ORDERS */}
      <div className="flex flex-col min-w-[90px]">
        <span className="text-[18px] font-semibold text-white">
          {newOrders}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
          New Orders
        </span>
      </div>

      {/* IN PRODUCTION */}
      <div className="flex flex-col min-w-[90px]">
        <span className="text-[18px] font-semibold text-white">
          {inProduction}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
          In Production
        </span>
      </div>

      {/* READY TO SHIP */}
      <div className="flex flex-col min-w-[90px]">
        <span className="text-[18px] font-semibold text-white">
          {readyToShip}
        </span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Ready to Ship
        </span>
      </div>

      {/* DELAYED */}
      <div className="flex flex-col min-w-[90px]">
        <span className="text-[18px] font-semibold text-white">{delayed}</span>
        <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400">
          Delayed
        </span>
      </div>
    </div>
  );
}
