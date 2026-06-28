"use client";

const years = [2022, 2023, 2024, 2025, 2026];

export default function YearSelector() {
  return (
    <div className="flex items-center gap-2">

      <span className="text-sm font-medium text-slate-600">
        Year
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {years.map((year) => (
          <option
            key={year}
            value={year}
          >
            {year}
          </option>
        ))}

      </select>

    </div>
  );
}