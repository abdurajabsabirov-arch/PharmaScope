"use client";

const brands = [
  "All Brands",
  "Pantap",
  "Anzibel",
  "Tylol Hot",
  "Tractus",
  "UrsoPat",
  "Loratal",
];

export default function BrandSelector() {
  return (
    <div className="flex items-center gap-2">

      <span className="text-sm font-medium text-slate-600">
        Brand
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {brands.map((brand) => (
          <option key={brand} value={brand}>
            {brand}
          </option>
        ))}

      </select>

    </div>
  );
}