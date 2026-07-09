"use client";

import { useState } from "react";
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
  data: Array<{ month?: string; year?: string; sales: number; units?: number }>;
  growth?: number;
  title?: string;
  subtitle?: string;
  xKey?: "month" | "year";
};

export default function SalesLineChart({
  data = [],
  growth = 0,
  title = "Market Value Trend (USD)",
  subtitle = "Monthly trend",
  xKey = "month",
}: Partial<SalesLineChartProps>) {
  const [metric, setMetric] = useState<"sales" | "units">("sales");
  const hasUnits = data.some((item) => typeof item.units === "number" && item.units > 0);
  const metricKey = hasUnits ? metric : "sales";
  const formatSpacedNumber = (value: number) => Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, " ");

  return (
    <div className="glass-panel rounded-lg p-4">

      <div className="mb-3 flex items-start justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-950">
            {title}
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            {subtitle}
          </p>
        </div>
        <div className="pr-12 text-right">
          {hasUnits && (
            <div className="mb-2 inline-flex rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                type="button"
                onClick={() => setMetric("sales")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${metricKey === "sales" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                USD
              </button>
              <button
                type="button"
                onClick={() => setMetric("units")}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition ${metricKey === "units" ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
              >
                Packs
              </button>
            </div>
          )}
          <p className={`text-xs font-bold ${growth >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {growth >= 0 ? "+" : ""}
            {growth}% vs previous period
          </p>
        </div>
      </div>

      <div className="h-[210px]">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey={xKey}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(value) => (metricKey === "units" ? formatSpacedNumber(Number(value)) : String(value))}
              />
              <Tooltip
                formatter={(value) => {
                  if (metricKey === "units") {
                    return [formatSpacedNumber(Number(value)), "Packs"];
                  }
                  return [Number(value).toLocaleString("en-US"), "USD (M)"];
                }}
                contentStyle={{
                  backgroundColor: "white",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="natural"
                dataKey={metricKey}
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
