export default function SalesTrend() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-slate-900">
          Sales Trend
        </h2>

        <p className="text-sm text-slate-500">
          Monthly sales dynamics
        </p>
      </div>

      <div className="flex h-80 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
        <span className="text-slate-400">
          Chart will be here
        </span>
      </div>
    </div>
  );
}