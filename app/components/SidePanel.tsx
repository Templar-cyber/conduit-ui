"use client";

type Props = {
  selected: any;
};

export default function SidePanel({ selected }: Props) {
  if (!selected) return null;

  return (
    <div className="w-[320px] bg-white border-l shadow-lg p-4">
      <h2 className="text-lg font-semibold mb-2">{selected.name || "Item"}</h2>

      <p className="text-sm text-gray-500">ID: {selected.id}</p>

      <div className="mt-4">
        <p className="text-sm">Additional details will go here</p>
      </div>
    </div>
  );
}
