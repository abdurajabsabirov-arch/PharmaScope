"use client";

import { TrendingUp } from "lucide-react";
import { type PerformanceRow } from "@/app/dashboard/lib/api";

type ContributionToGrowthProps = {
  rows: PerformanceRow[];
};

const mockItems = [
  { name: "Coronim", contribution: 38 },
  { name: "Aprid", contribution: 16 },
  { name: "Afil", contribution: 12 },
  { name: "Ulfor", contribution: 9 },
  { name: "Melbek", contribution: 5 },
  { name: "Loratal", contribution: -8 },
  { name: "Anzibel", contribution: -12 },
  { name: "TylolFen", contribution: -22 },
];

export default function ContributionToGrowth({ rows }: ContributionToGrowthProps) {
  const items = rows.length
    ? rows
        .map((row) => ({ name: row.brand ?? row.sku ?? "Unassigned", contribution: row.uzs_ppg || 0 }))
        .filter((item) => item.name !== "Total")
        .sort((left, right) => right.contribution - left.contribution)
        .slice(0, 8)
    : mockItems;

  const max = Math.max(...items.map((item) => Math.abs(item.contribution)), 1);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <TrendingUp size={19} />
        </span>
        <div>
          <h2 className="text-sm font-black text-slate-950">Contribution to Growth</h2>
          <p className="text-xs font-semibold text-slate-500">Which brands contributed most to total growth.</p>
        </div>
      </div>
      <div className="space-y-3">
        {items.map((item) => {
          const positive = item.contribution >= 0;
          const width = `${Math.max(8, Math.abs(item.contribution) / max * 100)}%`;
          return (
            <div key={item.name} className="grid grid-cols-[120px_1fr_58px] items-center gap-3 text-xs">
              <p className="truncate font-bold text-slate-800" title={item.name}>{item.name}</p>
              <div className="h-3 rounded-full bg-slate-100">
                <div
                  className={`h-3 rounded-full ${positive ? "bg-emerald-500" : "bg-rose-500"}`}
                  style={{ width }}
                />
              </div>
              <p className={`text-right font-black ${positive ? "text-emerald-600" : "text-rose-600"}`}>
                {positive ? "+" : ""}{item.contribution.toFixed(1)}%
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
