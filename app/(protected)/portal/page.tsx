import PortalCard from "@/app/components/PortalCard";

export default function PortalPage() {
  return (
    <div className="p-8 bg-[#F7F9FC] min-h-screen">
      <h1 className="text-2xl font-semibold mb-6">Supplier Portal</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Column 1 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Incoming</h2>

          <PortalCard
            orderNumber="Order #46"
            product="Black Hoodie - Large"
            customer="John Smith"
            date="12 Aug"
          />
        </div>

        {/* Column 2 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">In Progress</h2>

          <PortalCard
            orderNumber="Order #39"
            product="Grey Hoodie - Medium"
            customer="Paul Ashton"
            date="11 Aug"
          />
        </div>

        {/* Column 3 */}
        <div className="bg-white border border-gray-200 rounded-xl p-4">
          <h2 className="text-sm font-semibold mb-3">Completed</h2>

          <PortalCard
            orderNumber="Order #12"
            product="White Tee - Large"
            customer="Brian Higgins"
            date="10 Aug"
          />
        </div>
      </div>
    </div>
  );
}
