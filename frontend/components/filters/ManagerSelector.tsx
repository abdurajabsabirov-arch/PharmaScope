"use client";

const managers = [
  "All Marketing Managers",
  "Abdurajab Sabirov",
  "Bekzod Mirzametov",
  "Emre Kaplan",
];

export default function ManagerSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">
        Marketing Manager
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {managers.map((manager) => (
          <option key={manager} value={manager}>
            {manager}
          </option>
        ))}
      </select>
    </div>
  );
}