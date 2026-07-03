export default function MarketShareCard() {
  const companies = [
    { name: "Nobel Pharmsanoat", share: 19.24, color: "#2563eb" },
    { name: "World Medicine", share: 37.71, color: "#334155" },
    { name: "KRKA", share: 33.26, color: "#64748b" },
    { name: "Farmak Kiev", share: 29.07, color: "#94a3b8" },
    { name: "Sanofi", share: 26.97, color: "#cbd5e1" },
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm h-full flex flex-col">

      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Market Share (Value)
        </h2>
        <p className="text-slate-500 mt-1">Top 5 Corporations • YTD 2026</p>
      </div>

      <div className="space-y-7 flex-1">
        {companies.map((company, index) => (
          <div key={index} className="group">
            <div className="flex justify-between items-baseline mb-2">
              <span className="font-medium text-slate-900">{company.name}</span>
              <span className="font-semibold text-slate-900">{company.share}%</span>
            </div>

            <div className="h-2.5 bg-slate-100 rounded-3xl overflow-hidden">
              <div
                className="h-2.5 rounded-3xl transition-all duration-700 group-hover:scale-x-105 origin-left"
                style={{
                  width: `${company.share}%`,
                  backgroundColor: company.color,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">Total Market Share • 100%</p>
      </div>

    </div>
  );
}