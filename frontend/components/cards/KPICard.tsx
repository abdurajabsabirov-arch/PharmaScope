interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend?: "up" | "down" | "neutral";
}

export default function KPICard({
  title,
  value,
  change,
  trend = "neutral",
}: KPICardProps) {
  const isPositive = trend === "up" || change.startsWith("+");

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

      <div className={`mt-4 inline-flex items-center gap-1 text-sm font-medium ${
        isPositive ? "text-emerald-600" : "text-rose-600"
      }`}>
        <span>{change}</span>
        <span className="text-xs">vs previous period</span>
      </div>

    </div>
  );
}