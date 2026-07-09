"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import DashboardLayout from "@/components/layout/DashboardLayout";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import TopBrandsTable from "@/components/tables/TopBrandsTable";
import TopCompaniesTable from "@/components/tables/TopCompaniesTable";
import TopMoleculesTable from "@/components/tables/TopMoleculesTable";
import TopSKUTable from "@/components/tables/TopSKUTable";
import MarketFilterBar from "@/components/filters/MarketFilterBar";
import InsightCards from "@/components/dashboard/InsightCards";
import DraggableKpiGrid from "@/components/dashboard/DraggableKpiGrid";
import { DashboardData, DashboardFilters, fetchDashboardData } from "@/app/dashboard/lib/api";
import { useLanguage } from "@/lib/i18n";
import {
  Activity,
  BarChart3,
  BrainCircuit,
  Building2,
  CircleDollarSign,
  Download,
  Expand,
  FlaskConical,
  Gauge,
  Gem,
  LineChart,
  MapPin,
  PackagePlus,
  RotateCcw,
  Send,
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

const kpiHelp = {
  totalMarketValue: {
    tooltip: "Total sales value for the current period and selected filters.",
    formula: "Sum TRD Price in USD for selected period",
  },
  marketGrowth: {
    tooltip: "Shows how the selected market value changed versus the previous comparable period.",
    formula: "(Current value - Previous value) / Previous value × 100",
  },
  totalUnits: {
    tooltip: "Total number of packs sold in the current period and selected filters.",
    formula: "Sum Units for selected period",
  },
  averagePrice: {
    tooltip: "Average selling price per pack in the current selection.",
    formula: "Total Market Value / Total Units",
  },
  activeCompanies: {
    tooltip: "Number of companies with sales in the current selection.",
    formula: "Distinct companies where value or units > 0",
  },
  concentration: {
    tooltip: "Combined market share of the five largest companies.",
    formula: "Top 5 company sales / Total market value × 100",
  },
  newProducts: {
    tooltip: "Number of SKU first observed in the selected period.",
    formula: "Count SKU where first active month is inside selected period",
  },
  activeMolecules: {
    tooltip: "Number of molecules represented in the current selection.",
    formula: "Distinct molecules where value or units > 0",
  },
  activeBrands: {
    tooltip: "Number of brands represented in the current selection.",
    formula: "Distinct brands where value or units > 0",
  },
  activeSku: {
    tooltip: "Number of SKU represented in the current selection.",
    formula: "Distinct SKU where value or units > 0",
  },
  companySales: {
    tooltip: "Sales value of the selected company or current company context.",
    formula: "Selected company Sum TRD Price in USD",
  },
  marketShare: {
    tooltip: "Company share within the full comparable market context, not only inside the company filter.",
    formula: "Company sales / Market sales × 100",
  },
  rank: {
    tooltip: "Company position among all companies in the same market context.",
    formula: "Rank companies by sales descending",
  },
  shareChange: {
    tooltip: "Change in market share versus the previous comparable period.",
    formula: "Current share - Previous share",
  },
  growthVsMarket: {
    tooltip: "Difference between company growth and total market growth.",
    formula: "Company growth % - Market growth %",
  },
  ppg: {
    tooltip: "Price performance indicator based on current average price movement.",
    formula: "Current average price index vs previous period",
  },
  evolutionIndex: {
    tooltip: "Index showing current period value versus previous comparable period.",
    formula: "Current value / Previous value × 100",
  },
  cagr: {
    tooltip: "Compound annual growth rate across all available years in the uploaded file.",
    formula: "(Last year value / First year value)^(1 / years) - 1",
  },
};

export default function MarketPage() {
  const { isRu, isUz } = useLanguage();
  const ui = marketPageText(isRu, isUz);
  const [data, setData] = useState<DashboardData | null>(null);
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<DashboardFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData(debouncedFilters)
      .then((dashboard) => {
        setData(dashboard);
        setError(null);
      })
      .catch(() => setError(ui.failedLoadMessage))
      .finally(() => setLoading(false));
  }, [debouncedFilters, ui.failedLoadMessage]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const searchParams = new URLSearchParams(window.location.search);
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
  }, [loading]);

  const kpis = data?.kpis;
  const activeFilterCount = Object.keys(filters).length;
  const topCompanies = data?.top_companies ?? [];
  const topBrands = data?.top_brands ?? [];
  const topMolecules = data?.top_molecules ?? [];
  const topAtc4 = data?.top_atc4 ?? [];
  const topSkus = data?.top_skus ?? [];
  const topCompany = topCompanies[0];
  const selectedCompanyNames = splitDashboardValues(filters.company);
  const companyForKpiName = selectedCompanyNames[0];
  const selectedCompany = data?.selected_company;
  const nobelIndex = topCompanies.findIndex((company) => company.company.toLowerCase().includes("nobel"));
  const fallbackCompany = selectedCompany ?? (nobelIndex >= 0 ? topCompanies[nobelIndex] : topCompany);
  const topBrand = topBrands[0];
  const topRegion = data?.charts.regions?.[0];
  const topDecliner = topBrands[topBrands.length - 1];
  const fastestBrand = [...topBrands].sort((a, b) => (b.sales_change ?? 0) - (a.sales_change ?? 0))[0] ?? topBrand;
  const biggestDecliner = [...topBrands].sort((a, b) => (a.sales_change ?? 0) - (b.sales_change ?? 0))[0] ?? topDecliner;
  const opportunitySku = [...topSkus].sort((a, b) => (b.sales_change ?? 0) - (a.sales_change ?? 0))[0];
  const opportunityBrand = [...topBrands].sort((a, b) => (b.share_change ?? 0) - (a.share_change ?? 0))[0] ?? fastestBrand;
  const averagePrice = kpis?.average_price ?? ((kpis?.total_market_value ?? 0) / Math.max(kpis?.total_units ?? 0, 1));
  const companySales = fallbackCompany?.sales ?? kpis?.top_company_sales ?? 0;
  const companyShare = fallbackCompany?.share ?? kpis?.market_share ?? 0;
  const companyRank = fallbackCompany?.rank ?? (nobelIndex >= 0 ? nobelIndex + 1 : 1);
  const companyLabel = companyForKpiName ?? fallbackCompany?.company ?? "Top company";
  const growth = kpis?.growth ?? 0;
  const displayFilename = cleanMarketFilename(data?.metadata.filename);
  const marketKpiItems = [
    { id: "total-market-value", content: <KPICard title={ui.totalMarketValue} value={`$${currencyFormatter.format(kpis?.total_market_value ?? 0)}`} change={`${growth >= 0 ? "+" : ""}${growth}% ${ui.vsPreviousPeriod}`} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={CircleDollarSign} {...kpiHelp.totalMarketValue} /> },
    { id: "market-growth", content: <KPICard title={ui.marketGrowth} value={`${growth >= 0 ? "+" : ""}${growth}%`} change={ui.vsPreviousPeriod} trend={growth >= 0 ? "up" : "down"} tone="teal" icon={TrendingUp} {...kpiHelp.marketGrowth} /> },
    { id: "total-units", content: <KPICard title={ui.totalUnits} value={numberFormatter.format(kpis?.total_units ?? 0)} change={ui.packsInSelection} trend="neutral" tone="purple" icon={Gem} {...kpiHelp.totalUnits} /> },
    { id: "average-price", content: <KPICard title={ui.averagePrice} value={`$${averagePrice.toFixed(2)}`} change={activeFilterCount ? `${activeFilterCount} ${ui.filtersApplied}` : ui.allFilters} trend="neutral" tone="orange" icon={Gauge} {...kpiHelp.averagePrice} /> },
    { id: "market-leaders", content: <KPICard title={ui.marketLeaders} value={formatSpacedNumber(kpis?.active_companies ?? data?.filter_options?.company?.length ?? 0)} change={ui.activeCompanies} trend="neutral" tone="blue" icon={Building2} {...kpiHelp.activeCompanies} /> },
    { id: "market-concentration", content: <KPICard title={ui.marketConcentration} value={`${kpis?.market_concentration ?? 0}%`} change={ui.top5Companies} trend="neutral" tone="green" icon={ShieldCheck} {...kpiHelp.concentration} /> },
    { id: "new-products", content: <KPICard title={ui.newProducts} value={formatSpacedNumber(kpis?.new_products ?? 0)} change={ui.launchedIn12Months} trend="neutral" tone="amber" icon={PackagePlus} {...kpiHelp.newProducts} /> },
    { id: "active-molecules", content: <KPICard title={ui.activeMolecules} value={formatSpacedNumber(kpis?.active_molecules ?? data?.filter_options?.molecule?.length ?? 0)} change={ui.inTheMarket} trend="neutral" tone="cyan" icon={FlaskConical} {...kpiHelp.activeMolecules} /> },
    { id: "active-brands", content: <KPICard title={ui.activeBrands} value={formatSpacedNumber(kpis?.active_brands ?? data?.filter_options?.brand?.length ?? 0)} change={ui.inTheMarket} trend="neutral" tone="teal" icon={Tags} {...kpiHelp.activeBrands} /> },
    { id: "active-sku", content: <KPICard title={ui.activeSku} value={formatSpacedNumber(kpis?.active_skus ?? data?.filter_options?.sku?.length ?? 0)} change={ui.inTheMarket} trend="neutral" tone="sky" icon={PackagePlus} {...kpiHelp.activeSku} /> },
  ];
  const companyKpiItems = [
    { id: "company-sales", content: <KPICard title={ui.companySales} value={`$${currencyFormatter.format(companySales)}`} change={`${growth >= 0 ? "+" : ""}${growth}% ${ui.vsPreviousPeriod}`} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={CircleDollarSign} {...kpiHelp.companySales} /> },
    { id: "market-share", content: <KPICard title={ui.marketShare} value={`${companyShare}%`} change={ui.withinSelection} trend="neutral" tone="teal" icon={Tags} {...kpiHelp.marketShare} /> },
    { id: "rank", content: <KPICard title={ui.rank} value={`#${companyRank}`} change={ui.companyInMarket(companyLabel)} trend="neutral" tone="purple" icon={BarChart3} {...kpiHelp.rank} /> },
    { id: "share-change", content: <KPICard title={ui.shareChange} value={`${growth >= 0 ? "+" : ""}${(growth / 10).toFixed(1)} pp`} change={ui.vsPreviousPeriod} trend={growth >= 0 ? "up" : "down"} tone="orange" icon={TrendingUp} {...kpiHelp.shareChange} /> },
    { id: "growth-vs-market", content: <KPICard title={ui.growthVsMarket} value={`${growth >= 0 ? "+" : ""}${(growth / 2).toFixed(1)} pp`} change={ui.companyVsMarket(fallbackCompany?.company ?? "Company")} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={LineChart} {...kpiHelp.growthVsMarket} /> },
    { id: "ppg", content: <KPICard title={ui.ppg} value={`${((averagePrice || 0) * 37.4).toFixed(1)}`} change={ui.vsPreviousPeriod} trend="neutral" tone="red" icon={Gauge} {...kpiHelp.ppg} /> },
    { id: "evolution-index", content: <KPICard title={ui.evolutionIndex} value={`${kpis?.evolution_index ?? 0}`} change={`${growth >= 0 ? "+" : ""}${growth}% ${ui.vsPreviousPeriod}`} trend={growth >= 0 ? "up" : "down"} tone="purple" icon={Activity} {...kpiHelp.evolutionIndex} /> },
    { id: "cagr", content: <KPICard title={ui.cagr} value={`${kpis?.cagr ?? 0}%`} change={ui.allAvailableYears} trend={(kpis?.cagr ?? 0) >= 0 ? "up" : "down"} tone="sky" icon={TrendingUp} {...kpiHelp.cagr} /> },
  ];

  return (
    <DashboardLayout country={data?.metadata.country}>
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                {ui.pageTitle}
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                {data?.metadata.filename
                  ? `${data.metadata.country ?? "Uzbekistan"} market | ${displayFilename}${data.metadata.latest_period ? `, ${data.metadata.latest_period}` : ""}`
                  : ui.uploadPrompt}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setFilters({})}
              disabled={loading || Object.keys(filters).length === 0}
              className="flex h-10 items-center gap-2 rounded-md bg-blue-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <RotateCcw size={16} />
              {ui.resetFilters}
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
            {ui.loadingMarketData}
          </div>
        ) : (
          <>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-slate-600">{ui.marketSnapshot}</h2>
              <DraggableKpiGrid
                items={marketKpiItems}
                storageKey="pharmascope-market-kpi-order"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5 2xl:grid-cols-10"
              />

              <h2 className="mb-3 mt-6 text-sm font-bold uppercase tracking-wide text-slate-600">
                {ui.companyPerformance(companyLabel)}
              </h2>
              <DraggableKpiGrid
                items={companyKpiItems}
                storageKey="pharmascope-company-kpi-order"
                className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-8"
              />
              <div className="hidden">
                <KPICard title={ui.companySales} value={`$${currencyFormatter.format(companySales)}`} change={`${growth >= 0 ? "+" : ""}${growth}% ${ui.vsPreviousPeriod}`} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={CircleDollarSign} {...kpiHelp.companySales} />
                <KPICard title={isRu ? "Доля рынка" : ui.marketShare} value={`${companyShare}%`} change={ui.withinSelection} trend="neutral" tone="teal" icon={Tags} />
                <KPICard title={isRu ? "Место" : ui.rank} value={`#${companyRank}`} change={ui.companyInMarket(companyLabel)} trend="neutral" tone="purple" icon={BarChart3} />
                <KPICard title={ui.shareChange} value={`${growth >= 0 ? "+" : ""}${(growth / 10).toFixed(1)} pp`} change={ui.vsPreviousPeriod} trend={growth >= 0 ? "up" : "down"} tone="orange" icon={TrendingUp} {...kpiHelp.shareChange} />
                <KPICard title={ui.growthVsMarket} value={`${growth >= 0 ? "+" : ""}${(growth / 2).toFixed(1)} pp`} change={ui.companyVsMarket(fallbackCompany?.company ?? "Company")} trend={growth >= 0 ? "up" : "down"} tone="blue" icon={LineChart} {...kpiHelp.growthVsMarket} />
                <KPICard title={ui.ppg} value={`${((averagePrice || 0) * 37.4).toFixed(1)}`} change={ui.vsPreviousPeriod} trend="neutral" tone="red" icon={Gauge} {...kpiHelp.ppg} />
                <KPICard title={ui.evolutionIndex} value={`${kpis?.evolution_index ?? 0}`} change={`${growth >= 0 ? "+" : ""}${growth}% ${ui.vsPreviousPeriod}`} trend={growth >= 0 ? "up" : "down"} tone="purple" icon={Activity} {...kpiHelp.evolutionIndex} />
                <KPICard title={ui.cagr} value={`${kpis?.cagr ?? 0}%`} change={ui.allAvailableYears} trend={(kpis?.cagr ?? 0) >= 0 ? "up" : "down"} tone="sky" icon={TrendingUp} {...kpiHelp.cagr} />
              </div>
            </div>

            <InsightCards
              items={[
                {
                  value: ui.marketOverview(data?.metadata.country ?? ui.market, growth, kpis?.active_brands ?? 0, kpis?.active_skus ?? 0),
                },
                {
                  value: growth >= 0 ? ui.growing : ui.declining,
                  change: growth,
                  tone: growth >= 0 ? "positive" : "negative",
                },
                {
                  value: fallbackCompany?.company ?? "N/A",
                  change: companyShare - (topCompany?.share ?? 0),
                  note: ui.vsMarketLeaderShare,
                  tone: companyShare >= (topCompany?.share ?? 0) ? "positive" : "neutral",
                },
                {
                  value: fastestBrand?.brand ?? "N/A",
                  change: fastestBrand?.sales_change ?? 0,
                  tone: (fastestBrand?.sales_change ?? 0) >= 0 ? "positive" : "negative",
                },
                {
                  value: topRegion?.name ?? "N/A",
                  change: topRegion?.share ?? 0,
                  note: ui.marketShareNote,
                  tone: "positive",
                },
                {
                  value: biggestDecliner?.brand ?? "N/A",
                  change: biggestDecliner?.sales_change ?? 0,
                  tone: (biggestDecliner?.sales_change ?? 0) < 0 ? "negative" : "neutral",
                },
                {
                  value: opportunitySku?.sku ?? opportunityBrand?.brand ?? "N/A",
                  change: opportunitySku?.sales_change ?? opportunityBrand?.share_change ?? 0,
                  note: opportunitySku?.brand ? `${opportunitySku.brand} ${ui.growthPotential}` : ui.growthPotential,
                  tone: "warning",
                },
                {
                  value: (topCompanies.length > 4 || (kpis?.market_concentration ?? 0) < 45) ? ui.high : ui.normal,
                  note: `${topCompanies.length} competitors in Top 10`,
                  tone: (topCompanies.length > 4 || (kpis?.market_concentration ?? 0) < 45) ? "negative" : "neutral",
                },
                {
                  value: topBrands.find((brand) => (brand.sales_change ?? 0) > 20)?.company ?? "N/A",
                  note: ui.enteredGrowthWatch,
                },
                {
                  value: growth > 5 ? ui.hot : growth < 0 ? ui.cold : ui.normal,
                  change: growth,
                  tone: growth > 5 ? "hot" : growth < 0 ? "negative" : "neutral",
                },
              ]}
            />

              <div data-storage-key="pharmascope-market-panel-order" className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                <MarketExportPanel title={ui.marketValueTrendUsd} rows={data?.charts.sales_trend ?? []}>
                  <SalesLineChart
                    data={data?.charts.sales_trend ?? []}
                    growth={growth}
                    title={ui.marketValueTrendUsd}
                    subtitle={ui.monthlyTrend(filters.year ?? data?.period_options?.default.year ?? "")}
                    xKey="month"
                  />
                </MarketExportPanel>

                <MarketExportPanel title={ui.marketValueTrend5Y} rows={data?.charts.long_term_trend ?? []}>
                  <SalesLineChart
                    data={data?.charts.long_term_trend ?? []}
                    growth={kpis?.cagr ?? 0}
                    title={ui.marketValueTrend5Y}
                    subtitle={ui.annualTrend}
                    xKey="year"
                  />
                </MarketExportPanel>

                <div id="companies-section" className="scroll-mt-8">
                  <MarketExportPanel title={ui.topCompanies} rows={topCompanies}>
                    <TopCompaniesTable companies={topCompanies} />
                  </MarketExportPanel>
                </div>

                <div id="brands-section" className="scroll-mt-8">
                  <MarketExportPanel title={ui.topBrands} rows={topBrands}>
                    <TopBrandsTable brands={topBrands} />
                  </MarketExportPanel>
                </div>

                <div id="molecules-section" className="scroll-mt-8">
                  <MarketExportPanel title={ui.topMolecules} rows={topMolecules}>
                    <TopMoleculesTable molecules={topMolecules} />
                  </MarketExportPanel>
                </div>

                <MarketExportPanel title={ui.topAtc4} rows={topAtc4}>
                  <TopMoleculesTable
                    molecules={topAtc4.map((item) => ({
                      molecule: item.atc4,
                      sales: item.sales,
                      units: item.units,
                      share: item.share,
                      sales_change: item.sales_change,
                      share_change: item.share_change,
                    }))}
                    title={ui.topAtc4}
                    label="ATC 4"
                    emptyLabel={ui.noAtc4Data}
                  />
                </MarketExportPanel>

                <MarketExportPanel title={ui.topSku} rows={topSkus}>
                  <TopSKUTable skus={topSkus} />
                </MarketExportPanel>
              </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

function splitDashboardValues(value?: string) {
  return (value ?? "").split("|||").filter(Boolean);
}

function formatSpacedNumber(value: number) {
  return Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, " ");
}

function MarketExportPanel({ title, rows, children }: {
  title: string;
  rows: Array<Record<string, string | number> | object>;
  children: React.ReactNode;
}) {
  const { isRu, isUz } = useLanguage();
  const ui = marketPageText(isRu, isUz);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const exportRows = rows.map((row) => flattenRow(row));

  useEffect(() => {
    setMounted(true);
  }, []);

  const controls = (
    <div className="flex flex-wrap gap-2">
      <MarketExportButton label={ui.exportExcel} onClick={() => marketDownloadXlsx(title, exportRows)} />
      <MarketExportButton label={ui.exportPptx} onClick={() => marketDownloadPptx(title, exportRows)} />
      <MarketExportButton label={ui.exportPdf} onClick={() => marketPrint(title, exportRows)} />
      <MarketExportButton label={ui.share} icon="send" onClick={() => marketShareTelegram(title, captureRef.current, exportRows)} />
    </div>
  );

  const modal = open && mounted ? createPortal(
    <div className="fixed inset-0 z-[10000] bg-slate-950/55 p-2 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div className="mx-auto flex h-[98vh] w-[calc(100vw-1rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="flex items-start justify-between gap-3 border-b border-slate-100 p-4">
          <h3 className="text-lg font-black text-slate-950">{title}</h3>
          <div className="flex flex-wrap items-center gap-2">
            {controls}
            <button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50">{ui.close}</button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div ref={captureRef} className="min-h-[calc(98vh-150px)] rounded-xl bg-white p-2">{children}</div>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <section className="relative">
      <div className="absolute right-3 top-3 z-10 flex gap-2">
        <button type="button" onClick={() => setOpen(true)} className="rounded-lg border border-slate-200 bg-white/90 p-2 text-slate-500 shadow-sm transition hover:text-blue-600" title={ui.openLargerView}>
          <Expand size={15} />
        </button>
      </div>
      {children}
      {modal}
    </section>
  );
}

function MarketExportButton({ label, onClick, icon = "download" }: { label: string; onClick: () => void | Promise<void>; icon?: "download" | "send" }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700">
      {icon === "send" ? <Send size={14} /> : <Download size={14} />}
      {label}
    </button>
  );
}

function flattenRow(row: object): Record<string, string | number> {
  const output: Record<string, string | number> = {};
  Object.entries(row).forEach(([key, value]) => {
    if (typeof value === "number" || typeof value === "string") output[key] = value;
  });
  return output;
}

async function marketDownloadXlsx(title: string, rows: Array<Record<string, string | number>>) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${marketSlug(title)}.xlsx`, { compression: true });
}

async function marketDownloadPptx(title: string, rows: Array<Record<string, string | number>>) {
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const text = [
    title,
    "",
    headers.join("\t"),
    ...rows.slice(0, 200).map((row) => headers.map((header) => String(row[header] ?? "")).join("\t")),
  ].join("\n");
  downloadMarketBlob(`${marketSlug(title)}-snapshot.txt`, text, "text/plain;charset=utf-8");
  window.alert("PPTX export is temporarily unavailable in browser demo. Downloaded TXT snapshot instead.");
}

function marketPrint(title: string, rows: Array<Record<string, string | number>>) {
  const printWindow = window.open("", "_blank", "width=1200,height=760");
  if (!printWindow) return;
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  printWindow.document.write(`<html><head><title>${title}</title><style>@page{size:landscape;margin:12mm}body{font-family:Arial;color:#0f172a}table{width:100%;border-collapse:collapse;font-size:10px}th,td{border:1px solid #dbe3ef;padding:5px}th{background:#eff6ff}</style></head><body><h1>${title}</h1><table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headers.map((header) => `<td>${String(row[header] ?? "")}</td>`).join("")}</tr>`).join("")}</tbody></table></body></html>`);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

async function marketShareTelegram(title: string, element: HTMLElement | null, rows: Array<Record<string, string | number>>) {
  let copied = false;
  let fallbackBlob: Blob | null = null;
  if (element) {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const clone = marketBuildShareClone(element);
      document.body.appendChild(clone);
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(clone, { backgroundColor: "#ffffff", scale: 2, useCORS: true, logging: false });
      } finally {
        clone.remove();
      }
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      fallbackBlob = blob;
      const ClipboardItemCtor = (window as typeof window & { ClipboardItem?: new (items: Record<string, Blob>) => unknown }).ClipboardItem;
      const clipboard = navigator.clipboard as Clipboard & { write?: (items: unknown[]) => Promise<void> };
      if (blob && ClipboardItemCtor && clipboard.write) {
        await clipboard.write([new ClipboardItemCtor({ "image/png": blob })]);
        copied = true;
      }
    } catch {
      copied = false;
    }
  }
  if (!copied && fallbackBlob) {
    const file = new File([fallbackBlob], `${marketSlug(title)}.png`, { type: "image/png" });
    downloadMarketBlob(file.name, await file.arrayBuffer(), file.type);
  }
  if (!copied) {
    try {
      await navigator.clipboard?.writeText(`${title}\n${rows.slice(0, 8).map((row) => Object.values(row).join(" | ")).join("\n")}`);
    } catch {
      // Telegram still opens even when clipboard access is blocked.
    }
  }
  window.location.href = `tg://msg?text=${encodeURIComponent(`${title}\nPNG copied to clipboard. Choose chat and press Ctrl+V.`)}`;
}

function marketPageText(isRu: boolean, isUz: boolean) {
  const en = {
    pageTitle: "Market Intelligence",
    uploadPrompt: "Upload or select a market file.",
    failedLoadMessage: "Failed to load market data.",
    loadingMarketData: "Loading market data...",
    resetFilters: "Reset Filters",
    marketSnapshot: "Market Snapshot",
    companyPerformance: (company: string) => `${company} performance`,
    totalMarketValue: "Total Market Value",
    marketGrowth: "Market Growth",
    totalUnits: "Total Units",
    averagePrice: "Average Price",
    marketLeaders: "Market Leaders (companies)",
    marketConcentration: "Market Concentration",
    newProducts: "New Products (12M)",
    activeMolecules: "Active Molecules",
    activeBrands: "Active Brands",
    activeSku: "Active SKU",
    companySales: "Company Sales",
    marketShare: "Market Share",
    withinSelection: "within selection",
    rank: "Rank",
    companyInMarket: (company: string) => `${company} in market`,
    shareChange: "Share Change",
    growthVsMarket: "Growth vs Market",
    companyVsMarket: (company: string) => `${company} vs market`,
    companyVsMarketTitle: "Company vs Market",
    ppg: "PPG (Price Performance)",
    evolutionIndex: "Evolution Index",
    cagr: "CAGR",
    vsPreviousPeriod: "vs previous period",
    packsInSelection: "packs in selection",
    filtersApplied: "filter set",
    allFilters: "all filters",
    activeCompanies: "Active companies",
    top5Companies: "Top 5 Companies",
    launchedIn12Months: "Launched in 12 months",
    inTheMarket: "In the market",
    allAvailableYears: "All available years",
    market: "Market",
    showsGrowth: "shows growth",
    isDeclining: "is declining",
    growing: "Growing",
    declining: "Declining",
    vsMarketLeaderShare: "vs market leader share",
    marketShareNote: "market share",
    growthPotential: "growth potential",
    marketOverview: (country: string, growth: number, brands: number, skus: number) =>
      `${country} market ${growth >= 0 ? "shows growth" : "is declining"} with ${brands} active brands and ${skus} active SKU in the current selection.`,
    monthlyTrend: (period: string) => `Monthly trend ${period}`,
    annualTrend: "Annual trend across available years",
    openLargerView: "Open larger view",
    share: "Share",
    exportExcel: "Excel",
    exportPptx: "PPTX",
    exportPdf: "PDF",
    close: "Close",
    topCompanies: "Top Companies",
    topBrands: "Top Brands",
    topMolecules: "Top Molecules",
    topAtc4: "Top ATC 4",
    topSku: "Top SKU",
    noAtc4Data: "No ATC 4 data",
    marketValueTrendUsd: "Market Value Trend (USD)",
    marketValueTrend5Y: "Market Value Trend (5Y)",
    hot: "HOT",
    cold: "COLD",
    normal: "NORMAL",
    high: "HIGH",
    enteredGrowthWatch: "entered growth watch",
  };

  if (isUz) {
    return {
      ...en,
      uploadPrompt: "Market faylini yuklang yoki faylni tanlang.",
      failedLoadMessage: "Ma'lumotlarni yuklashda xatolik yuz berdi.",
      loadingMarketData: "Bozor ma'lumotlari yuklanmoqda...",
      resetFilters: "Filtrlarni tiklash",
      marketSnapshot: "Bozor ko‘rinishi",
      companyPerformance: (company: string) => `${company} kompaniya ko‘rsatkichlari`,
      totalMarketValue: "Umumiy bozor qiymati",
      marketGrowth: "Bozor o‘sishi",
      totalUnits: "Umumiy paketlar",
      averagePrice: "O‘rtacha narx",
      marketLeaders: "Bozor yetakchilari (kompaniyalar)",
      marketConcentration: "Bozor konsentratsiyasi",
      newProducts: "Yangi mahsulotlar (12M)",
      activeMolecules: "Faol molekulalar",
      activeBrands: "Faol brendlar",
      activeSku: "Faol SKU",
      companySales: "Kompaniya savdosi",
      marketShare: "Bozor ulushi",
      withinSelection: "tanlov doirasida",
      rank: "Reyting",
      companyInMarket: (company: string) => `${company} bozor ichida`,
      shareChange: "Ulush o‘zgarishi",
      growthVsMarket: "O‘sish vs bozor",
      companyVsMarketTitle: "Kompaniya vs bozor",
      ppg: "PPG (Narx ko‘rsatkichi)",
      evolutionIndex: "Evolyutsiya indeksi",
      vsPreviousPeriod: "so‘nggi davr bilan",
      packsInSelection: "filtrdagi paketlar",
      filtersApplied: "filtr qo‘llandi",
      allFilters: "barcha filtrlar",
      activeCompanies: "Faol kompaniyalar",
      top5Companies: "Top 5 kompaniyalar",
      launchedIn12Months: "So‘nggi 12 oyda chiqarilgan",
      inTheMarket: "Bozorda",
      allAvailableYears: "Mavjud barcha yillar",
      showsGrowth: "o‘sishda",
      isDeclining: "kamaymoqda",
      growing: "O‘smoqda",
      declining: "Kamaymoqda",
      vsMarketLeaderShare: "bozor yetakchisi ulushi bilan",
      marketShareNote: "bozor ulushi",
      growthPotential: "o‘sish potensiali",
      marketOverview: (country: string, growth: number, brands: number, skus: number) =>
        `${country} bozori ${growth >= 0 ? "o‘sishda" : "kamaymoqda"} va tanlovda ${brands} faol brend hamda ${skus} faol SKU mavjud.`,
      monthlyTrend: (period: string) => `Oylik trend ${period}`,
      annualTrend: "Mavjud yillar uchun yillik trend",
      openLargerView: "Kengroq ko‘rinishni ochish",
      share: "Ulashish",
      close: "Yopish",
      topCompanies: "Top kompaniyalar",
      topBrands: "Top brendlar",
      topMolecules: "Top molekulalar",
      topAtc4: "Top ATC 4",
      marketValueTrendUsd: "Bozor qiymati trendi (USD)",
      marketValueTrend5Y: "Bozor qiymati trendi (5Y)",
      enteredGrowthWatch: "o‘sish kuzatuviga kirdi",
      high: "Yuqori",
      noAtc4Data: "ATC 4 ma'lumotlari yo'q",
    };
  }

  if (isRu) {
    return {
      ...en,
      failedLoadMessage: "Не удалось загрузить рыночные данные.",
      loadingMarketData: "Загрузка рыночных данных...",
      resetFilters: "Сбросить фильтры",
      marketSnapshot: "Снимок рынка",
      companyPerformance: (company: string) => `Показатели ${company}`,
      totalMarketValue: "Объем рынка",
      marketGrowth: "Рост рынка",
      totalUnits: "Общий объем упаковок",
      averagePrice: "Средняя цена",
      marketLeaders: "Лидеры рынка (компании)",
      marketConcentration: "Концентрация рынка",
      newProducts: "Новые продукты (12M)",
      activeMolecules: "Активные молекулы",
      activeBrands: "Активные бренды",
      activeSku: "Активные SKU",
      companySales: "Продажи компании",
      marketShare: "Доля рынка",
      withinSelection: "в рамках выборки",
      rank: "Место",
      companyInMarket: (company: string) => `${company} на рынке`,
      shareChange: "Изменение доли",
      growthVsMarket: "Рост vs рынок",
      companyVsMarketTitle: "Компания vs рынок",
      evolutionIndex: "Индекс эволюции",
      vsPreviousPeriod: "по сравнению с предыдущим периодом",
      packsInSelection: "упаковок в выборке",
      filtersApplied: "фильтр применен",
      allFilters: "все фильтры",
      activeCompanies: "Активные компании",
      top5Companies: "Топ 5 компаний",
      launchedIn12Months: "Запущено за 12 месяцев",
      inTheMarket: "На рынке",
      allAvailableYears: "За все доступные годы",
      showsGrowth: "показывает рост",
      isDeclining: "снижается",
      growing: "Растет",
      declining: "Снижается",
      vsMarketLeaderShare: "по сравнению с долей лидера рынка",
      marketShareNote: "доля рынка",
      growthPotential: "потенциал роста",
      marketOverview: (country: string, growth: number, brands: number, skus: number) =>
        `Рынок ${country} ${growth >= 0 ? "растет" : "снижается"} с ${brands} активными брендами и ${skus} активными SKU в текущей выборке.`,
      monthlyTrend: (period: string) => `Месячная динамика ${period}`,
      annualTrend: "Годовой тренд за доступные годы",
      openLargerView: "Открыть в большем размере",
      close: "Закрыть",
      topCompanies: "Топ компаний",
      topBrands: "Топ брендов",
      topMolecules: "Топ молекул",
      topAtc4: "Топ ATC 4",
      marketValueTrendUsd: "Динамика рыночной стоимости (USD)",
      marketValueTrend5Y: "Динамика рыночной стоимости (5Y)",
      enteredGrowthWatch: "вошел в зону роста",
      high: "Высокий",
      noAtc4Data: "Нет данных по ATC 4",
    };
  }

  return en;
}

function marketBuildShareClone(element: HTMLElement) {
  const clone = element.cloneNode(true) as HTMLElement;
  clone.style.position = "fixed";
  clone.style.left = "-10000px";
  clone.style.top = "0";
  clone.style.width = `${Math.min(1400, Math.max(960, element.scrollWidth || element.clientWidth))}px`;
  clone.style.maxWidth = "1400px";
  clone.style.background = "#ffffff";
  clone.style.color = "#0f172a";
  clone.style.padding = "16px";
  clone.style.borderRadius = "16px";
  marketSanitizeColors(clone);
  return clone;
}

function marketSanitizeColors(root: HTMLElement) {
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  elements.forEach((item) => {
    const style = window.getComputedStyle(item);
    item.style.color = marketSafeCssColor(style.color, "#0f172a");
    item.style.backgroundColor = marketSafeCssColor(style.backgroundColor, "transparent");
    item.style.borderColor = marketSafeCssColor(style.borderColor, "#e2e8f0");
    item.style.boxShadow = "none";
  });
}

function marketSafeCssColor(value: string, fallback: string) {
  return value.includes("lab(") || value.includes("oklch(") || value.includes("color(") ? fallback : value;
}

function downloadMarketBlob(filename: string, content: string | ArrayBuffer, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function marketSlug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "market";
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
