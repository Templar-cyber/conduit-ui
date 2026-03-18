"use client";

type OrderItem = {
  id: number;
  status: string;
  product_name: string;
  orders: {
    customer_name: string;
    customer_email: string;
  } | null;
};

type Props = {
  selectedOrder: OrderItem | null;
  onClose: () => void;
};

export default function SidePanel({ selectedOrder, onClose }: Props) {
  if (!selectedOrder) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      <div className="fixed right-0 top-0 z-50 h-full w-[420px] bg-slate-900 border-l border-slate-700 shadow-2xl">
        <div className="p-4 border-b border-slate-700 flex justify-between items-center">
          <div className="text-sm font-semibold text-white">
            Order #{selectedOrder.id}
          </div>

          <button onClick={onClose} className="text-slate-400 hover:text-white">
            ×
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <div>
            <div className="text-slate-400 text-xs">Product</div>
            <div>{selectedOrder.product_name}</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Customer</div>
            <div>{selectedOrder.orders?.customer_name}</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Email</div>
            <div>{selectedOrder.orders?.customer_email}</div>
          </div>

          <div>
            <div className="text-slate-400 text-xs">Status</div>
            <div>{selectedOrder.status}</div>
          </div>
        </div>
      </div>
    </>
  );
}
