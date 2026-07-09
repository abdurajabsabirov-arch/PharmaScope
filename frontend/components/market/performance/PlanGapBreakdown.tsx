"use client";

import { AlertTriangle } from "lucide-react";
import { type PerformanceRow } from "@/app/dashboard/lib/api";
import { calculatePlanGap, formatCompactUZS } from "@/lib/performanceCalculations";

type PlanGapBreakdownProps = {
  rows: PerformanceRow[];
};

const mockRows = [
  { brand: "TylolFen", uzs_plan: 12_600_000_000, uzs_fact: 6_000_000_000 },
  { brand: "Anzibel", uzs_plan: 3_900_000_000, uzs_fact: 2_600_000_000 },
  { brand: "Loratal", uzs_plan: 3_180_000_000, uzs_fact: 2_580_000_000 },
  { brand: "Megasef", uzs_plan: 2_418_000_000, uzs_fact: 2_218_000_000 },
  { brand: "Funistatin", uzs_plan: 1_430_000_000, uzs_fact: 1_280_000_000 },
  { brand: "Coronim", uzs_plan: 270_000_000, uzs_fact: 1_770_000_000 },
  { brand: "Afil", uzs_plan: 1_710_000_000, uzs_fact: 2_010_000_000 },
] as PerformanceRow[];

export default function PlanGapBreakdown({ rows }: PlanGapBreakdownProps) {
  const items = (rows.length ? rows : mockRows)
    .map((row) => ({
      name: row.brand ?? row.sku ?? row.region ?? "Unassigned",
      gap: calculatePlanGap(row.uzs_plan || 0, row.uzs_fact || 0),
    }))
    .filter((item) => item.name !== "Total")
    .sort((left, right) => left.gap - right.gap)
    .slice(0, 8);

  const max = Math.max(...items.map((item) => Math.abs(item.gap)), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
          <AlertTriangle size={19} />
        </span>
        <div>
          <h2 className="text-sm font-black text-slate-950">Plan Gap Breakdown</h2>
          <p className="text-xs font-semibold text-slate-500">Which brands are creating the largest gap to plan.</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const width = `${Math.max(8, Math.abs(item.gap) / max * 100)}%`;
          const positive = item.gap >= 0;
          return (
            <div key={item.name} className="grid grid-cols-[120px_1fr_76px] items-center gap-3 text-xs">
              <p className="truncate font-bold text-slate-800" title={item.name}>{item.name}</p>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width }}
                />
              </div>
              <p className={`text-right font-black ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                {formatCompactUZS(item.gap)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
