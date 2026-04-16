"use client";
import { useEffect, useState, useMemo } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { supabase } from "../../lib/supabase";
import SidePanel from "../components/SidePanel";
import { OrderItem } from "../types";
import SummaryBar from "../components/SummaryBar";

function getStatusColour(updatedAt: string) {
  if (!updatedAt) return "bg-emerald-500/40";

  const now = new Date();
  const updated = new Date(updatedAt);

  const diffMs = now.getTime() - updated.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays >= 2) return "bg-red-500/40";
  if (diffDays >= 1) return "bg-amber-500/40";

  return "bg-emerald-500/40";
}

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
updated_at,
colour,
size
`,
      )
      .order("id", { ascending: false });

    console.log("ORDERS RAW:", data);

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
          updated_at: row.updated_at,
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
    console.log("DRAG FIRED", result);
    if (!result.destination) return;

    const itemId = result.draggableId;
    const newStatus = result.destination.droppableId;

    // update UI immediately
    setItems((prev) =>
      prev.map((item) =>
        item.id.toString() === itemId
          ? {
              ...item,
              status: newStatus,
              orders: {
                ...item.orders,
                updated_at: new Date().toISOString(),
              },
            }
          : item,
      ),
    );
    // then update database
    await supabase
      .from("orders")
      .update({
        order_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", Number(itemId));

    console.log("STEP 1 - before insert");

    const { data, error } = await supabase
      .from("order_events")
      .insert([
        {
          order_id: Number(itemId),
          event_type: "STATUS_CHANGE",
          event_description: `Moved to ${newStatus}`,
          actor_id: "user_paul", // 👈 ADD HERE
          actor_type: "USER", // 👈 ADD HERE
        },
      ])
      .select();

    console.log("STEP 2 - after insert", { data, error });

    if (error) {
      console.error("EVENT ERROR:", error);
    }

    //loadOrders();
  }

  async function openOrder(orderId: number | string) {
    console.log("OPEN ORDER CALLED", orderId);
    console.log("OPEN ORDER TRIGGERED", orderId);
    const order = items.find((i) => i.id === Number(orderId));

    if (order) {
      const { data: events, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", Number(orderId))
        .order("created_at", { ascending: false });

      if (error) {
        console.error("EVENT FETCH ERROR:", error);
      } else {
        console.log("ORDER EVENTS:", events);
      }

      setSelectedOrder(order);
    }
  }
  const filtered = items.filter((item) => {
    const search = searchTerm.toLowerCase();

    return (
      item.product_name?.toLowerCase().includes(search) ||
      item.customer_name?.toLowerCase().includes(search) ||
      String(item.id).includes(search)
    );
  });
  const grouped = useMemo(() => {
    const result: Record<string, OrderItem[]> = {};

    // Initialise empty arrays for each status
    STATUSES.forEach((s) => {
      result[s.key] = [];
    });

    // Group filtered items into the correct buckets
    filtered.forEach((item) => {
      console.log("STATUS CHECK:", item.status);
      const statusKey = item.status?.toUpperCase();

      if (result[statusKey]) {
        result[statusKey].push(item);
      }
    });

    return result;
  }, [filtered]);

  console.log(
    "ITEM SAMPLE FULL:",
    JSON.stringify(grouped["NEW"]?.[0], null, 2),
  );
  console.log("FULL ITEM KEYS:", Object.keys(grouped["NEW"]?.[0] || {}));

  const newOrders = grouped["NEW"]?.length || 0;

  const inProduction =
    (grouped["GARMENT_ORDERED"]?.length || 0) +
    (grouped["IN_TRANSIT_TO_PRINTER"]?.length || 0) +
    (grouped["WITH_PRINTER"]?.length || 0);

  const readyToShip =
    (grouped["PRINTING_COMPLETE_IN_TRANSIT"]?.length || 0) +
    (grouped["QA"]?.length || 0);

  const delayed = 0;
  const hasData = filtered.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="mt-6 mb-6 flex items-center w-full pl-5 pr-4 bg-transparent">
        {/* LEFT */}
        <div className="flex-1">
          <h1 className="text-[18px] font-smedium tracking-tight text-slate-300 uppercase">
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
        <SummaryBar items={filtered} />
      </div>
      {/* WORKFLOW BOARD */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-7 gap-x-2 gap-y- max-w-[1400px] mx-auto">
          {STATUSES.map((status) => (
            <Droppable key={status.key} droppableId={status.key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="min-h-[120px] bg-slate-900/40 rounded-xl px-1 py-2"
                >
                  <div className="text-center text-sm text-gray-400 mb-2">
                    {status.label}
                  </div>

                  {grouped[status.key]?.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={String(item.id)}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          onClick={() => openOrder(item.id)}
                          className="mb-2 rounded-lg bg-slate-800/70 backdrop-blur-sm border border-slate-700 overflow-hidden"
                        >
                          {/* 🔴🟠🟢 HEADER STRIP (DRAG HANDLE ONLY) */}
                          <div
                            {...provided.dragHandleProps}
                            className={`px-3 py-1 text-xs text-slate-200 font-medium cursor-grab ${getStatusColour(
                              item.orders?.updated_at,
                            )}`}
                          >
                            Order #{item.id}
                          </div>

                          {/* CARD CONTENT (NOT DRAGGABLE) */}
                          <div className="px-3 py-2">
                            <div className="text-sm text-slate-300 font-medium">
                              {item.product_name || "—"}
                            </div>

                            <div className="text-xs text-slate-400">
                              {item.orders?.customer_name ||
                                "Awaiting customer"}
                            </div>

                            <div className="text-xs text-slate-500">
                              {item.orders?.created_at
                                ? new Date(
                                    item.orders.created_at,
                                  ).toLocaleDateString()
                                : ""}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {selectedOrder && (
        <SidePanel
          selectedOrder={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
}
