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
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

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

    // update UI immediately
    setItems((prev) =>
      prev.map((item) =>
        item.id.toString() === itemId ? { ...item, status: newStatus } : item,
      ),
    );

    // then update database
    await supabase
      .from("order_items")
      .update({ status: newStatus })
      .eq("id", itemId);

    loadOrders();
  }
  function openOrder(orderId: number) {
    const order = items.find((i) => i.id === orderId);
    if (order) {
      setSelectedOrder(order);
    }
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
        <div
          className={`grid grid-cols-7 gap-3 border border-slate-700/60 transition-all duration-200`}
        >
          {STATUSES.map((status) => (
            <Droppable key={status.key} droppableId={status.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[120px] border-r border-slate-700/60 last:border-r-0"
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
                        isDragDisabled={!!selectedOrder}
                      >
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            onClick={() => {
                              if (selectedOrder?.id === item.id) {
                                setSelectedOrder(null);
                              } else {
                                openOrder(item.id);
                              }
                            }}
                            className={`relative mb-2 border border-slate-700 bg-slate-800 px-2 py-2 transition select-none ${
                              selectedOrder
                                ? selectedOrder.id === item.id
                                  ? "opacity-100 z-50"
                                  : "opacity-30 hover:opacity-50 hover:brightness-110 hover:-translate-y-[2px]"
                                : "opacity-100 hover:brightness-110 hover:-translate-y-[2px]"
                            }`}
                          >
                            {/* CARD CONTENT */}

                            <div
                              {...provided.dragHandleProps}
                              className={`px-2 py-1 text-[12px] font-semibold text-white rounded-t ${
                                selectedOrder
                                  ? "cursor-not-allowed"
                                  : "cursor-grab"
                              } ${
                                item.status === "NEW"
                                  ? "bg-blue-600"
                                  : item.status === "GARMENT_ORDERED"
                                    ? "bg-amber-600"
                                    : item.status === "SENT_TO_PRINTER"
                                      ? "bg-purple-600"
                                      : item.status === "WITH_PRINTER"
                                        ? "bg-indigo-600"
                                        : item.status === "LEFT_PRINTER"
                                          ? "bg-pink-600"
                                          : item.status === "QA"
                                            ? "bg-green-600"
                                            : item.status === "SHIPPED"
                                              ? "bg-gray-600"
                                              : "bg-slate-600"
                              }`}
                            >
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
      <div>
        <div
          className={`fixed right-0 top-0 h-full w-[420px] bg-slate-900 border-slate-700 shadow-2x1 transform transition-transform duration-300 ease-in-out ${selectedOrder ? "translate-x-0" : "translate-x-full"}`}
        >
          <div className="p-4 border-b border-slate-700 flex justify-between items-center">
            <div className="text-sm font-semibold text-white">
              Order #{selectedOrder?.id}
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="text-slate-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div className="p-4 space-y-3 text-sm">
            <div className="text-slate-300">
              <span className="text-slate-500">Product:</span>{" "}
              {selectedOrder?.product_name}
            </div>

            <div className="text-slate-300">
              <span className="text-slate-500">Customer:</span>{" "}
              {selectedOrder?.orders?.customer_name}
            </div>

            <div className="text-slate-300">
              <span className="text-slate-500">Email:</span>{" "}
              {selectedOrder?.orders?.customer_email}
            </div>

            <div className="text-slate-300">
              <span className="text-slate-500">Status:</span>{" "}
              {selectedOrder?.status}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
