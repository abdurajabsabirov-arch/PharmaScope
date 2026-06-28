interface KPICardProps {
  title: string;
  value: string;
  change: string;
}

export default function KPICard({
  title,
  value,
  change,
}: KPICardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>

      <h2 className="mt-3 text-3xl font-bold text-slate-900">
        {value}
      </h2>

      <p className="mt-2 text-sm font-medium text-emerald-600">
        {change}
      </p>
    </div>
  );
}