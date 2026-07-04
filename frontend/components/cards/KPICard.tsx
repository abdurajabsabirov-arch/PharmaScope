import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down" | "neutral";
  tone?: "blue" | "teal" | "purple" | "orange" | "green" | "amber" | "cyan" | "red" | "sky";
  icon?: LucideIcon;
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

export default function KPICard({
  title,
  value,
  change,
  trend = "neutral",
  tone,
  icon: Icon,
}: KPICardProps) {
  const isPositive = trend === "up" || change.startsWith("+");
  const changeTone = trend === "neutral" ? "text-white/85" : isPositive ? "text-emerald-100" : "text-rose-100";

  if (tone) {
    return (
      <div className={`min-h-[128px] rounded-lg bg-gradient-to-br ${toneClass[tone]} p-4 text-white shadow-sm`}>
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold leading-tight text-white/90">{title}</p>
          {Icon && (
            <span className="rounded-md bg-white/10 p-1.5 text-white/80">
              <Icon size={15} strokeWidth={2} />
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
