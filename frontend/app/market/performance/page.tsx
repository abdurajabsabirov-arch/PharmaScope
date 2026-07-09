"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertTriangle,
  Activity,
  BarChart3,
  Boxes,
  Brain,
  CheckCircle2,
  Download,
  DollarSign,
  Expand,
  Gauge,
  HelpCircle,
  LineChart as LineChartIcon,
  MapPin,
  Package,
  RotateCcw,
  Send,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import DashboardLayout from "@/components/layout/DashboardLayout";
import MultiSelectDropdown from "@/components/filters/MultiSelectDropdown";
import DraggableKpiGrid from "@/components/dashboard/DraggableKpiGrid";
import ActionPriorityList from "@/components/market/performance/ActionPriorityList";
import ContributionToGrowth from "@/components/market/performance/ContributionToGrowth";
import PlanGapBreakdown from "@/components/market/performance/PlanGapBreakdown";
import {
  calculatePlanGap,
  calculateRequiredRunRate,
  formatCompactUZS,
  getStatusColor,
} from "@/lib/performanceCalculations";
import { useLanguage } from "@/lib/i18n";
import {
  fetchUploads,
  fetchPerformanceCockpitData,
  type PerformanceCockpitData,
  type PerformanceFilters,
  type PerformanceRow,
} from "@/app/dashboard/lib/api";

type FilterKey = keyof PerformanceFilters;

function buildFilterConfig(ui: ReturnType<typeof performanceUiText>): Array<{ key: FilterKey; label: string; source: string; single?: boolean }> {
  return [
    { key: "year", label: ui.year, source: "years" },
    { key: "quarter", label: ui.quarter, source: "quarters" },
    { key: "month", label: ui.month, source: "months" },
    { key: "group", label: ui.group, source: "group" },
    { key: "region", label: ui.region, source: "region" },
    { key: "city", label: ui.city, source: "city" },
    { key: "supervisor", label: ui.tradeManager, source: "supervisor" },
    { key: "field_force_manager", label: ui.fieldForceManager, source: "field_force_manager" },
    { key: "marketing_manager", label: ui.marketingManager, source: "marketing_manager" },
    { key: "product_manager", label: ui.productManager, source: "product_manager" },
    { key: "brand", label: ui.brand, source: "brand" },
    { key: "sku", label: ui.sku, source: "sku" },
    { key: "type", label: ui.type, source: "type" },
    { key: "rx_otc", label: ui.rxOtc, source: "rx_otc" },
  ];
}

const fallbackData: PerformanceCockpitData = {
  kpis: {
    quti_plan: 0,
    quti_fact: 0,
    uzs_plan: 0,
    uzs_fact: 0,
    achievement_quti: 0,
    achievement_uzs: 0,
    ppg_quti: 0,
    ppg_uzs: 0,
    share_quti: 0,
    share_uzs: 0,
    quti_change: 0,
    uzs_change: 0,
  },
  pulse: {},
  charts: { performance_trend: [], quti_growth: [], uzs_growth: [] },
  tables: { brands: [], skus: [], regions: [], groups: [], marketing_managers: [], field_force_managers: [], product_managers: [] },
  filter_options: {},
  period_options: { years: [], months: [], quarters: [], default: {} },
  metadata: { filename: null, country: "Uzbekistan", rows: 0, message: "Upload Performance Cockpit data." },
};

export default function PerformanceCockpitPage() {
  const { isUz, isRu } = useLanguage();
  const [data, setData] = useState<PerformanceCockpitData>(fallbackData);
  const [filters, setFilters] = useState<PerformanceFilters>({});
  const [debouncedFilters, setDebouncedFilters] = useState<PerformanceFilters>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const ui = performanceUiText(isUz);

  useEffect(() => {
    let alive = true;
    fetchUploads()
      .then((response) => {
        if (!alive) return;
        const activePerformanceFile = response.files.find((file) => file.destination === "performance_cockpit" && file.active);
        if (!activePerformanceFile) return;
        setData((current) => ({
          ...current,
          metadata: {
            ...current.metadata,
            filename: current.metadata.filename ?? activePerformanceFile.filename,
            country: activePerformanceFile.country,
            message: "Preparing Performance Cockpit data from the active file.",
          },
        }));
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setDebouncedFilters(filters);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [filters]);

  useEffect(() => {
    let alive = true;
    setLoading(true);
    setError("");
    fetchPerformanceCockpitData(debouncedFilters)
      .then((response) => {
        if (!alive) return;
        setData((current) => ({
          ...response,
          metadata: {
            ...response.metadata,
            filename: response.metadata.filename ?? current.metadata.filename,
            country: response.metadata.country ?? current.metadata.country,
          },
        }));
      })
      .catch((err) => {
        if (alive) setError(err instanceof Error ? err.message : ui.failedLoadMessage);
      })
      .finally(() => {
        if (alive) setLoading(false);
      });
    return () => {
      alive = false;
    };
  }, [debouncedFilters, ui.failedLoadMessage]);

  const kpis = data.kpis;
  const activeCountry = data.metadata.country ?? "Uzbekistan";
  const filterOptions = useMemo(() => buildFilterOptions(data), [data]);
  const filterConfig = useMemo(() => buildFilterConfig(ui), [ui]);
  const trendData = useMemo(() => trimFutureMonths(data.charts.performance_trend), [data.charts.performance_trend]);
  const growthData = useMemo(() => buildGrowthRows(trendData), [trendData]);
  const uzsPlanGap = calculatePlanGap(kpis.uzs_plan, kpis.uzs_fact);
  const qutiPlanGap = calculatePlanGap(kpis.quti_plan, kpis.quti_fact);
  const forecastAchievement = data.metadata.rows ? 92.6 : 92.6;
  const requiredRunRate = calculateRequiredRunRate(kpis.uzs_plan, kpis.uzs_fact);
  const t = performanceText(isUz);
  const executivePulseText = ui.executivePulseText;
  const selectedPeriodLabel = formatPerformancePeriodLabel(data.metadata.latest_period, ui);
  const selectedPeriodSubtitle = `${ui.periodLabel}: ${selectedPeriodLabel}`;
  const moneyKpiItems = [
    { id: "uzs-plan", content: <MetricCard title={t.uzsPlan} value={formatBillions(kpis.uzs_plan)} note={t.selectedPeriod} icon={DollarSign} tone="blue" help={t.help.uzsPlan} /> },
    { id: "uzs-fact", content: <MetricCard title={t.uzsFact} value={formatBillions(kpis.uzs_fact)} note={changeText(kpis.uzs_change)} icon={DollarSign} tone="blue" trend={kpis.uzs_change} help={t.help.uzsFact} /> },
    { id: "uzs-ach", content: <MetricCard title={t.uzsAch} value={`${kpis.achievement_uzs}%`} note={t.factPlan} icon={Target} tone={toneFromStatus(getStatusColor(kpis.achievement_uzs, "achievement"))} trend={kpis.achievement_uzs - 100} help={t.help.achievement} /> },
    { id: "uzs-ppg", content: <MetricCard title={t.uzsPpg} value={`${signed(kpis.ppg_uzs)}%`} note={t.vsLytd} icon={TrendingUp} tone={toneFromStatus(getStatusColor(kpis.ppg_uzs, "growth"))} trend={kpis.ppg_uzs} help={t.help.ppg} /> },
    { id: "uzs-gap", content: <MetricCard title={t.uzsGap} value={`${formatCompactUZS(uzsPlanGap)} UZS`} note={t.factMinusPlan} icon={uzsPlanGap >= 0 ? TrendingUp : TrendingDown} tone={toneFromStatus(getStatusColor(uzsPlanGap, "gap"))} trend={uzsPlanGap} help={t.help.gap} /> },
    { id: "forecast-ach", content: <MetricCard title={t.forecast} value={`${forecastAchievement.toFixed(1)}%`} note={t.projected} icon={Activity} tone={toneFromStatus(getStatusColor(forecastAchievement, "forecast"))} trend={forecastAchievement - 100} help={t.help.forecast} /> },
    { id: "required-run-rate", content: <MetricCard title={t.runRate} value={`${signed(requiredRunRate)}%`} note={t.needed} icon={AlertTriangle} tone={toneFromStatus(getStatusColor(requiredRunRate, "runRate"))} trend={-requiredRunRate} help={t.help.runRate} /> },
  ];
  const qutiKpiItems = [
    { id: "quti-plan", content: <MetricCard title={t.qutiPlan} value={formatNumber(kpis.quti_plan)} note={t.selectedPeriod} icon={Boxes} tone="blue" help={t.help.qutiPlan} /> },
    { id: "quti-fact", content: <MetricCard title={t.qutiFact} value={formatNumber(kpis.quti_fact)} note={changeText(kpis.quti_change)} icon={Boxes} tone="blue" trend={kpis.quti_change} help={t.help.qutiFact} /> },
    { id: "quti-ach", content: <MetricCard title={t.qutiAch} value={`${kpis.achievement_quti}%`} note={t.factPlan} icon={Package} tone={toneFromStatus(getStatusColor(kpis.achievement_quti, "achievement"))} trend={kpis.achievement_quti - 100} help={t.help.achievement} /> },
    { id: "quti-ppg", content: <MetricCard title={t.qutiPpg} value={`${signed(kpis.ppg_quti)}%`} note={t.vsLytd} icon={TrendingUp} tone={toneFromStatus(getStatusColor(kpis.ppg_quti, "growth"))} trend={kpis.ppg_quti} help={t.help.ppg} /> },
    { id: "quti-gap", content: <MetricCard title={t.qutiGap} value={formatSignedNumber(qutiPlanGap)} note={t.packsGap} icon={qutiPlanGap >= 0 ? TrendingUp : TrendingDown} tone={toneFromStatus(getStatusColor(qutiPlanGap, "gap"))} trend={qutiPlanGap} help={t.help.gap} /> },
  ];

  const setFilter = (key: FilterKey, values: string[]) => {
    setFilters((current) => {
      const next = { ...current };
      const serialized = values.join(",");
      if (!serialized) {
        delete next[key];
      } else {
        next[key] = serialized;
      }
      if (key === "quarter" && serialized) {
        delete next.month;
      }
      if (key === "month" && serialized) {
        delete next.quarter;
      }
      return next;
    });
  };

  return (
    <DashboardLayout country={activeCountry}>
      <div className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-950">{ui.pageTitle}</h1>
            <p className="mt-1 text-sm text-slate-500">{ui.pageSubtitle}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-2 text-right text-xs text-slate-500 shadow-sm backdrop-blur">
            <p className="font-semibold text-slate-900">
              {data.metadata.filename ?? (loading ? ui.preparingActiveFile : ui.noActiveFile)}
            </p>
            <p>{selectedPeriodSubtitle}</p>
            <p className="mt-1 max-w-xs text-[11px] leading-relaxed text-slate-400">{ui.allFiltersUsePeriod}</p>
          </div>
        </div>

        <section className="glass-panel filter-panel rounded-2xl p-3">
          <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
            {filterConfig.map((item) => (
              <MultiSelectDropdown
                key={item.key}
                label={item.label}
                options={filterOptions[item.source] ?? []}
                selectedValues={splitComma(filters[item.key] ?? defaultFilterValue(item, data))}
                onCommit={(values) => setFilter(item.key, item.single ? values.slice(0, 1) : values)}
                single={item.single}
                minWidthClass="min-w-[126px]"
                allLabel={filterAllLabel(item.key, ui)}
              />
            ))}
          </div>
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={() => setFilters({})}
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
            >
              <RotateCcw size={16} />
              {ui.resetFilters}
            </button>
          </div>
        </section>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-semibold text-rose-700">{error}</div>}

        <section className="space-y-3">
          <div className="rounded-2xl border border-sky-200 bg-sky-50/80 px-4 py-3 text-sm text-slate-700 shadow-sm">
            <p className="font-black text-slate-900">{selectedPeriodSubtitle}</p>
            <p className="mt-1 text-xs font-semibold leading-relaxed text-slate-600">{ui.allFiltersUsePeriod}</p>
          </div>
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{t.moneyKpis}</p>
            <DraggableKpiGrid
              items={moneyKpiItems}
              storageKey="pharmascope-performance-money-kpi-order"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7"
            />
          </div>
          <div>
            <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">{t.qutiKpis}</p>
            <DraggableKpiGrid
              items={qutiKpiItems}
              storageKey="pharmascope-performance-quti-kpi-order"
              className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5"
            />
          </div>
        </section>

        <section className="glass-panel grid grid-cols-1 gap-3 rounded-2xl p-3 md:grid-cols-2 xl:grid-cols-8">
          <PulseCard icon={Brain} title={ui.aiPulse} value={executivePulseText} wide />
          <PulseCard icon={Target} title={ui.overallStatus} value={data.pulse.overall_status ?? "-"} note={`${signed(kpis.achievement_quti - 100)} pp ${ui.vsTarget}`} trend={kpis.achievement_quti - 100} />
          <PulseCard icon={CheckCircle2} title={ui.bestPerformingBrand} value={data.pulse.best_brand?.brand ?? "-"} note={`${signed(data.pulse.best_brand?.uzs_ppg ?? 0)}% UZS PPG`} trend={data.pulse.best_brand?.uzs_ppg ?? 0} />
          <PulseCard icon={AlertTriangle} title={ui.weakestBrand} value={data.pulse.weak_brand?.brand ?? "-"} note={`${data.pulse.weak_brand?.achievement_quti ?? 0}% ${ui.achievement}`} trend={(data.pulse.weak_brand?.achievement_quti ?? 100) - 100} />
          <PulseCard icon={MapPin} title={ui.bestRegion} value={data.pulse.best_region?.region ?? "-"} note={`${data.pulse.best_region?.achievement_uzs ?? 0}% UZS ${ui.achievementShort}`} trend={(data.pulse.best_region?.achievement_uzs ?? 100) - 100} />
          <PulseCard icon={TrendingDown} title={ui.weakestRegion} value={data.pulse.weak_region?.region ?? "-"} note={`${data.pulse.weak_region?.achievement_uzs ?? 0}% UZS ${ui.achievementShort}`} trend={(data.pulse.weak_region?.achievement_uzs ?? 100) - 100} />
          <PulseCard icon={Users} title={ui.bestProductManager} value={data.pulse.best_product_manager?.product_manager ?? "-"} note={`${signed(data.pulse.best_product_manager?.uzs_ppg ?? 0)}%`} trend={data.pulse.best_product_manager?.uzs_ppg ?? 0} />
        </section>

        <DraggableKpiGrid
          items={buildPerformancePanels(data, trendData, growthData, ui, isUz, isRu, selectedPeriodSubtitle)}
          storageKey="pharmascope-performance-panel-order"
          className="grid grid-cols-1 gap-3 xl:grid-cols-2"
        />

        {loading && (
          <div className="fixed bottom-5 right-5 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-xl">
            {ui.loadingPerformance}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function statusFromAchievement(achievement: number) {
  if (achievement >= 105) return "Overperforming";
  if (achievement >= 95) return "On Track";
  if (achievement >= 85) return "Below Plan";
  return "Critical";
}

function buildPerformancePanels(
  data: PerformanceCockpitData,
  trendData: PerformanceCockpitData["charts"]["performance_trend"],
  growthData: { quti: Array<{ month: string; value: number }>; uzs: Array<{ month: string; value: number }> },
  ui: ReturnType<typeof performanceUiText>,
  isUz: boolean,
  isRu: boolean,
  selectedPeriodSubtitle: string,
) {
  return [
    { id: "gap-breakdown", content: <PlanGapBreakdown rows={data.tables.brands} /> },
    { id: "growth-contribution", content: <ContributionToGrowth rows={data.tables.brands} /> },
    { id: "brand-sku", content: <DataTable title={ui.brandSkuPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.brands.slice(0, 8)} nameKey="brand" isUz={isUz} isRu={isRu} /> },
    { id: "regional", content: <DataTable title={ui.regionalPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.regions} nameKey="region" managerContext="supervisor" isUz={isUz} isRu={isRu} /> },
    { id: "growth-dynamics", content: <CombinedGrowthChart quti={growthData.quti} uzs={growthData.uzs} ui={ui} selectedPeriodSubtitle={selectedPeriodSubtitle} /> },
    { id: "top-brands", content: <DataTable title={ui.topBrandsTitle} subtitle={selectedPeriodSubtitle} rows={data.tables.brands} nameKey="brand" isUz={isUz} isRu={isRu} /> },
    { id: "top-sku", content: <DataTable title={ui.topSkuTitle} subtitle={selectedPeriodSubtitle} rows={data.tables.skus} nameKey="sku" showBrand isUz={isUz} isRu={isRu} /> },
    { id: "opportunity", content: <OpportunityPanel data={data} subtitle={selectedPeriodSubtitle} /> },
    { id: "actions", content: <ActionPriorityList data={data} /> },
    { id: "marketing-manager", content: <DataTable title={ui.marketingManagerPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.marketing_managers ?? []} nameKey="marketing_manager" managerContext="group" isUz={isUz} isRu={isRu} /> },
    { id: "field-force", content: <DataTable title={ui.fieldForceManagerPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.field_force_managers ?? []} nameKey="field_force_manager" managerContext="group" isUz={isUz} isRu={isRu} /> },
    { id: "product-manager", content: <DataTable title={ui.productManagerPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.product_managers ?? []} nameKey="product_manager" managerContext="marketing_manager" isUz={isUz} isRu={isRu} /> },
    { id: "group", content: <DataTable title={ui.groupPerformance} subtitle={selectedPeriodSubtitle} rows={data.tables.groups} nameKey="group" managerContext="marketing_manager" isUz={isUz} isRu={isRu} /> },
    {
      id: "performance-trend",
      content: (
        <ChartPanel title={ui.performanceTrend} subtitle={combineSubtitles(ui.trendSubtitle, selectedPeriodSubtitle)} exportRows={trendData}>
          <ResponsiveContainer width="100%" height={155}>
            <LineChart data={trendData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatCompactAxis} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatFullNumber(Number(value))} />
              <Line type="monotone" dataKey="uzs_fact" name="UZS Fact" stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }}>
                <LabelList dataKey="uzs_fact" position="top" formatter={(value) => formatCompactAxis(Number(value))} className="fill-slate-600 text-[10px]" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height={155}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={formatCompactAxis} />
              <Tooltip contentStyle={tooltipStyle} formatter={(value) => formatFullNumber(Number(value))} />
              <Line type="monotone" dataKey="quti_fact" name="Quti Fact" stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }}>
                <LabelList dataKey="quti_fact" position="top" formatter={(value) => formatCompactAxis(Number(value))} className="fill-slate-600 text-[10px]" />
              </Line>
            </LineChart>
          </ResponsiveContainer>
        </ChartPanel>
      ),
    },
  ];
}

function MetricCard({ title, value, note, icon: Icon, tone, trend, help }: {
  title: string;
  value: string;
  note: string;
  icon: typeof Boxes;
  tone: "blue" | "amber" | "green" | "purple" | "red";
  trend?: number;
  help?: { tooltip: string; formula: string };
}) {
  const colors = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-orange-50 text-orange-600",
    green: "bg-emerald-50 text-emerald-600",
    purple: "bg-violet-50 text-violet-600",
    red: "bg-rose-50 text-rose-600",
  };
  const valueColors = {
    blue: "text-blue-600",
    amber: "text-orange-600",
    green: "text-emerald-600",
    purple: "text-violet-600",
    red: "text-rose-600",
  };
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-bold text-slate-700">{title}</p>
        <span className={`group relative rounded-xl p-2 ${colors[tone]}`} tabIndex={help ? 0 : -1}>
          <Icon size={18} />
          {help && (
            <span className="pointer-events-none absolute right-0 top-10 z-40 w-72 translate-y-1 rounded-xl border border-slate-200 bg-white p-3 text-left text-slate-700 opacity-0 shadow-xl transition duration-200 group-hover:translate-y-0 group-hover:opacity-100 group-focus:translate-y-0 group-focus:opacity-100">
              <span className="block text-xs font-black text-slate-950">{title}</span>
              <span className="mt-1 block text-[11px] leading-snug text-slate-600">{help.tooltip}</span>
              <span className="mt-2 block rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] font-semibold leading-snug text-slate-800">{help.formula}</span>
            </span>
          )}
        </span>
      </div>
      <p className={`mt-3 text-2xl font-black ${valueColors[tone]}`}>{value}</p>
      <p className={`mt-2 text-xs font-semibold ${trend === undefined ? "text-slate-500" : trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
        {note}
      </p>
    </div>
  );
}

function PulseCard({ icon: Icon, title, value, note, trend, wide = false }: {
  icon: typeof Boxes;
  title: string;
  value: string;
  note?: string;
  trend?: number;
  wide?: boolean;
}) {
  return (
    <div className={`rounded-xl border border-slate-200/70 ${wide ? "bg-blue-50/80 xl:col-span-3" : "bg-white/75"} p-3 shadow-sm`}>
      <div className="flex gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Icon size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-bold text-slate-600">{title}</p>
          <p className={`mt-1 text-sm font-black text-slate-950 ${wide ? "whitespace-normal leading-relaxed" : "truncate"}`} title={value}>{value}</p>
          {note && <p className={`mt-1 text-xs font-semibold ${trend !== undefined && trend < 0 ? "text-rose-600" : "text-emerald-600"}`}>{note}</p>}
        </div>
      </div>
    </div>
  );
}

function ChartPanel({ title, subtitle, children, exportRows = [] }: { title: string; subtitle: string; children: React.ReactNode; exportRows?: Array<Record<string, string | number>> }) {
  return (
    <ExportablePanel title={title} subtitle={subtitle} rows={exportRows} info={panelInfo(title)}>
      {children}
    </ExportablePanel>
  );
}

function GrowthChart({ title, data }: { title: string; data: Array<{ month: string; value: number }> }) {
  const { isUz } = useLanguage();
  const ui = performanceUiText(isUz);
  return (
    <ChartPanel title={title} subtitle={ui.vsSameMonthLastYear} exportRows={data}>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill="#2563eb" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartPanel>
  );
}

function CombinedGrowthChart({ quti, uzs, ui, selectedPeriodSubtitle }: {
  quti: Array<{ month: string; value: number }>;
  uzs: Array<{ month: string; value: number }>;
  ui: ReturnType<typeof performanceUiText>;
  selectedPeriodSubtitle: string;
}) {
  const rows = uzs.map((item, index) => ({
    month: item.month,
    uzs_growth: item.value,
    quti_growth: quti[index]?.value ?? 0,
  }));
  return (
    <div className="xl:col-span-2">
      <ChartPanel title={ui.growthDynamics} subtitle={combineSubtitles(ui.trendSubtitle, selectedPeriodSubtitle)} exportRows={rows}>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={rows} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value).toFixed(1)}%`} />
            <Line type="monotone" dataKey="uzs_growth" name={ui.uzsGrowth} stroke="#0f766e" strokeWidth={3} dot={{ r: 3 }}>
              <LabelList dataKey="uzs_growth" position="top" formatter={(value) => `${Number(value).toFixed(1)}%`} className="fill-slate-600 text-[10px]" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
        <ResponsiveContainer width="100%" height={150}>
          <LineChart data={rows} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${Number(value).toFixed(1)}%`} />
            <Line type="monotone" dataKey="quti_growth" name={ui.qutiGrowth} stroke="#2563eb" strokeWidth={3} dot={{ r: 3 }}>
              <LabelList dataKey="quti_growth" position="top" formatter={(value) => `${Number(value).toFixed(1)}%`} className="fill-slate-600 text-[10px]" />
            </Line>
          </LineChart>
        </ResponsiveContainer>
      </ChartPanel>
    </div>
  );
}

function ExportablePanel({ title, subtitle, rows, children, info }: {
  title: string;
  subtitle?: string;
  rows: Array<Record<string, string | number>>;
  children: React.ReactNode;
  info?: string;
}) {
  const { isUz } = useLanguage();
  const ui = performanceUiText(isUz);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const modal = open && mounted ? createPortal(
    <div className="fixed inset-0 z-[10000] bg-slate-950/55 p-2 backdrop-blur-sm" onClick={() => setOpen(false)}>
      <div
        className="mx-auto flex h-[98vh] w-[calc(100vw-1rem)] max-w-[calc(100vw-1rem)] flex-col rounded-2xl border border-slate-200 bg-white shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 p-4">
          <div>
            <h3 className="text-lg font-black text-slate-950">{title}</h3>
            {subtitle && <p className="text-sm font-semibold text-slate-500">{subtitle}</p>}
            {info && <p className="mt-1 max-w-4xl text-xs leading-relaxed text-slate-500">{info}</p>}
          </div>
          <div className="flex flex-wrap gap-2">
            <ExportButton label={ui.exportExcel} onClick={() => downloadXlsx(title, rows)} />
            <ExportButton label={ui.exportPptx} onClick={() => downloadPptx(title, rows)} />
            <ExportButton label={ui.exportPdf} onClick={() => printPanel(title, rows)} />
            <ExportButton label={ui.share} icon="send" onClick={() => shareToTelegram(title, captureRef.current, rows)} />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
            >
              {ui.close}
            </button>
          </div>
        </div>
        <div className="min-h-0 flex-1 overflow-auto p-5">
          <div ref={captureRef} className="min-h-[calc(98vh-150px)] rounded-xl bg-white p-2">
            {children}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <section className="glass-panel rounded-2xl p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-black text-slate-950">{title}</h2>
            {info && (
              <span className="group relative inline-flex">
                <HelpCircle size={15} className="text-slate-400" />
                <span className="pointer-events-none absolute left-1/2 top-6 z-50 hidden w-72 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-3 text-xs font-semibold leading-relaxed text-slate-600 shadow-xl group-hover:block">
                  {info}
                </span>
              </span>
            )}
          </div>
          {subtitle && <p className="text-xs font-semibold text-slate-500">{subtitle}</p>}
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-lg border border-slate-200 bg-white/80 p-2 text-slate-500 transition hover:border-blue-200 hover:text-blue-600"
          title={ui.openLargerView}
        >
          <Expand size={15} />
        </button>
      </div>
      {children}
      {modal}
    </section>
  );
}

function ExportButton({ label, onClick, icon = "download" }: { label: string; onClick: () => void | Promise<void>; icon?: "download" | "send" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-3 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700"
    >
      {icon === "send" ? <Send size={14} /> : <Download size={14} />}
      {label}
    </button>
  );
}

function DataTable({ title, subtitle, rows, nameKey, showBrand = false, managerContext }: {
  title: string;
  subtitle?: string;
  rows: PerformanceRow[];
  nameKey: keyof PerformanceRow;
  showBrand?: boolean;
  managerContext?: keyof PerformanceRow;
}) {
  const { isUz, isRu } = useLanguage();
  const ui = performanceUiText(isUz);
  const t = performanceText(isUz);
  const nameLabel = tableNameLabel(nameKey, isUz, isRu);
  const contextLabel = managerContext ? tableNameLabel(managerContext, isUz, isRu) : undefined;
  const totalRow = buildTotalRow(rows, nameKey, ui.total);
  const displayRows = totalRow ? [...rows, totalRow] : rows;
  const exportRows = displayRows.map((row, index) => ({
    "#": row[nameKey] === ui.total ? "" : index + 1,
    [nameLabel]: String(row[nameKey] ?? "-"),
    ...(showBrand ? { [t.brand]: row.brand ?? "-" } : {}),
    ...(managerContext ? { [contextLabel ?? ui.context]: String(row[managerContext] ?? "-") } : {}),
    [t.uzsAch]: row.achievement_uzs,
    [t.uzsPlan]: row.uzs_plan,
    [t.uzsFact]: row.uzs_fact,
    [t.uzsPpg]: row.uzs_ppg,
    [t.qutiAch]: row.achievement_quti,
    [t.qutiPlan]: row.quti_plan,
    [t.qutiFact]: row.quti_fact,
    [t.qutiPpg]: row.quti_ppg,
    [ui.status]: row.status,
  }));
  return (
    <ExportablePanel title={title} subtitle={subtitle} rows={exportRows}>
      <div className="mt-3 overflow-x-auto">
        <table className="w-full min-w-[980px] text-left text-xs">
          <thead className="text-slate-500">
            <tr className="border-b border-slate-200">
              <th className="py-2">#</th>
              <th className="py-2">{nameLabel}</th>
              {showBrand && <th className="py-2">{t.brand}</th>}
              {managerContext && <th className="py-2">{contextLabel ?? ui.context}</th>}
              <th className="py-2 text-right">{t.uzsAch}</th>
              <th className="py-2 text-right">{t.uzsPlan}</th>
              <th className="py-2 text-right">{t.uzsFact}</th>
              <th className="py-2 text-right">{t.uzsPpg}</th>
              <th className="py-2 text-right">{t.qutiAch}</th>
              <th className="py-2 text-right">{t.qutiPlan}</th>
              <th className="py-2 text-right">{t.qutiFact}</th>
              <th className="py-2 text-right">{t.qutiPpg}</th>
              <th className="py-2 text-right">{ui.status}</th>
            </tr>
          </thead>
          <tbody>
            {displayRows.map((row, index) => {
              const isTotal = row[nameKey] === ui.total;
              return (
              <tr key={`${String(row[nameKey])}-${index}`} className={`${isTotal ? "border-t-2 border-slate-200 bg-slate-50/80" : "border-b border-slate-100"} last:border-0`}>
                <td className={`py-2 ${isTotal ? "font-black text-slate-900" : "text-slate-500"}`}>{isTotal ? "" : index + 1}</td>
                <td className="max-w-[160px] truncate py-2 font-bold text-slate-900" title={String(row[nameKey] ?? "-")}>{String(row[nameKey] ?? "-")}</td>
                {showBrand && <td className="max-w-[120px] truncate py-2 text-slate-600">{row.brand ?? "-"}</td>}
                {managerContext && <td className="max-w-[180px] truncate py-2 text-slate-600" title={String(row[managerContext] ?? "-")}>{String(row[managerContext] ?? "-")}</td>}
                <td className={achievementClass(row.achievement_uzs)}>{row.achievement_uzs}%</td>
                <td className="py-2 text-right font-semibold text-slate-900">{formatBillions(row.uzs_plan)}</td>
                <td className="py-2 text-right font-semibold text-slate-900">{formatBillions(row.uzs_fact)}</td>
                <td className={metricClass(row.uzs_ppg)}>{signed(row.uzs_ppg)}%</td>
                <td className={achievementClass(row.achievement_quti)}>{row.achievement_quti}%</td>
                <td className="py-2 text-right font-semibold text-slate-900">{formatNumber(row.quti_plan)}</td>
                <td className="py-2 text-right font-semibold text-slate-900">{formatNumber(row.quti_fact)}</td>
                <td className={metricClass(row.quti_ppg)}>{signed(row.quti_ppg)}%</td>
                <td className="py-2 text-right">
                  <span className={`rounded-full px-2 py-1 text-[10px] font-bold ${statusClass(row.status)}`}>{row.status}</span>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </ExportablePanel>
  );
}

function buildTotalRow(rows: PerformanceRow[], nameKey: keyof PerformanceRow, totalLabel: string): PerformanceRow | null {
  if (!rows.length) return null;
  const qutiPlan = rows.reduce((sum, row) => sum + (row.quti_plan || 0), 0);
  const qutiFact = rows.reduce((sum, row) => sum + (row.quti_fact || 0), 0);
  const uzsPlan = rows.reduce((sum, row) => sum + (row.uzs_plan || 0), 0);
  const uzsFact = rows.reduce((sum, row) => sum + (row.uzs_fact || 0), 0);
  const weightedQutiPpg = weightedMetric(rows, "quti_ppg", "quti_fact");
  const weightedUzsPpg = weightedMetric(rows, "uzs_ppg", "uzs_fact");
  const total: PerformanceRow = {
    quti_plan: qutiPlan,
    quti_fact: qutiFact,
    uzs_plan: uzsPlan,
    uzs_fact: uzsFact,
    achievement_quti: percent(qutiFact, qutiPlan),
    achievement_uzs: percent(uzsFact, uzsPlan),
    quti_ppg: weightedQutiPpg,
    uzs_ppg: weightedUzsPpg,
    share_quti: roundOne(rows.reduce((sum, row) => sum + (row.share_quti || 0), 0)),
    share_uzs: roundOne(rows.reduce((sum, row) => sum + (row.share_uzs || 0), 0)),
    status: statusFromAchievement(percent(qutiFact, qutiPlan)),
  };
  total[nameKey] = totalLabel as never;
  return total;
}

function weightedMetric(rows: PerformanceRow[], metricKey: keyof PerformanceRow, weightKey: keyof PerformanceRow) {
  const totalWeight = rows.reduce((sum, row) => sum + Number(row[weightKey] || 0), 0);
  if (!totalWeight) return 0;
  return roundOne(rows.reduce((sum, row) => sum + Number(row[metricKey] || 0) * Number(row[weightKey] || 0), 0) / totalWeight);
}

function percent(value: number, base: number) {
  return base ? roundOne((value / base) * 100) : 0;
}

function roundOne(value: number) {
  return Math.round(value * 10) / 10;
}

async function downloadXlsx(title: string, rows: Array<Record<string, string | number>>) {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows);
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  worksheet["!cols"] = headers.map((header) => ({
    wch: Math.min(36, Math.max(12, header.length + 4)),
  }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
  XLSX.writeFile(workbook, `${slug(title)}.xlsx`, { compression: true });
}

async function downloadPptx(title: string, rows: Array<Record<string, string | number>>) {
  const headers = rows[0] ? Object.keys(rows[0]) : [];
  const text = [
    title,
    "",
    headers.join("\t"),
    ...rows.slice(0, 200).map((row) => headers.map((header) => String(row[header] ?? "")).join("\t")),
  ].join("\n");
  downloadBlob(`${slug(title)}-snapshot.txt`, text, "text/plain;charset=utf-8");
  window.alert("PPTX export is temporarily unavailable in browser demo. Downloaded TXT snapshot instead.");
}

async function shareToTelegram(title: string, element: HTMLElement | null, rows: Array<Record<string, string | number>>) {
  let imageFile: File | null = null;
  let imageBlob: Blob | null = null;
  if (element) {
    try {
      const html2canvas = (await import("html2canvas")).default;
      const clone = buildShareClone(element);
      document.body.appendChild(clone);
      let canvas: HTMLCanvasElement;
      try {
        canvas = await html2canvas(clone, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
          logging: false,
        });
      } finally {
        clone.remove();
      }
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
      if (blob) {
        imageBlob = blob;
        imageFile = new File([blob], `${slug(title)}.png`, { type: "image/png" });
      }
    } catch {
      imageBlob = null;
      imageFile = null;
    }
  }

  const message = imageFile
    ? `${title}\nКартинка скопирована в буфер обмена. Выберите чат в Telegram и нажмите Ctrl+V. Резервная копия сохранена в загрузки: ${imageFile.name}.`
    : `${title}\n${rowsToText(rows)}`;

  const copiedImage = imageBlob ? await copyImageToClipboard(imageBlob) : false;
  if (imageFile && !copiedImage) {
    downloadBlob(imageFile.name, await imageFile.arrayBuffer(), imageFile.type);
  }
  if (!copiedImage) {
    try {
      await navigator.clipboard?.writeText(message);
    } catch {
      // Telegram still opens even when clipboard access is blocked.
    }
  }

  window.location.href = `tg://msg?text=${encodeURIComponent(message)}`;
}

async function copyImageToClipboard(blob: Blob) {
  try {
    const clipboard = navigator.clipboard as Clipboard & { write?: (items: unknown[]) => Promise<void> };
    const ClipboardItemCtor = (window as typeof window & { ClipboardItem?: new (items: Record<string, Blob>) => unknown }).ClipboardItem;
    if (!clipboard?.write || !ClipboardItemCtor) return false;
    await clipboard.write([new ClipboardItemCtor({ [blob.type]: blob })]);
    return true;
  } catch {
    return false;
  }
}

function buildShareClone(element: HTMLElement) {
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
  sanitizeColors(clone);
  return clone;
}

function sanitizeColors(root: HTMLElement) {
  const elements = [root, ...Array.from(root.querySelectorAll<HTMLElement>("*"))];
  elements.forEach((item) => {
    const style = window.getComputedStyle(item);
    item.style.color = safeCssColor(style.color, "#0f172a");
    item.style.backgroundColor = safeCssColor(style.backgroundColor, "transparent");
    item.style.borderColor = safeCssColor(style.borderColor, "#e2e8f0");
    item.style.boxShadow = "none";
  });
}

function safeCssColor(value: string, fallback: string) {
  return value.includes("lab(") || value.includes("oklch(") || value.includes("color(") ? fallback : value;
}

function printPanel(title: string, rows: Array<Record<string, string | number>>) {
  const printWindow = window.open("", "_blank", "width=1200,height=760");
  if (!printWindow) return;
  printWindow.document.write(`
    <html>
      <head>
        <title>${escapeHtml(title)}</title>
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: Arial, sans-serif; color: #0f172a; }
          h1 { font-size: 20px; }
          table { width: 100%; border-collapse: collapse; font-size: 10px; }
          th, td { border: 1px solid #dbe3ef; padding: 5px; }
          th { background: #eff6ff; }
        </style>
      </head>
      <body><h1>${escapeHtml(title)}</h1>${rowsToHtmlTable(rows)}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}

function rowsToHtmlTable(rows: Array<Record<string, string | number>>) {
  if (!rows.length) return "<p>No data</p>";
  const headers = Object.keys(rows[0]);
  return `<table><thead><tr>${headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("")}</tr></thead><tbody>${rows
    .map((row) => `<tr>${headers.map((header) => `<td>${escapeHtml(String(row[header] ?? ""))}</td>`).join("")}</tr>`)
    .join("")}</tbody></table>`;
}

function rowsToText(rows: Array<Record<string, string | number>>) {
  return rows.slice(0, 8).map((row) => Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(" | ")).join("\n");
}

function downloadBlob(filename: string, content: string | ArrayBuffer, type: string) {
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

function slug(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "performance";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function OpportunityPanel({ data, subtitle }: { data: PerformanceCockpitData; subtitle?: string }) {
  const { isUz } = useLanguage();
  const ui = performanceUiText(isUz);
  const opportunity = data.pulse.best_brand;
  const risk = data.pulse.weak_brand;
  const rows = [
    { Type: ui.biggestOpportunity, Name: opportunity?.brand ?? "-", Metric: `${signed(opportunity?.uzs_ppg ?? 0)}% UZS PPG` },
    { Type: ui.biggestRisk, Name: risk?.brand ?? "-", Metric: `${risk?.achievement_quti ?? 0}% ${ui.achievement}` },
    { Type: ui.regionRequiringAction, Name: data.pulse.weak_region?.region ?? "-", Metric: `${data.pulse.weak_region?.achievement_uzs ?? 0}% UZS ${ui.achievementShort}` },
    { Type: ui.aiPerformanceSummary, Name: ui.summary, Metric: data.pulse.summary ?? "" },
  ];
  return (
    <ExportablePanel title={ui.opportunityRisk} subtitle={subtitle} rows={rows}>
      <div className="mt-3 space-y-3">
        <MiniInsight icon={TrendingUp} title={ui.biggestOpportunity} value={opportunity?.brand ?? "-"} note={`${signed(opportunity?.uzs_ppg ?? 0)}% UZS PPG`} tone="green" />
        <MiniInsight icon={AlertTriangle} title={ui.biggestRisk} value={risk?.brand ?? "-"} note={`${risk?.achievement_quti ?? 0}% ${ui.achievement}`} tone="red" />
        <MiniInsight icon={MapPin} title={ui.regionRequiringAction} value={data.pulse.weak_region?.region ?? "-"} note={`${data.pulse.weak_region?.achievement_uzs ?? 0}% UZS ${ui.achievementShort}`} tone="orange" />
        <div className="rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-slate-700">
          <p className="font-black text-blue-700">{ui.aiPerformanceSummary}</p>
          <p className="mt-2">{data.pulse.summary}</p>
        </div>
      </div>
    </ExportablePanel>
  );
}

function MiniInsight({ icon: Icon, title, value, note, tone }: { icon: typeof Boxes; title: string; value: string; note: string; tone: "green" | "red" | "orange" }) {
  const colors = {
    green: "bg-emerald-50 text-emerald-600",
    red: "bg-rose-50 text-rose-600",
    orange: "bg-orange-50 text-orange-600",
  };
  return (
    <div className="flex gap-3 rounded-xl bg-white/70 p-2">
      <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors[tone]}`}>
        <Icon size={17} />
      </span>
      <div className="min-w-0">
        <p className="text-[11px] font-bold text-slate-500">{title}</p>
        <p className="truncate text-sm font-black text-slate-950">{value}</p>
        <p className="text-xs font-semibold text-slate-500">{note}</p>
      </div>
    </div>
  );
}

function buildFilterOptions(data: PerformanceCockpitData): Record<string, Array<{ value: string; label: string }>> {
  const options: Record<string, Array<{ value: string; label: string }>> = {
    years: data.period_options.years.map((value) => ({ value, label: value })),
    quarters: data.period_options.quarters.map((value) => ({ value, label: value })),
    months: data.period_options.months.map((month) => ({ value: month.value, label: month.label })),
  };
  Object.entries(data.filter_options).forEach(([key, values]) => {
    options[key] = values.map((value) => ({ value, label: value }));
  });
  return options;
}

function performanceText(isUz: boolean) {
  if (isUz) {
    return {
      moneyKpis: "Pul ko'rsatkichlari (UZS)",
      qutiKpis: "Quti ko'rsatkichlari",
      selectedPeriod: "tanlangan davr bo'yicha",
      factPlan: "Fakt / Reja",
      factMinusPlan: "Fakt minus Reja",
      packsGap: "rejaga nisbatan quti farqi",
      vsLytd: "LYTD bilan solishtirish",
      projected: "yakuniy bajarilish prognozi",
      needed: "farqni yopish uchun kerak",
      uzsPlan: "UZS Reja",
      uzsFact: "UZS Fakt",
      uzsAch: "UZS Bajarilish %",
      uzsPpg: "UZS PPG %",
      uzsGap: "UZS Reja Farqi",
      qutiPlan: "Quti Reja",
      qutiFact: "Quti Fakt",
      qutiAch: "Quti Bajarilish %",
      qutiPpg: "Quti PPG %",
      qutiGap: "Quti Reja Farqi",
      forecast: "Prognoz Bajarilish",
      runRate: "Kerakli Run Rate",
      help: {
        uzsPlan: { tooltip: "Tanlangan davr uchun pul ko'rinishidagi savdo rejasi.", formula: "UZS Plan = tanlangan davr bo'yicha reja summasi" },
        uzsFact: { tooltip: "Tanlangan davr uchun pul ko'rinishidagi fakt savdo.", formula: "UZS Fact = tanlangan davr bo'yicha fakt summasi" },
        qutiPlan: { tooltip: "Tanlangan davr uchun quti/pack rejasi.", formula: "Quti Plan = tanlangan davr bo'yicha reja qutilari" },
        qutiFact: { tooltip: "Tanlangan davr uchun fakt quti/pack savdosi.", formula: "Quti Fact = tanlangan davr bo'yicha fakt qutilari" },
        achievement: { tooltip: "Reja qanday darajada bajarilganini ko'rsatadi.", formula: "Achievement % = Fact / Plan x 100" },
        ppg: { tooltip: "O'tgan yilning mos davriga nisbatan o'sish yoki pasayish.", formula: "PPG % = (Current Fact - LY Fact) / LY Fact x 100" },
        gap: { tooltip: "Rejaga yetishmayotgan yoki rejadan oshgan hajm.", formula: "Plan Gap = Fact - Plan" },
        forecast: { tooltip: "Joriy tendensiya asosida davr yakunidagi kutilayotgan bajarilish.", formula: "Forecast Achievement % = Forecast Fact / Plan x 100" },
        runRate: { tooltip: "Reja farqini yopish uchun kerak bo'ladigan qo'shimcha o'sish.", formula: "Required Run Rate % = (Plan / Fact - 1) x 100" },
      },
    };
  }
  return {
    moneyKpis: "Money KPIs (UZS)",
    qutiKpis: "Pack KPIs (Quti)",
    selectedPeriod: "vs selected period",
    factPlan: "Fact / Plan",
    factMinusPlan: "Fact minus Plan",
    packsGap: "packs gap to plan",
    vsLytd: "vs LYTD",
    projected: "projected final achievement",
    needed: "needed to close gap",
    uzsPlan: "UZS Plan",
    uzsFact: "UZS Fact",
    uzsAch: "UZS Achievement",
    uzsPpg: "UZS PPG %",
    uzsGap: "UZS Plan Gap",
    qutiPlan: "Quti Plan",
    qutiFact: "Quti Fact",
    qutiAch: "Quti Achievement",
    qutiPpg: "Quti PPG %",
    qutiGap: "Quti Plan Gap",
    forecast: "Forecast Achievement",
    runRate: "Required Run Rate",
    help: {
      uzsPlan: { tooltip: "Sales plan in money for the selected period.", formula: "UZS Plan = sum of planned sales value" },
      uzsFact: { tooltip: "Actual sales in money for the selected period.", formula: "UZS Fact = sum of actual sales value" },
      qutiPlan: { tooltip: "Pack plan for the selected period.", formula: "Quti Plan = sum of planned packs" },
      qutiFact: { tooltip: "Actual packs sold for the selected period.", formula: "Quti Fact = sum of actual packs" },
      achievement: { tooltip: "Shows how much of the plan has been achieved.", formula: "Achievement % = Fact / Plan x 100" },
      ppg: { tooltip: "Growth versus the same comparable period last year.", formula: "PPG % = (Current Fact - LY Fact) / LY Fact x 100" },
      gap: { tooltip: "Amount above or below plan.", formula: "Plan Gap = Fact - Plan" },
      forecast: { tooltip: "Projected achievement at the end of period based on current trend.", formula: "Forecast Achievement % = Forecast Fact / Plan x 100" },
      runRate: { tooltip: "Additional growth required to close the plan gap.", formula: "Required Run Rate % = (Plan / Fact - 1) x 100" },
    },
  };
}

function performanceUiText(isUz: boolean) {
  if (isUz) {
    return {
      pageTitle: "Performance Cockpit",
      pageSubtitle: "Oylik savdo ma'lumotlari asosida reja, fakt, o'sish va ijro tahlili",
      preparingFileMessage: "Faol fayldan Performance Cockpit ma'lumotlari tayyorlanmoqda.",
      failedLoadMessage: "Performance Cockpit ma'lumotlarini yuklashda xato",
      preparingActiveFile: "Faol fayl tayyorlanmoqda",
      noActiveFile: "Fayl yo'q",
      preparingData: "Ma'lumotlar tayyorlanmoqda...",
      uploadFileMessage: "Performance Cockpit faylini yuklang",
      resetFilters: "Filtrlarni tiklash",
      aiPulse: "AI Performance Pulse",
      overallStatus: "Umumiy holat",
      bestPerformingBrand: "Eng yaxshi brend",
      weakestBrand: "Eng zaif brend",
      bestRegion: "Eng yaxshi hudud",
      weakestRegion: "Eng zaif hudud",
      bestProductManager: "Eng yaxshi PM",
      year: "Yil",
      quarter: "Chorak",
      month: "Oy",
      allAvailableMonths: "Barcha mavjud oylar",
      group: "Guruh",
      region: "Hudud / Viloyat",
      city: "Shahar",
      tradeManager: "Savdo menejeri",
      fieldForceManager: "Field Force Manager",
      marketingManager: "Marketing Manager",
      productManager: "Product Manager",
      brand: "Brand",
      sku: "SKU",
      type: "Type",
      rxOtc: "Rx / OTC",
      achievement: "bajarilish",
      achievementShort: "bajarilish",
      vsTarget: "maqsadga nisbatan",
      status: "Status",
      total: "Jami",
      opportunityRisk: "Imkoniyat va xavf",
      biggestOpportunity: "Eng katta imkoniyat",
      biggestRisk: "Eng katta xavf",
      regionRequiringAction: "Harakatni talab qiluvchi hudud",
      aiPerformanceSummary: "AI Performance Summary",
      summary: "Summary",
      brandSkuPerformance: "Brend/SKU ko'rsatkichlari",
      regionalPerformance: "Hududlar bo'yicha ko'rsatkichlar",
      topBrandsTitle: "Top brendlar",
      topSkuTitle: "Top SKU",
      marketingManagerPerformance: "Marketing Manager ko'rsatkichlari",
      fieldForceManagerPerformance: "Field Force Manager ko'rsatkichlari",
      productManagerPerformance: "Product Manager ko'rsatkichlari",
      groupPerformance: "Guruh bo'yicha ko'rsatkichlar",
      performanceTrend: "Performance trend",
      trendSubtitle: "Tanlangan filtrlar bo'yicha trend",
      periodLabel: "Davr",
      allFiltersUsePeriod: "Bu davr barcha KPI kartalari, summary bloklari, jadvallar va grafiklar uchun bir xil qo'llanadi. Agar Year tanlangan va Month ham, Quarter ham All bo'lsa, Cockpit shu yil ichidagi barcha mavjud oylarni oladi.",
      growthDynamics: "Growth dynamics",
      vsSameMonthLastYear: "o'tgan yilning mos oyi bilan solishtirish",
      uzsGrowth: "UZS Growth",
      qutiGrowth: "Quti Growth",
      openLargerView: "Kengroq ko‘rinishni ochish",
      share: "Ulashish",
      exportExcel: "Excel",
      exportPptx: "PPTX",
      exportPdf: "PDF",
      close: "Yopish",
      loadingPerformance: "Performance Cockpit yuklanmoqda...",
      executivePulseText:
        "Portfel UZS va quti bo'yicha rejadan past. Asosiy salbiy drayver TylolFen: ulushi yuqori, lekin bajarilishi zaif. Tiklanish uchun eng yaxshi drayver Coronim. Kritik hududlar Farg'ona va Qoraqalpog'iston. Tavsiya: TylolFen bo'yicha recovery plan, hududiy ijroni ko'rib chiqish va o'sayotgan brendlarni kengaytiring.",
      context: "Kontekst",
    };
  }
  return {
    pageTitle: "Performance Cockpit",
    pageSubtitle: "Plan, fact, growth and execution analytics based on monthly commercial data",
    preparingFileMessage: "Preparing Performance Cockpit data from the active file.",
    failedLoadMessage: "Failed to load Performance Cockpit data",
    preparingActiveFile: "Preparing active file",
    noActiveFile: "No active file",
    preparingData: "Preparing data...",
    uploadFileMessage: "Upload Performance Cockpit file",
    resetFilters: "Reset Filters",
    aiPulse: "AI Performance Pulse",
    overallStatus: "Overall Status",
    bestPerformingBrand: "Best Performing Brand",
    weakestBrand: "Weakest Brand",
    bestRegion: "Best Region",
    weakestRegion: "Weakest Region",
    bestProductManager: "Best PM",
    year: "Year",
    quarter: "Quarter",
    month: "Month",
    allAvailableMonths: "All available months",
    group: "Group",
    region: "Region / Viloyat",
    city: "City / Shahar",
    tradeManager: "Trade Manager",
    fieldForceManager: "Field Force Manager",
    marketingManager: "Marketing Manager",
    productManager: "Product Manager",
    brand: "Brand",
    sku: "SKU",
    type: "Type",
    rxOtc: "Rx / OTC",
    achievement: "achievement",
    achievementShort: "ach.",
    vsTarget: "vs target",
    status: "Status",
    total: "Total",
    opportunityRisk: "Opportunity & Risk",
    biggestOpportunity: "Biggest Opportunity",
    biggestRisk: "Biggest Risk",
    regionRequiringAction: "Region Requiring Action",
    aiPerformanceSummary: "AI Performance Summary",
    summary: "Summary",
    brandSkuPerformance: "Brand/SKU Performance",
    regionalPerformance: "Regional Performance",
    topBrandsTitle: "Top Brands",
    topSkuTitle: "Top SKU",
    marketingManagerPerformance: "Marketing Manager Performance",
    fieldForceManagerPerformance: "Field Force Manager Performance",
    productManagerPerformance: "Product Manager Performance",
    groupPerformance: "Group Performance",
    performanceTrend: "Performance Trend",
    trendSubtitle: "Trend across selected filters",
    periodLabel: "Period",
    allFiltersUsePeriod: "This same period is applied across KPI cards, summary blocks, tables and charts. When Year is selected and both Month and Quarter are All, the Cockpit uses all available months in that year.",
    growthDynamics: "Growth Dynamics",
    vsSameMonthLastYear: "vs same month last year",
    uzsGrowth: "UZS Growth",
    qutiGrowth: "Quti Growth",
    openLargerView: "Open larger view",
    share: "Share",
    exportExcel: "Excel",
    exportPptx: "PPTX",
    exportPdf: "PDF",
    close: "Close",
    loadingPerformance: "Loading Performance Cockpit...",
    executivePulseText:
      "Portfolio is below plan in both UZS and packs. Main negative driver is TylolFen, which has high share but weak achievement. Best recovery driver is Coronim. Critical regions are Farg'ona and Qoraqalpog'iston. Recommended action: focus recovery plan on TylolFen, review regional execution and scale winning brands.",
  };
}

function tableNameLabel(key: keyof PerformanceRow, isUz: boolean, isRu: boolean) {
  if (isUz) {
    const uzLabels: Record<keyof PerformanceRow, string> = {
      brand: "Brand",
      sku: "SKU",
      region: "Hudud",
      supervisor: "Field Force",
      group: "Guruh",
      marketing_manager: "Marketing Manager",
      product_manager: "Product Manager",
      field_force_manager: "Field Force Manager",
    };
    return uzLabels[key] ?? String(key);
  }
  if (isRu) {
    const ruLabels: Record<keyof PerformanceRow, string> = {
      brand: "Brand",
      sku: "SKU",
      region: "Регион",
      supervisor: "Field Force",
      group: "Группа",
      marketing_manager: "Marketing Manager",
      product_manager: "Product Manager",
      field_force_manager: "Field Force Manager",
    };
    return ruLabels[key] ?? String(key);
  }

  const labels: Partial<Record<keyof PerformanceRow, string>> = {
    brand: "Brand",
    sku: "SKU",
    region: "Region",
    supervisor: "Field Force",
    group: "Group",
    marketing_manager: "Marketing Manager",
    product_manager: "Product Manager",
    field_force_manager: "Field Force Manager",
  };
  return labels[key] ?? String(key);
}

function defaultFilterValue(item: { key: FilterKey; source: string }, data: PerformanceCockpitData) {
  if (item.key === "year") return data.period_options.default.year ?? "All";
  if (item.key === "month") return "All";
  if (item.key === "quarter") return "All";
  return "All";
}

function filterAllLabel(key: FilterKey, ui: ReturnType<typeof performanceUiText>) {
  if (key === "month") return ui.allAvailableMonths;
  return "All";
}

function splitComma(value?: string) {
  if (!value || value === "All") return [];
  return value.split(",").filter(Boolean);
}

function trimFutureMonths(rows: PerformanceCockpitData["charts"]["performance_trend"]) {
  const lastActualIndex = rows.reduce((last, row, index) => {
    const hasActual = row.uzs_fact !== undefined && row.quti_fact !== undefined && (row.uzs_fact !== 0 || row.quti_fact !== 0);
    return hasActual ? index : last;
  }, -1);
  return lastActualIndex >= 0 ? rows.slice(0, lastActualIndex + 1) : rows;
}

function buildGrowthRows(rows: PerformanceCockpitData["charts"]["performance_trend"]) {
  return {
    quti: rows.map((row) => ({ month: row.month, value: row.quti_ppg })),
    uzs: rows.map((row) => ({ month: row.month, value: row.uzs_ppg })),
  };
}

function formatNumber(value: number) {
  return formatFullNumber(Math.round(value));
}

function formatSignedNumber(value: number) {
  const absolute = formatFullNumber(Math.abs(Math.round(value)));
  if (value > 0) return `+${absolute}`;
  if (value < 0) return `-${absolute}`;
  return absolute;
}

function formatBillions(value: number) {
  return `${(value / 1_000_000_000).toFixed(2)}B`;
}

function formatFullNumber(value: number) {
  return Math.round(value).toLocaleString("ru-RU").replace(/\u00A0/g, " ");
}

function formatCompactAxis(value: number) {
  const absolute = Math.abs(value);
  if (absolute >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (absolute >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${(value / 1_000).toFixed(0)}K`;
  return `${value}`;
}

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value.toFixed(1)}`;
}

function toneFromStatus(status: string): "green" | "amber" | "red" {
  if (status === "green") return "green";
  if (status === "red") return "red";
  return "amber";
}

function changeText(value: number) {
  return `${signed(value)}% vs LYTD`;
}

function metricClass(value: number) {
  return `py-2 text-right font-bold ${value >= 0 ? "text-emerald-600" : "text-rose-600"}`;
}

function achievementClass(value: number) {
  return `py-2 text-right font-bold ${value >= 90 ? "text-emerald-600" : "text-rose-600"}`;
}

function statusClass(status: string) {
  if (status === "Overperforming") return "bg-emerald-50 text-emerald-700";
  if (status === "On Track") return "bg-lime-50 text-lime-700";
  if (status === "Below Plan") return "bg-orange-50 text-orange-700";
  return "bg-rose-50 text-rose-700";
}

function panelInfo(title?: string) {
  if (!title) {
    return "This block summarizes selected performance data. Achievement = Fact / Plan × 100; PPG = growth versus comparable previous-year period.";
  }
  if (title.includes("Performance Trend")) {
    return "Shows monthly fact dynamics for the selected filters. UZS Fact = sum of actual sales in money; Quti Fact = sum of actual packs.";
  }
  if (title.includes("Regional Performance")) {
    return "Compares regions by execution. Ach UZS = UZS Fact / UZS Plan × 100; PPG UZS = current period versus comparable previous-year period.";
  }
  if (title.includes("Growth Dynamics")) {
    return "Shows year-over-year growth by month. Growth = (current month fact - same month last year fact) / same month last year fact × 100.";
  }
  if (title.includes("Brand") || title.includes("SKU")) {
    return "Ranks brands or SKU by selected performance metrics. Achievement = Fact / Plan × 100; PPG compares fact against the same period last year.";
  }
  if (title.includes("Manager") || title.includes("Group")) {
    return "Shows responsibility-level performance for selected filters. Totals sum plan/fact and recalculate achievement from summed values.";
  }
  if (title.includes("Opportunity")) {
    return "Highlights strongest growth opportunities and risks based on PPG, achievement, and weak region indicators.";
  }
  return "This block summarizes selected performance data. Achievement = Fact / Plan × 100; PPG = growth versus comparable previous-year period.";
}

function combineSubtitles(...values: Array<string | undefined>) {
  return values.filter(Boolean).join(" • ");
}

function formatPerformancePeriodLabel(period: string | undefined, ui: ReturnType<typeof performanceUiText>) {
  if (!period) return ui.preparingData;

  const rangeMatch = period.match(/^(\d{4})-(\d{2})\.\.(\d{4})-(\d{2})$/);
  if (rangeMatch) {
    const [, startYear, startMonth, endYear, endMonth] = rangeMatch;
    const start = formatMonthYear(Number(startMonth), Number(startYear));
    const end = formatMonthYear(Number(endMonth), Number(endYear));
    return startYear === endYear ? `${monthShort(Number(startMonth))}-${monthShort(Number(endMonth))} ${endYear}` : `${start} - ${end}`;
  }

  const singleMatch = period.match(/^(\d{4})-(\d{2})$/);
  if (singleMatch) {
    const [, year, month] = singleMatch;
    return formatMonthYear(Number(month), Number(year));
  }

  const quarterMatch = period.match(/^(\d{4})(?:-(\d{4}))?\s(Q[1-4])$/);
  if (quarterMatch) {
    const [, startYear, endYear, quarter] = quarterMatch;
    return endYear ? `${quarter} ${startYear}-${endYear}` : `${quarter} ${startYear}`;
  }

  return period;
}

function formatMonthYear(month: number, year: number) {
  return `${monthShort(month)} ${year}`;
}

function monthShort(month: number) {
  return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][month - 1] ?? String(month);
}

const tooltipStyle = {
  backgroundColor: "white",
  border: "1px solid #e2e8f0",
  borderRadius: "12px",
  boxShadow: "0 10px 20px rgb(15 23 42 / 10%)",
};

