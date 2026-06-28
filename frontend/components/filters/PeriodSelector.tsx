"use client";

const periods = [
  "MAT",
  "YTD",
  "QTR",
  "MTH",
  "FULL YEAR",
  "CUSTOM",
];

export default function PeriodSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
        Period
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {periods.map((item) => (
          <option key={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}