import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down" | "neutral";
  tone?: "blue" | "teal" | "purple" | "orange" | "green" | "amber" | "cyan" | "red" | "sky";
  icon?: LucideIcon;
  tooltip?: string;
  formula?: string;
}

const toneClass: Record<NonNullable<KPICardProps["tone"]>, string> = {
  blue: "from-blue-600 to-blue-500",
  teal: "from-teal-600 to-emerald-500",
  purple: "from-violet-600 to-purple-500",
  orange: "from-orange-500 to-amber-500",
  green: "from-emerald-600 to-green-500",
  amber: "from-amber-500 to-yellow-500",
  cyan: "from-cyan-600 to-teal-500",
  red: "from-rose-500 to-red-500",
  sky: "from-blue-500 to-sky-400",
};

const defaultHelp: Record<string, { tooltip: string; formula: string }> = {
  "Total Market Value": {
    tooltip: "Total sales value for the current period and selected filters.",
    formula: "Sum TRD Price in USD for selected period",
  },
  "Market Growth": {
    tooltip: "Change in selected market value versus the previous comparable period.",
    formula: "(Current value - Previous value) / Previous value × 100",
  },
  "Total Units": {
    tooltip: "Total packs sold in the current period and selected filters.",
    formula: "Sum Units for selected period",
  },
  "Average Price": {
    tooltip: "Average selling price per pack in the current selection.",
    formula: "Total Market Value / Total Units",
  },
  "Market Leaders (Companies)": {
    tooltip: "Number of companies with sales in the current selection.",
    formula: "Distinct companies where value or units > 0",
  },
  "Market Concentration": {
    tooltip: "Combined market share of the five largest companies.",
    formula: "Top 5 company sales / Total market value × 100",
  },
  "New Products (12M)": {
    tooltip: "Number of SKU first observed in the selected period.",
    formula: "Count SKU where first active month is inside selected period",
  },
  "Active Molecules": {
    tooltip: "Number of molecules represented in the current selection.",
    formula: "Distinct molecules where value or units > 0",
  },
  "Active Brands": {
    tooltip: "Number of brands represented in the current selection.",
    formula: "Distinct brands where value or units > 0",
  },
  "Active SKU": {
    tooltip: "Number of SKU represented in the current selection.",
    formula: "Distinct SKU where value or units > 0",
  },
  "Company Sales": {
    tooltip: "Sales value of the selected company or current company context.",
    formula: "Selected company Sum TRD Price in USD",
  },
  "Market Share": {
    tooltip: "Company share within the full comparable market context.",
    formula: "Company sales / Market sales × 100",
  },
  Rank: {
    tooltip: "Company position among all companies in the same market context.",
    formula: "Rank companies by sales descending",
  },
  "Share Change": {
    tooltip: "Change in market share versus the previous comparable period.",
    formula: "Current share - Previous share",
  },
  "Growth vs Market": {
    tooltip: "Difference between company growth and total market growth.",
    formula: "Company growth % - Market growth %",
  },
  "PPG (Price Performance)": {
    tooltip: "Price performance indicator based on current average price movement.",
    formula: "Current average price index vs previous period",
  },
  "Evolution Index": {
    tooltip: "Index showing current period value versus previous comparable period.",
    formula: "Current value / Previous value × 100",
  },
  CAGR: {
    tooltip: "Compound annual growth rate across all available years in the uploaded file.",
    formula: "(Last year value / First year value)^(1 / years) - 1",
  },
};

export default function KPICard({
  title,
  value,
  change,
  trend = "neutral",
  tone,
  icon: Icon,
  tooltip,
  formula,
}: KPICardProps) {
  const isPositive = trend === "up" || change.startsWith("+");
  const changeTone = trend === "neutral" ? "text-white/85" : isPositive ? "text-emerald-100" : "text-rose-100";
  const help = defaultHelp[title] ?? (title.includes("Market Share") ? defaultHelp["Market Share"] : title.includes("Rank") ? defaultHelp.Rank : undefined);
  const tooltipText = tooltip ?? help?.tooltip;
  const formulaText = formula ?? help?.formula;

  if (tone) {
    return (
      <div className={`min-h-[128px] rounded-lg bg-gradient-to-br ${toneClass[tone]} p-4 text-white shadow-sm`}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold leading-tight text-white/90">{title}</p>
          {Icon && (
            <span className="group/tooltip relative rounded-md bg-white/10 p-1.5 text-white/80 outline-none transition hover:bg-white/20 focus-visible:bg-white/20" tabIndex={tooltipText || formulaText ? 0 : -1}>
              <Icon size={15} strokeWidth={2} />
              {(tooltipText || formulaText) && (
                <span className="pointer-events-none absolute right-0 top-8 z-30 w-64 translate-y-1 rounded-xl border border-white/30 bg-white/92 p-3 text-left text-slate-700 opacity-0 shadow-xl shadow-slate-900/15 backdrop-blur-xl transition duration-200 group-hover/tooltip:translate-y-0 group-hover/tooltip:opacity-100 group-focus-visible/tooltip:translate-y-0 group-focus-visible/tooltip:opacity-100">
                  <span className="block text-xs font-bold text-slate-950">{title}</span>
                  {tooltipText && <span className="mt-1 block text-[11px] leading-snug text-slate-600">{tooltipText}</span>}
                  {formulaText && (
                    <span className="mt-2 block rounded-lg bg-slate-50 px-2 py-1.5 text-[11px] font-semibold leading-snug text-slate-800">
                      {formulaText}
                    </span>
                  )}
                </span>
              )}
            </span>
          )}
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight">{value}</h2>

        <p className={`mt-3 text-xs font-semibold ${changeTone}`}>{change}</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm hover:shadow transition-shadow duration-200">

      <p className="text-sm font-medium tracking-widest text-slate-500 uppercase">
        {title}
      </p>

      <div className="mt-6 flex items-baseline gap-3">
        <h2 className="text-5xl font-semibold tracking-tighter text-slate-900">
          {value}
        </h2>
      </div>

      <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${trend === "neutral" ? "text-slate-500" : isPositive ? "text-emerald-600" : "text-rose-600"}`}>
        <span>{change}</span>
        <span className="text-xs">vs previous period</span>
      </div>

    </div>
  );
}
