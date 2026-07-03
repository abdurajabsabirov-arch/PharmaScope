type TopCompaniesTableProps = {
  companies: Array<{
    company: string;
    sales: number;
    units?: number;
    share: number;
  }>;
};

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TopCompaniesTable({ companies = [] }: Partial<TopCompaniesTableProps>) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-xl font-semibold tracking-tight">Top Companies</h2>
        <p className="text-sm text-slate-500">Ranked by market value</p>
      </div>

      {companies.length ? (
        <div className="space-y-4">
          {companies.slice(0, 8).map((company, index) => (
            <div key={company.company} className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3 last:border-0">
              <div className="min-w-0">
                <p className="font-medium text-slate-900 truncate">
                  {index + 1}. {company.company}
                </p>
                <p className="text-xs text-slate-500">{company.share}% share</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-900">${formatter.format(company.sales)}</p>
                <p className="text-xs text-slate-500">{formatter.format(company.units ?? 0)} packs</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          No company data
        </div>
      )}
    </div>
  );
}
