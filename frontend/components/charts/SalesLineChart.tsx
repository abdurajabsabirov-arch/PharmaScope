"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

const data = [
  { month: "Jan", sales: 12.1 },
  { month: "Feb", sales: 13.4 },
  { month: "Mar", sales: 14.2 },
  { month: "Apr", sales: 15.0 },
  { month: "May", sales: 16.8 },
  { month: "Jun", sales: 17.6 },
  { month: "Jul", sales: 18.3 },
  { month: "Aug", sales: 19.5 },
  { month: "Sep", sales: 20.1 },
  { month: "Oct", sales: 21.7 },
  { month: "Nov", sales: 22.8 },
  { month: "Dec", sales: 24.2 },
];

export default function SalesLineChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="mb-6">

        <h2 className="text-xl font-semibold">
          Sales Trend
        </h2>

        <p className="text-sm text-slate-500">
          Monthly Sales (Millions USD)
        </p>

      </div>

      <div className="h-96">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={data}>

            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 7 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
}