"use client";

const skus = [
  "All SKU",
  "Pantap 20 mg",
  "Pantap 40 mg",
  "Anzibel Lozenges",
  "Anzibel Spray",
  "Tylol Hot Lemon",
  "Tylol Hot Honey",
  "Tractus Sachet",
  "UrsoPat 250 mg",
];

export default function SKUSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        SKU
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {skus.map((sku) => (
          <option key={sku} value={sku}>
            {sku}
          </option>
        ))}
      </select>
    </div>
  );
}