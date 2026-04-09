"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "../../lib/supabase";
import SidePanel from "../components/SidePanel";
import { OrderItem } from "../types";
import SummaryBar from "../components/SummaryBar";

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
  const [noteInput, setNoteInput] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
id,
status:order_status,
product_name,
customer_name,
customer_email,
created_at,
colour,
size
`,
      )
      .order("id", { ascending: false });

    if (error) {
      console.error("LOAD ERROR:", error);
      return;
    }

    if (data && Array.isArray(data)) {
      const mapped = data.map((row: any) => ({
        id: row.id,
        status: row.status,
        product_name: row.product_name,
        orders: {
          customer_name: row.customer_name,
          customer_email: row.customer_email,
          created_at: row.created_at,
          colour: row.colour,
          size: row.size,
        },
      }));

      setItems(mapped);
    } else {
      setItems([]);
    }
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
      .from("orders")
      .update({ order_status: newStatus })
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
  const filteredItems = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.product_name?.toLowerCase().includes(search) ||
      item.orders?.customer_name?.toLowerCase().includes(search) ||
      String(item.id).includes(search)
    );
  });
  filteredItems.forEach((item) => {
    console.log("ITEM STATUS:", item.status);
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
    <>
      <div className="mt-6 mb-6 flex items-center w-full pl-5 pr-4">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-[20px] font-semibold tracking-tight text-white">
            CONDUIT Workflow
          </h1>
        </div>

        {/* CENTER */}
        <div className="flex-1 flex justify-center">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[260px] rounded-md border border-slate-600 bg-slate-800 px-3 py-1.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-white/30"
          />
        </div>

        {/* RIGHT SPACER */}
        <div className="flex-1" />
      </div>

      {/* SUMMARY ROW */}
      <div className="pl-5 pr-4 mb-4">
        <SummaryBar items={filteredItems} />
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

                  <div className="text-center font-semibold tracking-wide py-2">
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
                        {(provided, snapshot) => {
                          const cardState =
                            selectedOrder?.id === item.id
                              ? "opacity-100 z-50 ring-1 ring-slate-700 shadow-xl"
                              : selectedOrder
                                ? "opacity-30"
                                : "opacity-100 hover:brightness-110 hover:-translate-y-[3px]";
                          return (
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
                              className={`select-none relative mb-2 bg-slate-800 px-2 py-2 rounded-md ${cardState}`}
                            >
                              {/* CARD CONTENT */}

                              <div
                                {...provided.dragHandleProps}
                                className={`px-2 py-1 text-[12px] font-semibold text-white ${selectedOrder ? "cursor-not-allowed" : "cursor-grab"} ${
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

                              <div className="px-3 py-2 text-sm text-slate-200 space-y-1">
                                {/* Order ID */}

                                {/* Product */}
                                <div className="text-sm font-medium text-white leading-tight">
                                  {item.product_name}
                                </div>

                                {/* Customer */}
                                <div className="text-sm text-slate-400">
                                  {item.orders?.customer_name || "No name"}
                                </div>

                                {/* Date */}
                                <div className="text-[12px] text-slate-500">
                                  {item.orders?.created_at
                                    ? new Date(
                                        item.orders.created_at,
                                      ).toLocaleDateString("en-GB", {
                                        day: "2-digit",
                                        month: "short",
                                      })
                                    : ""}
                                </div>
                              </div>
                            </div>
                          );
                        }}
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
        {false && (
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 pointer-events-none"
          />
        )}
      </div>

      {selectedOrder && (
        <SidePanel
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </>
  );
}
