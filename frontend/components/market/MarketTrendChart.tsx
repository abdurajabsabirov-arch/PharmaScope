"use client";

import {
  LineChart,
  Line,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const data = [
  { month: "Jan", value: 91 },
  { month: "Feb", value: 94 },
  { month: "Mar", value: 98 },
  { month: "Apr", value: 101 },
  { month: "May", value: 106 },
  { month: "Jun", value: 110 },
  { month: "Jul", value: 112 },
  { month: "Aug", value: 117 },
  { month: "Sep", value: 121 },
  { month: "Oct", value: 125 },
  { month: "Nov", value: 128 },
  { month: "Dec", value: 133 },
];

export default function MarketTrendChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">
        <h2 className="text-xl font-semibold">
          Market Evolution
        </h2>

        <p className="text-sm text-slate-500">
          Total Pharmaceutical Market
        </p>
      </div>

      <div className="h-[420px]">

        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="value"
              stroke="#2563eb"
              strokeWidth={3}
            />

          </LineChart>
        </ResponsiveContainer>

      </div>

    </div>
  );
}