"use client";

import { useState } from "react";

type Order = {
  id: string;
  product: string;
  qty: number;
  price: number;
};

const mockOrders: Order[] = [
  { id: "#10452", product: "Black Hoodie (Large)", qty: 2, price: 25 },
  { id: "#10453", product: "White Tee (Medium)", qty: 1, price: 15 },
  { id: "#10454", product: "Grey Hoodie (Large)", qty: 3, price: 25 },
];

export default function PortalListWithPanel() {
  const [selected, setSelected] = useState<Order | null>(null);
  const [notes, setNotes] = useState("");

  const totalItems = mockOrders.reduce((acc, o) => acc + o.qty, 0);
  const totalValue = mockOrders.reduce((acc, o) => acc + o.qty * o.price, 0);

  return (
    <div className="flex h-full bg-white text-gray-900">
      {/* LEFT SIDE */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-semibold mb-6">Supplier Orders</h1>

        <div className="border border-gray-200 rounded-lg overflow-hidden">
          {/* HEADER */}
          <div className="grid grid-cols-5 gap-4 px-4 py-3 text-xs font-semibold text-gray-500 border-b bg-gray-50">
            <div>Order #</div>
            <div className="col-span-2">Product</div>
            <div>Qty</div>
            <div className="text-right">Total</div>
          </div>

          {/* ROWS */}
          {mockOrders.map((order) => (
            <div
              key={order.id}
              onClick={() => {
                setSelected(order);
                setNotes("");
              }}
              className="
grid grid-cols-5 gap-4
px-4 py-4
border-b border-gray-200
cursor-pointer
hover:bg-gray-50
transition
"
            >
              <div className="font-mono text-sm">{order.id}</div>
              <div className="col-span-2 text-sm">{order.product}</div>
              <div className="text-sm">{order.qty}</div>
              <div className="text-sm text-right font-medium">
                £{order.qty * order.price}
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY */}
        <div className="mt-6 text-right text-sm font-semibold">
          Items: {totalItems} &nbsp; | &nbsp; Total: £{totalValue}
        </div>
      </div>

      {/* RIGHT PANEL */}
      {selected && (
        <div className="w-[320px] border-l border-gray-200 bg-white p-5 relative">
          {/* CLOSE BUTTON */}
          <button
            onClick={() => setSelected(null)}
            className="absolute top-3 right-3 text-gray-400 hover:text-black"
          >
            ✕
          </button>

          <h2 className="text-lg font-semibold mb-4">{selected.id}</h2>

          <div className="text-sm mb-2">
            <span className="font-medium">Product:</span>
            <br />
            {selected.product}
          </div>

          <div className="text-sm mb-4">
            <span className="font-medium">Quantity:</span> {selected.qty}
            <br />
            <span className="font-medium">Price:</span> £{selected.price}
          </div>

          <label className="text-xs text-gray-500">Notes</label>

          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add notes..."
            className="
mt-2 w-full
border border-gray-300
rounded-md
p-2
text-sm
focus:outline-none
focus:ring-2 focus:ring-blue-600
"
            rows={6}
          />

          <button
            className="
mt-4 w-full
bg-blue-600 text-white
py-2 rounded-md
text-sm
hover:bg-blue-700
transition
"
          >
            Save Notes
          </button>
        </div>
      )}
    </div>
  );
}
