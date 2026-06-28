"use client";

const companies = [
  "All Companies",
  "Nobel",
  "Santo",
  "Berlin Chemie",
  "World Medicine",
  "Kusum",
];

export default function CompanySelector() {
  return (
    <div className="flex items-center gap-2">

      <span className="text-sm font-medium text-slate-600">
        Company
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {companies.map((company) => (
          <option key={company} value={company}>
            {company}
          </option>
        ))}

      </select>

    </div>
  );
}