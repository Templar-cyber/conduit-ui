type SupplierOrderCardProps = {
  product_name: string;
  quantity: number;
  supplier_name: string;
  size: string;
  colour: string;
  order_id: string;
  order_value: number;
  status: string;
  selected: boolean;
  onSelect: () => void;
  onStatusChange: () => void;
};

export default function SupplierOrderCard({
  product_name,
  quantity,
  supplier_name,
  size,
  colour,
  order_id,
  order_value,
  selected,
  onSelect,
  onStatusChange,
  status,
}: SupplierOrderCardProps) {
  return (
    <div className="grid grid-cols-[40px_100px_2fr_60px_70px_90px_100px_150px] gap-3 border-b border-gray-200 pb-3 mb-3 max-w-[900px]">
      <div className="flex justify-center">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300"
          checked={selected}
          onChange={onSelect}
        />
      </div>

      <div className="text-sm font-semibold text-gray-700 pl-4 text-left">
        Order #{order_id}
      </div>

      <div className="text-sm font-semibold text-gray-900">{product_name}</div>

      <div className="text-sm font-semibold text-gray-900">{quantity}</div>

      <div className="text-sm font-semibold text-gray-900">{size}</div>

      <div className="text-sm font-semibold text-gray-900">{colour}</div>

      <div className="text-sm font-bold text-green-600 text-right">
        £{Number(order_value).toFixed(2)}
      </div>
      <div className="flex justify-end items-center pr-2">
        <button
          className={`
min-w-[110px]
rounded-full
border
px-3
py-1
text-xs
font-semibold
transition
cursor-pointer
${
  status === "Mailed Out"
    ? "border-green-200 bg-green-100 text-green-800"
    : "border-amber-200 bg-amber-100 text-amber-800"
}
`}
          onClick={onStatusChange}
        >
          {status}
        </button>
      </div>
    </div>
  );
}
