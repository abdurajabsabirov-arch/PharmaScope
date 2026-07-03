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
  { month: "Jan", sales: 12.1, prev: 10.8 },
  { month: "Feb", sales: 13.4, prev: 11.9 },
  { month: "Mar", sales: 14.2, prev: 12.5 },
  { month: "Apr", sales: 15.0, prev: 13.1 },
  { month: "May", sales: 16.8, prev: 14.2 },
  { month: "Jun", sales: 17.6, prev: 15.0 },
  { month: "Jul", sales: 18.3, prev: 15.8 },
  { month: "Aug", sales: 19.5, prev: 16.4 },
  { month: "Sep", sales: 20.1, prev: 17.1 },
  { month: "Oct", sales: 21.7, prev: 18.0 },
  { month: "Nov", sales: 22.8, prev: 19.2 },
  { month: "Dec", sales: 24.2, prev: 20.5 },
];

export default function SalesLineChart() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">

      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
            Market Value Trend
          </h2>
          <p className="text-slate-500 mt-1">
            YTD 2026 vs YTD 2025 (Million USD)
          </p>
        </div>
        <div className="text-right">
          <p className="text-emerald-600 font-medium">+15.11% YoY</p>
        </div>
      </div>

      <div className="h-[420px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 13 }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 13 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            />
            
            <Line
              type="natural"
              dataKey="prev"
              stroke="#e2e8f0"
              strokeWidth={2}
              strokeDasharray="4 3"
              dot={false}
            />
            <Line
              type="natural"
              dataKey="sales"
              stroke="#2563eb"
              strokeWidth={4}
              dot={{ r: 5, fill: "#2563eb", strokeWidth: 3, stroke: "white" }}
              activeDot={{ r: 8, fill: "#2563eb" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}