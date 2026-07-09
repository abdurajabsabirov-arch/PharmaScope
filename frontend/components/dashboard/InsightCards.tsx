"use client";

import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  BrainCircuit,
  Building2,
  Factory,
  LineChart,
  MapPin,
  Shield,
  Star,
  Target,
  Thermometer,
  type LucideIcon,
} from "lucide-react";

export type InsightTone = "positive" | "negative" | "neutral" | "warning" | "hot";

export type InsightCardItem = {
  title: string;
  value: string;
  note?: string;
  change?: number;
  icon: LucideIcon;
  tone?: InsightTone;
  showChange?: boolean;
};

type InsightCardsProps = {
  items?: Partial<InsightCardItem>[];
};

const defaultItems: InsightCardItem[] = [
  {
    title: "AI Market Pulse",
    value: "Respiratory market shows strong growth driven by seasonal demand and new product launches.",
    icon: BrainCircuit,
    tone: "neutral",
    showChange: false,
  },
  { title: "Market Trend", value: "Growing", change: 5.24, note: "vs previous period", icon: LineChart, tone: "positive" },
  { title: "Outperforming Company", value: "NOBEL PHARMA", change: 8.71, note: "vs market", icon: BarChart3, tone: "positive" },
  { title: "Fastest Growing Brand", value: "PANTAP", change: 12.45, note: "vs previous period", icon: Target, tone: "positive" },
  { title: "Fastest Growing Region", value: "TASHKENT", change: 14.32, note: "vs previous period", icon: MapPin, tone: "positive" },
  { title: "Biggest Decliner", value: "CLARITHROMYCIN", change: -7.38, note: "vs previous period", icon: ArrowDown, tone: "negative" },
  { title: "Biggest Opportunity", value: "DERMATOLOGY", change: 18.66, note: "growth potential", icon: Star, tone: "warning" },
  { title: "Competitive Pressure", value: "HIGH", note: "4 competitors gained >5%", icon: Shield, tone: "negative", showChange: false },
  { title: "New Entrant", value: "NEW PHARMA LLC", note: "entered Top 20 this month", icon: Building2, tone: "neutral", showChange: false },
  { title: "Market Temperature", value: "HOT", change: 6.12, note: "vs previous period", icon: Thermometer, tone: "hot" },
];

export default function InsightCards({ items }: InsightCardsProps) {
  const cards = defaultItems.map((fallback, index) => ({ ...fallback, ...(items?.[index] ?? {}) }));

  return (
    <section id="ai-pulse-section" className="scroll-mt-8">
      <div className="flex gap-3 overflow-x-auto rounded-lg border border-slate-200 bg-white p-4 shadow-sm [scrollbar-width:thin] xl:grid xl:grid-cols-10 xl:overflow-visible">
        {cards.map((item, index) => (
          <InsightCard key={`${item.title}-${index}`} item={item} index={index} />
        ))}
      </div>
    </section>
  );
}

function InsightCard({ item, index }: { item: InsightCardItem; index: number }) {
  const Icon = item.icon;
  const tone = toneClasses(item.tone ?? "neutral");
  const showChange = item.showChange !== false && typeof item.change === "number";
  const isPositive = (item.change ?? 0) > 0;
  const isNegative = (item.change ?? 0) < 0;
  const ChangeIcon = isNegative ? ArrowDown : ArrowUp;

  return (
    <article
      className="insight-card-fade group flex min-h-[156px] min-w-[136px] flex-col rounded-xl border border-slate-100 bg-white p-3.5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md xl:min-w-0"
      style={{ animationDelay: `${index * 70}ms` }}
      title={`${item.title}: ${item.value}${item.note ? `. ${item.note}` : ""}`}
    >
      <div className="mb-3 flex items-center gap-2">
        <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${tone.iconBg}`}>
          <Icon size={18} className={tone.iconText} strokeWidth={2.2} />
        </span>
        <h3 className="line-clamp-2 text-[11px] font-bold leading-tight text-slate-600">{item.title}</h3>
      </div>

      <div className="flex flex-1 flex-col justify-center text-center">
        <p className={`line-clamp-3 text-sm font-bold leading-snug ${tone.valueText}`}>{item.value}</p>

        {showChange && (
          <div className={`mt-3 inline-flex items-center justify-center gap-1 text-sm font-bold ${isPositive ? "text-emerald-600" : isNegative ? "text-red-600" : "text-slate-500"}`}>
            <ChangeIcon size={18} strokeWidth={2.4} />
            <span>{isPositive ? "+" : ""}{Number(item.change).toFixed(2)}%</span>
          </div>
        )}
      </div>

      {item.note && <p className="mt-2 text-center text-[11px] leading-snug text-slate-500">{item.note}</p>}
    </article>
  );
}

function toneClasses(tone: InsightTone) {
  if (tone === "positive") {
    return { iconBg: "bg-emerald-50", iconText: "text-emerald-600", valueText: "text-slate-900" };
  }
  if (tone === "negative") {
    return { iconBg: "bg-red-50", iconText: "text-red-600", valueText: "text-slate-900" };
  }
  if (tone === "warning") {
    return { iconBg: "bg-amber-50", iconText: "text-amber-500", valueText: "text-slate-900" };
  }
  if (tone === "hot") {
    return { iconBg: "bg-red-50", iconText: "text-red-600", valueText: "text-red-600" };
  }
  return { iconBg: "bg-blue-50", iconText: "text-blue-600", valueText: "text-slate-900" };
}
