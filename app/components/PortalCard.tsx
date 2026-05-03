"use client";

type PortalCardProps = {
  orderNumber: string;
  product: string;
  customer: string;
  date: string;
};

export default function PortalCard({
  orderNumber,
  product,
  customer,
  date,
}: PortalCardProps) {
  return (
    <div
      className="
bg-blue-100
border border-blue-200
rounded-xl
p-4
mb-3
shadow-sm
hover:shadow-md
hover:bg-blue-100
transition-all duration-150
"
    >
      {/* Order Number */}
      <div className="text-xs font-semibold text-gray-500 mb-1">
        {orderNumber}
      </div>

      {/* Product */}
      <div className="text-sm font-semibold text-gray-900">{product}</div>

      {/* Meta */}
      <div className="text-xs text-gray-500 mt-1">
        {customer} • {date}
      </div>

      {/* Notes */}
      <textarea
        placeholder="Add notes..."
        className="
mt-3 w-full
text-sm
border border-gray-200
rounded-md
p-2
bg-white
focus:outline-none
focus:ring-2 focus:ring-blue-500
resize-none
"
        rows={2}
      />
    </div>
  );
}
