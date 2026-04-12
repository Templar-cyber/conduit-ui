"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { OrderItem } from "../types";

type Props = {
  selectedOrder: OrderItem | null;
  onClose: () => void;
};

export default function SidePanel({ selectedOrder, onClose }: Props) {
  console.log("SIDE PANEL LOADED");

  console.log("SELECTED ORDER FULL:", selectedOrder); //

  const [notes, setNotes] = useState<any[]>([]);
  const [noteInput, setNoteInput] = useState("");
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [noteAdded, setNoteAdded] = useState(false);
  const [events, setEvents] = useState<any[]>([]);

  const getDuration = (currentEvent: any, nextEvent: any) => {
    if (!nextEvent) return null;

    const current = new Date(currentEvent.created_at).getTime();
    const next = new Date(nextEvent.created_at).getTime();

    const diff = Math.floor((current - next) / 1000);
    const minutes = Math.floor(diff / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    }

    return `${minutes}m`;
  };
  const getSLALevel = (durationStr: string | null) => {
    if (!durationStr) return null;

    let mins = 0;

    if (durationStr.includes("h")) {
      const parts = durationStr.split("h");
      const hours = parseInt(parts[0]) || 0;
      const minutes = parseInt(parts[1]) || 0;
      mins = hours * 60 + minutes;
    } else {
      mins = parseInt(durationStr) || 0;
    }

    if (mins > 4320) return "problem";
    if (mins > 2880) return "slow";
    return "fast";
  };
  const rawDate = selectedOrder?.date || selectedOrder?.created_at;

  const parsedDate = rawDate
    ? rawDate.includes("/")
      ? new Date(rawDate.split("/").reverse().join("-")) // FIX: DD/MM/YYYY
      : new Date(rawDate)
    : null;

  const orderAgeMins = parsedDate
    ? Math.floor((Date.now() - parsedDate.getTime()) / (1000 * 60))
    : null;
  console.log("RAW DATE:", rawDate);
  console.log("PARSED DATE:", parsedDate);
  console.log("AGE MINS:", orderAgeMins);
  const orderSLA =
    orderAgeMins && orderAgeMins > 7200 // 5 days
      ? "problem"
      : "ok";

  const latestEvent = events[0];

  const latestDuration = latestEvent
    ? Math.floor(
        (Date.now() - new Date(latestEvent.created_at).getTime()) / (1000 * 60),
      )
    : null;

  const latestSLA = latestDuration ? getSLALevel(`${latestDuration}m`) : null;

  const getSLAColor = (sla: string | null) => {
    if (!sla) return "text-gray-400";
    if (sla === "problem") return "text-red-500";
    if (sla === "slow") return "text-yellow-400";
    return "text-green-400";
  };
  const getStatusColor = (sla: string | null) => {
    if (!sla) return "text-white";
    if (sla === "problem") return "text-red-500";
    if (sla === "slow") return "text-amber-400";
    return "text-green-400";
  };
  useEffect(() => {
    if (!selectedOrder) return;

    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from("notes")
        .select("*")
        .eq("order_id", selectedOrder.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setNotes(data);
      }
    };
    const fetchEvents = async () => {
      const { data, error } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", selectedOrder.id)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setEvents(data);
      }
    };
    fetchNotes();
    fetchEvents();
  }, [selectedOrder]);

  return (
    <div
      className="fixed inset-0 bg-black/30 z-40"
      onClick={() => {
        if (noteInput.trim().length > 0) {
          const confirmClose = confirm(
            "You have an unsaved note. Are you sure you want to close?",
          );
          if (!confirmClose) return;
        }
        onClose();
      }}
    >
      {/* SIDE PANEL */}
      <div
        className="fixed right-0 top-0 z-50 h-full w-[420px] bg-slate-900 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div>
            <div className="text-sm font-semibold text-white">
              Order BOTTOM TEST #{selectedOrder.id}
            </div>

            <div className="text-xs text-slate-400">
              {new Date(selectedOrder.orders?.created_at).toLocaleDateString()}
            </div>
          </div>

          <button
            onClick={() => {
              if (noteInput.trim().length > 0) {
                const confirmClose = confirm(
                  "You have an unsaved note. Are you sure you want to close?",
                );
                if (!confirmClose) return;
              }
              onClose();
            }}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 flex flex-col min-h-0 text-sm">
          {/* FIXED HEADER */}
          <div className="p-4 border-b border-slate-700 space-y-3 bg-slate-900">
            {/* Order ID */}
            <div className="text-sm font-semibold text-white">
              Order TOP TEST #{selectedOrder.id}
            </div>

            {/* Order Date */}
            <div>
              <div className="text-slate-400 text-xs">Date</div>
              <div>
                {selectedOrder.orders?.created_at
                  ? new Date(
                      selectedOrder.orders.created_at,
                    ).toLocaleDateString()
                  : "No date"}
              </div>
            </div>

            {/* Customer */}
            <div>
              <div className="text-slate-400 text-xs">Customer</div>
              <div>{selectedOrder.orders?.customer_name || "No name"}</div>
            </div>

            {/* Email */}
            <div>
              <div className="text-slate-400 text-xs">Email</div>
              <div>{selectedOrder.orders?.customer_email || "No email"}</div>
            </div>

            {/* Ordered Product */}
            <div>
              <div className="text-slate-400 text-xs">Ordered Product</div>
              <div>
                {[
                  selectedOrder.product_name,
                  selectedOrder.orders?.colour,
                  selectedOrder.orders?.size,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No product details"}
              </div>
            </div>

            {/* Status */}
            <div>
              <div className="text-slate-400 text-xs">Status</div>
              <div
                className={`font-semibold ${
                  orderSLA === "problem" ? "text-red-500" : "text-green-400"
                }`}
              >
                {selectedOrder.status}
              </div>
            </div>
          </div>
          {/* EVENTS TIMELINE */}
          <div className="p-4 border-b border-slate-700 space-y-2">
            <div className="text-xs text-slate-400">Activity</div>

            {events.length === 0 ? (
              <div className="text-xs text-slate-500">No activity yet</div>
            ) : (
              events.map((event, i) => {
                const nextEvent = events[i + 1];
                const duration = getDuration(event, nextEvent);
                const sla = getSLALevel(duration);

                return (
                  <div key={i} className="text-xs text-slate-300 space-y-1">
                    <div className="flex justify-between text-slate-500">
                      <span>{event.actor_id || "system"}</span>

                      <span className="flex gap-2 items-center">
                        {new Date(event.created_at).toLocaleString("en-GB", {
                          timeZone: "Europe/London",
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })}

                        {duration && (
                          <span className={`text-[11px] ${getSLAColor(sla)}`}>
                            {duration}
                          </span>
                        )}
                      </span>
                    </div>

                    {/* 👇 THIS is where your description goes */}
                    <div>{event.event_description}</div>
                  </div>
                );
              })
            )}
          </div>
          {/* NOTES SECTION */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-slate-400 text-xs">Notes</div>

              {!showAddNote && (
                <button
                  onClick={() => setShowAddNote(true)}
                  className="text-xs bg-blue-500 px-2 py-1 rounded"
                >
                  Add Note
                </button>
              )}
            </div>

            {showAddNote && (
              <div className="space-y-2 mb-3">
                <textarea
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-2 resize-none"
                  placeholder="Add note..."
                />
                <div className="flex gap-2">
                  <button
                    onClick={async () => {
                      const text = noteInput.trim();
                      if (!text) return;
                      if (text.split(" ").filter(Boolean).length < 3) {
                        const confirmAdd = confirm(
                          "Are you sure you want to add this very short note?",
                        );

                        if (!confirmAdd) return;
                      }
                      const { data, error } = await supabase
                        .from("notes")
                        .insert({
                          order_id: selectedOrder.id,
                          note: text,
                          user: "Paul",
                        })
                        .select();

                      if (!error && data) {
                        setNotes((prev) => [data[0], ...prev]);
                        setNoteInput("");
                        setShowAddNote(false);
                        setNoteAdded(true);

                        setTimeout(() => {
                          setNoteAdded(false);
                        }, 1500);
                      } else {
                        alert(JSON.stringify(error));
                      }
                    }}
                    className="bg-blue-600 hover:bg-green-700 px-3 py-1 rounded text-sm text-white"
                  >
                    Save
                  </button>

                  <button
                    onClick={() => {
                      setShowAddNote(false);
                      setNoteInput("");
                    }}
                    className="bg-slate-600 px-3 py-1 rounded text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-2">
              {notes.map((note, i) => (
                <div
                  key={i}
                  className="bg-slate-800 p-3 rounded border border-slate-700"
                >
                  <div className="text-xs text-slate-400 mb-1 flex justify-between">
                    <span>{note.user}</span>
                    <span>
                      {new Date(note.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="text-sm text-white whitespace-pre-wrap">
                    {note.note}
                  </div>
                </div>
              ))}
            </div>

            {/* SUCCESS MESSAGE */}
            {noteAdded && (
              <div className="text-green-400 text-xs mt-1">Note added</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
