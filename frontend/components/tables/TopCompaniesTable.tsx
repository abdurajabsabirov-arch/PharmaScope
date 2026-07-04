type TopCompaniesTableProps = {
  companies: Array<{
    company: string;
    sales: number;
    units?: number;
    share: number;
    rank?: number;
  }>;
};

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TopCompaniesTable({ companies = [] }: Partial<TopCompaniesTableProps>) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-950">Top Companies</h2>
        <p className="text-xs text-slate-500">By Market Value (USD)</p>
      </div>

      {companies.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[380px] table-fixed text-xs">
            <colgroup>
              <col className="w-9" />
              <col />
              <col className="w-20" />
              <col className="w-14" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 text-right font-semibold">Value</th>
                <th className="pb-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody>
              {companies.slice(0, 10).map((company, index) => (
                <tr key={company.company} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 text-slate-500">{company.rank ?? index + 1}.</td>
                  <td className="truncate py-2.5 pr-2 font-semibold text-slate-800" title={company.company}>{company.company}</td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold text-slate-800">${formatter.format(company.sales)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{company.share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          No company data
        </div>
      )}
    </div>
  );
}
