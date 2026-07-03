"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import MarketShareCard from "@/components/cards/MarketShareCard";
import TopBrandsTable from "@/components/tables/TopBrandsTable";
import TopCompaniesTable from "@/components/tables/TopCompaniesTable";
import TopSKUTable from "@/components/tables/TopSKUTable";
import MarketFilterBar from "@/components/filters/MarketFilterBar";
import { DashboardData, DashboardFilters, fetchDashboardData } from "@/app/dashboard/lib/api";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function MarketPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData(filters)
      .then((dashboard) => {
        setData(dashboard);
        setError(null);
      })
      .catch(() => setError("Could not load market data. Make sure the backend is running."))
      .finally(() => setLoading(false));
  }, [filters]);

  const kpis = data?.kpis;
  const activeFilterCount = Object.keys(filters).length;

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Market Intelligence
          </h1>
          <p className="mt-3 text-xl text-slate-500">
            {data?.metadata.filename
              ? `Based on ${data.metadata.filename}${data.metadata.latest_period ? `, ${data.metadata.latest_period}` : ""}`
              : "Upload an IQVIA Excel or CSV file to populate market analytics"}
          </p>
        </div>

        <MarketFilterBar
          filters={filters}
          options={data?.filter_options}
          periodOptions={data?.period_options}
          onChange={setFilters}
          disabled={loading}
        />

        {error && (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 p-5 text-rose-700">
            {error}
          </div>
        )}

        {loading ? (
          <div className="rounded-3xl border border-slate-100 bg-white p-8 text-slate-500 shadow-sm">
            Loading market data...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <KPICard
                title="TOTAL MARKET VALUE"
                value={`$${currencyFormatter.format(kpis?.total_market_value ?? 0)}`}
                change={activeFilterCount ? `${activeFilterCount} filter${activeFilterCount === 1 ? "" : "s"}` : "all data"}
                trend="neutral"
              />
              <KPICard
                title="TOTAL UNITS"
                value={numberFormatter.format(kpis?.total_units ?? 0)}
                change="from file"
                trend="neutral"
              />
              <KPICard
                title="TOP COMPANY SALES"
                value={`$${currencyFormatter.format(kpis?.top_company_sales ?? 0)}`}
                change="leader in selection"
                trend="neutral"
              />
              <KPICard
                title="LEADER SHARE"
                value={`${kpis?.market_share ?? 0}%`}
                change="within selection"
                trend="neutral"
              />
              <KPICard
                title="EVOLUTION INDEX"
                value={`${kpis?.evolution_index ?? 0}`}
                change={`${kpis?.growth && kpis.growth >= 0 ? "+" : ""}${kpis?.growth ?? 0}%`}
                trend={(kpis?.growth ?? 0) >= 0 ? "up" : "down"}
              />
              <KPICard
                title="CAGR"
                value={`${kpis?.cagr ?? 0}%`}
                change="trend period"
                trend={(kpis?.cagr ?? 0) >= 0 ? "up" : "down"}
              />
            </div>

            <SalesLineChart data={data?.charts.sales_trend ?? []} growth={kpis?.growth ?? 0} />

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <MarketShareCard companies={data?.charts.market_share ?? []} />
              <TopCompaniesTable companies={data?.top_companies ?? []} />
              <TopBrandsTable brands={data?.top_brands ?? []} />
            </div>

            <TopSKUTable skus={data?.top_skus ?? []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
