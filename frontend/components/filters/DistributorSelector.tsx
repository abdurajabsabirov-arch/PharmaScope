"use client";

const distributors = [
  "All Distributors",
  "Grand Pharm",
  "Dori-Darmon",
  "Meros Pharm",
  "Pharm Alliance",
  "OXYmed",
  "Asklepiy",
];

export default function DistributorSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
        Distributor
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {distributors.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}