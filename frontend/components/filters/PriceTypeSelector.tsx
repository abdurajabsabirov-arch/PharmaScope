"use client";

const priceTypes = [
  "Manufacturer Price",
  "Wholesale Price",
  "Retail Price",
  "Price per Pack",
  "Price per Unit",
];

export default function PriceTypeSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        Price
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {priceTypes.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}