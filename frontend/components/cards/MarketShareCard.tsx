type MarketShareCardProps = {
  companies: Array<{ name: string; value: number; share: number }>;
};

const colors = ["#2563eb", "#0f766e", "#7c3aed", "#ea580c", "#475569"];

export default function MarketShareCard({ companies = [] }: Partial<MarketShareCardProps>) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm h-full flex flex-col">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          Market Share (Value)
        </h2>
        <p className="text-slate-500 mt-1">Top corporations from uploaded data</p>
      </div>

      <div className="space-y-7 flex-1">
        {companies.length ? (
          companies.slice(0, 5).map((company, index) => (
            <div key={company.name} className="group">
              <div className="flex justify-between items-baseline mb-2">
                <span className="font-medium text-slate-900">{company.name}</span>
                <span className="font-semibold text-slate-900">{company.share}%</span>
              </div>

              <div className="h-2.5 bg-slate-100 rounded-3xl overflow-hidden">
                <div
                  className="h-2.5 rounded-3xl transition-all duration-700 group-hover:scale-x-105 origin-left"
                  style={{
                    width: `${Math.min(company.share, 100)}%`,
                    backgroundColor: colors[index] ?? "#64748b",
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <div className="flex h-48 items-center justify-center text-slate-500">
            Upload a file to calculate market share
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-500">Total Market Share - 100%</p>
      </div>
    </div>
  );
}
