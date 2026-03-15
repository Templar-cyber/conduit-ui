"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "../lib/supabase";

type OrderItem = {
  id: number;
  status: string;
  product_name: string;
  orders: {
    customer_name: string;
    customer_email: string;
  };
};

const STATUSES = [
  { key: "NEW", label: "New Orders" },
  { key: "GARMENT_ORDERED", label: "Garment Ordered" },
  { key: "IN_TRANSIT_TO_PRINTER", label: "Sent To Printer" },
  { key: "WITH_PRINTER", label: "With Printer" },
  { key: "PRINTING_COMPLETE_IN_TRANSIT", label: "Left Printer" },
  { key: "QA", label: "QA" },
  { key: "SHIPPED_TO_CUSTOMER", label: "Shipped" },
];

export default function Page() {
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from("order_items")
      .select(
        `
id,
status,
product_name,
orders (
customer_name,
customer_email
)
`,
      )

      .order("id", { ascending: false });

    if (data) setItems(data);
  }

  async function handleDragEnd(result: any) {
    if (!result.destination) return;

    const itemId = result.draggableId;
    const newStatus = result.destination.droppableId;

    await supabase
      .from("order_items")
      .update({ status: newStatus })
      .eq("id", itemId);

    loadOrders();
  }

  const grouped: Record<string, OrderItem[]> = {};

  STATUSES.forEach((s) => {
    grouped[s.key] = [];
  });

  items.forEach((item) => {
    if (grouped[item.status]) {
      grouped[item.status].push(item);
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
    <div className="flex-1 px-7 py-7">
      {/* PAGE TITLE */}

      <h1 className="mb-6 text-[20px] font-semibold tracking-tight text-white">
        CONDUIT Workflow
      </h1>

      {/* SUMMARY ROW */}

      <div className="mb-6 grid grid-cols-4 w-fit border border-slate-700/60 text-[13px] text-slate-300">
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

      {/* WORKFLOW BOARD */}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-3 border border-slate-700/60">
          {STATUSES.map((status) => (
            <Droppable key={status.key} droppableId={status.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[580px] border-r border-slate-700/60 last:border-r-0"
                >
                  {/* COLUMN HEADER */}

                  <div className="border-b border-slate-700/60 px-3 py-2 text-[13px] text-slate-300">
                    {status.label}
                  </div>

                  {/* CARDS */}

                  <div className="px-2 py-2">
                    {grouped[status.key].map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={String(item.id)}
                        index={index}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className={`mb-2 border border-slate-700 bg-slate-800 px-2 py-2 transition-all duration-150${
                              snapshot.isDragging
                                ? "shadow-2xl scale-[1.02]"
                                : "shadow-md hover:shadow-x1 hover:-translate-y-[1px]"
                            }`}
                          >
                            {/* CARD CONTENT */}

                            <div className="text-[13px] font-semibold text-white">
                              Order #{item.id}
                            </div>

                            <div className="mt-1 text-[12px] text-slate-200">
                              {item.product_name}
                            </div>

                            <div className="mt-1 text-[12px] text-slate-300">
                              {item.orders?.customer_name}
                            </div>

                            <div className="text-[11px] text-slate-400">
                              {item.orders?.customer_email}
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
