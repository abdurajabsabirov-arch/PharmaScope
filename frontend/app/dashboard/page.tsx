"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/filters/FilterBar";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import MarketShareCard from "@/components/cards/MarketShareCard";
import TopBrandsTable from "@/components/tables/TopBrandsTable";
import { DashboardData, fetchDashboardData } from "./lib/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData()
      .then((dashboard) => {
        setData(dashboard);
        setError(null);
      })
      .catch(() => setError("Could not load dashboard data. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, []);

  const kpis = data?.kpis;
  const growth = kpis?.growth ?? 0;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Market Overview
          </h1>
          <p className="mt-3 text-slate-500">
            {data?.metadata.filename
              ? `Based on ${data.metadata.filename}`
              : "Upload an IQVIA Excel or CSV file to populate the dashboard"}
          </p>
        </div>

        <FilterBar />

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-slate-500 shadow-sm">
            Loading dashboard data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="TOTAL MARKET VALUE"
                value={`$${currencyFormatter.format(kpis?.total_market_value ?? 0)}`}
                change={`${growth >= 0 ? "+" : ""}${growth}%`}
                trend={growth >= 0 ? "up" : "down"}
              />
              <KPICard
                title="TOTAL UNITS"
                value={numberFormatter.format(kpis?.total_units ?? 0)}
                change="0%"
                trend="neutral"
              />
              <KPICard
                title="NOBEL SALES"
                value={`$${currencyFormatter.format(kpis?.nobel_sales ?? 0)}`}
                change="from file"
                trend="neutral"
              />
              <KPICard
                title="MARKET SHARE"
                value={`${kpis?.market_share ?? 0}%`}
                change="from file"
                trend="neutral"
              />
            </div>

            <SalesLineChart data={data?.charts.sales_trend ?? []} growth={growth} />
            <MarketShareCard companies={data?.charts.market_share ?? []} />
            <TopBrandsTable brands={data?.top_brands ?? []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
