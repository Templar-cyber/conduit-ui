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
    <div className="mb-6 grid grid-cols-4 w-fit border border-slate-700/60 text-sm">
      <div className="border-r border-slate-700/60 px-4 py-3">
        New Orders:{" "}
        <span className="font-semibold text-white">{newOrders}</span>
      </div>

      <div className="border-r border-slate-700/60 px-4 py-3">
        In Production:{" "}
        <span className="font-semibold text-white">{inProduction}</span>
      </div>

      <div className="border-r border-slate-700/60 px-4 py-3">
        Ready to Ship:{" "}
        <span className="font-semibold text-white">{readyToShip}</span>
      </div>

      <div className="px-4 py-3">
        Delayed: <span className="font-semibold text-white">{delayed}</span>
      </div>
    </div>
  );
}
