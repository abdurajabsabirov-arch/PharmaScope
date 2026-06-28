"use client";

const regions = [
  "All Regions",
  "Tashkent",
  "Tashkent Region",
  "Samarkand",
  "Bukhara",
  "Andijan",
  "Fergana",
  "Namangan",
  "Kashkadarya",
  "Surkhandarya",
  "Khorezm",
  "Navoi",
  "Jizzakh",
  "Syrdarya",
  "Karakalpakstan",
];

export default function RegionSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        Region
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {regions.map((region) => (
          <option key={region} value={region}>
            {region}
          </option>
        ))}

      </select>
    </div>
  );
}