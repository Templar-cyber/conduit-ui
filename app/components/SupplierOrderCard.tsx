type SupplierOrderCardProps = {
  product_name: string;
  quantity: number;
  supplier_name: string;
  size: string;
  colour: string;
  order_id: string;
  order_value: number;
};

export default function SupplierOrderCard({
  product_name,
  quantity,
  supplier_name,
  size,
  colour,
  order_id,
  order_value,
}: SupplierOrderCardProps) {
  return (
    <div className="grid grid-cols-[120px_2fr_60px_70px_90px_100px] gap-3 border-b border-gray-200 pb-3 mb-3 max-w-[900px]">
      <div className="text-sm font-semibold text-gray-700">
        Order #{order_id}
      </div>

      <div className="text-sm font-semibold text-gray-900">{product_name}</div>

      <div className="text-sm font-semibold text-gray-900">{quantity}</div>

      <div className="text-sm font-semibold text-gray-900">{size}</div>

      <div className="text-sm font-semibold text-gray-900">{colour}</div>

      <div className="text-sm font-bold text-green-600 text-right">
        £{Number(order_value).toFixed(2)}
      </div>
    </div>
  );
}
