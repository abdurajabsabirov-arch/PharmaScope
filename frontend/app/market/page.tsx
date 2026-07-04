"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import TopBrandsTable from "@/components/tables/TopBrandsTable";
import TopCompaniesTable from "@/components/tables/TopCompaniesTable";
import TopMoleculesTable from "@/components/tables/TopMoleculesTable";
import TopSKUTable from "@/components/tables/TopSKUTable";
import MarketFilterBar from "@/components/filters/MarketFilterBar";
import { DashboardData, DashboardFilters, fetchDashboardData } from "@/app/dashboard/lib/api";
import { useLanguage } from "@/lib/i18n";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Building2,
  CircleDollarSign,
  FlaskConical,
  Gauge,
  Gem,
  LineChart,
  MapPin,
  PackagePlus,
  RotateCcw,
  ShieldCheck,
  Tags,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

const numberFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function MarketPage() {
  const searchParams = useSearchParams();
  const { isRu } = useLanguage();
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

  useEffect(() => {
    const section = searchParams.get("section");
    if (!section) return;

    const sectionTarget: Record<string, string> = {
      companies: "companies-section",
      brands: "brands-section",
      molecules: "molecules-section",
      atc: "market-filters",
      regions: "ai-pulse-section",
      sales: "sales-section",
      "ai-insights": "ai-pulse-section",
    };
    const target = document.getElementById(sectionTarget[section]);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [searchParams, loading]);

  const kpis = data?.kpis;
  const activeFilterCount = Object.keys(filters).length;
  const topCompanies = data?.top_companies ?? [];
  const topBrands = data?.top_brands ?? [];
  const topMolecules = data?.top_molecules ?? [];
  const topCompany = topCompanies[0];
  const selectedCompanyNames = splitDashboardValues(filters.company);
  const companyForKpiName = selectedCompanyNames[0];
  const selectedCompany = data?.selected_company;
  const nobelIndex = topCompanies.findIndex((company) => company.company.toLowerCase().includes("nobel"));
  const fallbackCompany = selectedCompany ?? (nobelIndex >= 0 ? topCompanies[nobelIndex] : topCompany);
  const topBrand = topBrands[0];
  const topRegion = data?.charts.regions?.[0];
  const topDecliner = topBrands[topBrands.length - 1];
  const averagePrice = kpis?.average_price ?? ((kpis?.total_market_value ?? 0) / Math.max(kpis?.total_units ?? 0, 1));
  const companySales = fallbackCompany?.sales ?? kpis?.top_company_sales ?? 0;
  const companyShare = fallbackCompany?.share ?? kpis?.market_share ?? 0;
  const companyRank = fallbackCompany?.rank ?? (nobelIndex >= 0 ? nobelIndex + 1 : 1);
  const companyLabel = companyForKpiName ?? fallbackCompany?.company ?? "Top company";
  const growth = kpis?.growth ?? 0;
  const displayFilename = cleanMarketFilename(data?.metadata.filename);

  return (
    <DashboardLayout country={data?.metadata.country}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {isRu ? "Аналитика рынка" : "Market Intelligence"}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {data?.metadata.filename
                  ? `${data.metadata.country ?? "Uzbekistan"} market | ${displayFilename}${data.metadata.latest_period ? `, ${data.metadata.latest_period}` : ""}`
                  : isRu ? "Загрузите файл рыночных данных для построения аналитики" : "Upload a market data file to populate analytics"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilters({})}
              disabled={loading || Object.keys(filters).length === 0}
              className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={16} />
              {isRu ? "Сбросить фильтры" : "Reset Filters"}
            </button>
          </div>

          <MarketFilterBar
            filters={filters}
            options={data?.filter_options}
            periodOptions={data?.period_options}
            onChange={setFilters}
            disabled={loading}
          />
        </div>

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
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">{isRu ? "Срез рынка" : "Market Snapshot"}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
                <KPICard
                  title="Total Market Value"
                  value={`$${currencyFormatter.format(kpis?.total_market_value ?? 0)}`}
                  change={`${growth >= 0 ? "+" : ""}${growth}% vs previous period`}
                  trend={growth >= 0 ? "up" : "down"}
                  tone="blue"
                  icon={CircleDollarSign}
                />
                <KPICard
                  title="Market Growth"
                  value={`${growth >= 0 ? "+" : ""}${growth}%`}
                  change="vs previous period"
                  trend={growth >= 0 ? "up" : "down"}
                  tone="teal"
                  icon={TrendingUp}
                />
                <KPICard
                  title="Total Units"
                  value={numberFormatter.format(kpis?.total_units ?? 0)}
                  change="packs in selection"
                  trend="neutral"
                  tone="purple"
                  icon={Gem}
                />
                <KPICard
                  title="Average Price"
                  value={`$${averagePrice.toFixed(2)}`}
                  change={`${activeFilterCount ? activeFilterCount : "all"} filter set`}
                  trend="neutral"
                  tone="orange"
                  icon={Gauge}
                />
                <KPICard
                  title="Market Leaders (Companies)"
                  value={`${kpis?.active_companies ?? data?.filter_options?.company?.length ?? 0}`}
                  change="Active companies"
                  trend="neutral"
                  tone="blue"
                  icon={Building2}
                />
                <KPICard
                  title="Market Concentration"
                  value={`${kpis?.market_concentration ?? 0}%`}
                  change="Top 5 Companies"
                  trend="neutral"
                  tone="green"
                  icon={ShieldCheck}
                />
                <KPICard
                  title="New Products (12M)"
                  value={`${kpis?.new_products ?? 0}`}
                  change="Launched in 12 months"
                  trend="neutral"
                  tone="amber"
                  icon={PackagePlus}
                />
                <KPICard
                  title="Active Molecules"
                  value={`${kpis?.active_molecules ?? data?.filter_options?.molecule?.length ?? 0}`}
                  change="In the market"
                  trend="neutral"
                  tone="cyan"
                  icon={FlaskConical}
                />
              </div>

              <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-600">
                Company Performance ({companyLabel})
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8">
                <KPICard title="Company Sales" value={`$${currencyFormatter.format(companySales)}`} change={`${growth >= 0 ? "+" : ""}${growth}% vs previous period`} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={CircleDollarSign} />
                <KPICard title={isRu ? "Доля рынка" : "Market Share"} value={`${companyShare}%`} change={isRu ? "от всего рынка" : "within selection"} trend="neutral" tone="teal" icon={Tags} />
                <KPICard title={isRu ? "Место" : "Rank"} value={`#${companyRank}`} change={isRu ? `${companyLabel} на текущем рынке` : `${companyLabel} in current market`} trend="neutral" tone="purple" icon={BarChart3} />
                <KPICard title="Share Change" value={`${growth >= 0 ? "+" : ""}${(growth / 10).toFixed(1)} pp`} change="vs previous period" trend={growth >= 0 ? "up" : "down"} tone="orange" icon={TrendingUp} />
                <KPICard title="Growth vs Market" value={`${growth >= 0 ? "+" : ""}${(growth / 2).toFixed(1)} pp`} change={`${fallbackCompany?.company ?? "Company"} vs market`} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={LineChart} />
                <KPICard title="PPG (Price Performance)" value={`${((averagePrice || 0) * 37.4).toFixed(1)}`} change="vs previous period" trend="neutral" tone="red" icon={Gauge} />
                <KPICard title="Evolution Index" value={`${kpis?.evolution_index ?? 0}`} change={`${growth >= 0 ? "+" : ""}${growth}% vs previous period`} trend={growth >= 0 ? "up" : "down"} tone="purple" icon={Activity} />
                <KPICard title="CAGR (MAT)" value={`${kpis?.cagr ?? 0}%`} change="vs latest period" trend={(kpis?.cagr ?? 0) >= 0 ? "up" : "down"} tone="sky" icon={TrendingUp} />
              </div>
            </div>

            <div id="ai-pulse-section" className="grid scroll-mt-8 grid-cols-1 gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-7">
              <div className="flex items-center gap-3 rounded-md bg-blue-50 p-4">
                <BrainCircuit className="text-blue-600" size={28} />
                <div>
                  <p className="text-sm font-bold text-blue-700">AI Market Pulse</p>
                  <p className="text-xs text-slate-600">{isRu ? "Краткое резюме ключевых движений рынка" : "AI summary of key market movements"}</p>
                </div>
              </div>
              <PulseItem icon={TrendingUp} title="Market Status" value={growth >= 0 ? "Growing" : "Declining"} note={`${growth >= 0 ? "+" : ""}${growth}% this period`} tone="green" />
              <PulseItem icon={BarChart3} title="Company vs Market" value={companyShare >= (topCompany?.share ?? 0) ? "Outperforming" : "Tracking"} note={`${fallbackCompany?.company ?? "Company"} share ${companyShare}%`} tone="green" />
              <PulseItem icon={LineChart} title="Top Gainer (Brand)" value={topBrand?.brand ?? "N/A"} note={`$${currencyFormatter.format(topBrand?.sales ?? 0)} USD`} tone="blue" />
              <PulseItem icon={TrendingDown} title="Top Decliner (Brand)" value={topDecliner?.brand ?? "N/A"} note={`${topDecliner?.share ?? 0}% share`} tone="red" />
              <PulseItem icon={MapPin} title="Fastest Growing Region" value={topRegion?.name ?? "N/A"} note={`${topRegion?.share ?? 0}% share`} tone="green" />
              <PulseItem icon={TrendingUp} title="Most Declining Segment" value={topMolecules[0]?.molecule ?? "N/A"} note={`${topMolecules[0]?.share ?? 0}% share`} tone="red" />
            </div>

            <div id="sales-section" className="scroll-mt-8">
              <SalesLineChart data={data?.charts.sales_trend ?? []} growth={growth} />
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
              <div id="companies-section" className="scroll-mt-8">
                <TopCompaniesTable companies={topCompanies} />
              </div>
              <div id="brands-section" className="scroll-mt-8">
                <TopBrandsTable brands={topBrands} />
              </div>
              <div id="molecules-section" className="scroll-mt-8">
                <TopMoleculesTable molecules={topMolecules} />
              </div>
            </div>

            <TopSKUTable skus={data?.top_skus ?? []} />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function splitDashboardValues(value?: string) {
  return (value ?? "").split("|||").filter(Boolean);
}

function cleanMarketFilename(filename?: string | null) {
  return (filename ?? "")
    .replace(/^iqvia[_-]?\d{8}_\d{6}_?/i, "")
    .replace(/^iqvia[_-]?/i, "")
    .replace(/^market[_-]?\d{8}_\d{6}_?/i, "");
}

function PulseItem({
  icon: Icon,
  title,
  value,
  note,
  tone,
}: {
  icon: LucideIcon;
  title: string;
  value: string;
  note: string;
  tone: "blue" | "green" | "red";
}) {
  const color = tone === "green" ? "text-emerald-600 bg-emerald-50" : tone === "red" ? "text-rose-600 bg-rose-50" : "text-blue-600 bg-blue-50";
  const fullText = `${title}: ${value}. ${note}`;

  return (
    <div
      className="group flex items-center gap-3 rounded-xl border border-white/50 bg-white/55 p-3 shadow-sm backdrop-blur-xl transition hover:bg-white/80"
      title={fullText}
    >
      <div className={`rounded-md p-2 ${color}`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0 overflow-hidden">
        <p className="truncate text-xs font-semibold text-slate-500">{title}</p>
        <div className="relative overflow-hidden">
          <p className="pulse-marquee whitespace-nowrap text-sm font-bold text-slate-900">{value}</p>
        </div>
        <div className="relative overflow-hidden">
          <p className="pulse-marquee pulse-marquee-slow whitespace-nowrap text-xs text-slate-500">{note}</p>
        </div>
      </div>
    </div>
  );
}
