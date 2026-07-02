"use client";

import { Treemap, ResponsiveContainer, Tooltip } from "recharts";

const data = [
  { name: "Santo", size: 18.0 },
  { name: "Berlin Chemie", size: 16.1 },
  { name: "World Medicine", size: 15.2 },
  { name: "Nobel", size: 14.7 },
  { name: "Kusum", size: 12.2 },
  { name: "Others", size: 23.8 },
];

export default function MarketShareTreemap() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-2 text-xl font-semibold">
        Market Share Structure
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Company Contribution
      </p>

      <div className="h-[420px]">

        <ResponsiveContainer width="100%" height="100%">

          <Treemap
            data={data}
            dataKey="size"
            aspectRatio={4 / 3}
            stroke="#ffffff"
            fill="#2563eb"
          >
            <Tooltip />
          </Treemap>

        </ResponsiveContainer>

      </div>

    </div>
  );
}