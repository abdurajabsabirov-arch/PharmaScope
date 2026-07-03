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

type SalesLineChartProps = {
  data: Array<{ month: string; sales: number; units?: number }>;
  growth?: number;
};

export default function SalesLineChart({ data = [], growth = 0 }: Partial<SalesLineChartProps>) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">

      <div className="flex justify-between items-start mb-5">
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-900">
            Market Value Trend
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Uploaded file trend (Million USD)
          </p>
        </div>
        <div className="text-right">
          <p className={`font-medium ${growth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {growth >= 0 ? "+" : ""}
            {growth}% vs previous period
          </p>
        </div>
      </div>

      <div className="h-[280px]">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 13 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 13 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="natural"
                dataKey="sales"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 3, fill: "#2563eb", strokeWidth: 2, stroke: "white" }}
                activeDot={{ r: 6, fill: "#2563eb" }}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full items-center justify-center text-slate-500">
            Upload a file to build the trend chart
          </div>
        )}
      </div>
    </div>
  );
}
