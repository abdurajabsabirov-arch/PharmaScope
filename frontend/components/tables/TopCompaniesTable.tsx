type TopCompaniesTableProps = {
  companies: Array<{
    company: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
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
        <p className="text-xs text-slate-500">By Market Value (USD), compared with the same months last year</p>
      </div>

      {companies.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[340px] table-fixed text-xs">
            <colgroup>
              <col className="w-9" />
              <col />
              <col className="w-24" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 text-right font-semibold" title="Sales value with change versus the same months last year">Value vs LY</th>
                <th className="pb-3 text-right font-semibold" title="Current market share and delta in percentage points versus the same months last year">Share / Delta</th>
              </tr>
            </thead>
            <tbody>
              {companies.slice(0, 10).map((company, index) => (
                <tr key={company.company} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 text-slate-500">{company.rank ?? index + 1}.</td>
                  <td className="truncate py-2.5 pr-2 font-semibold text-slate-800" title={company.company}>{company.company}</td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold text-slate-800">
                    ${formatter.format(company.sales)}
                    <Delta value={company.sales_change} suffix="%" title="Sales change versus the same months last year" />
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">
                    {company.share}%
                    <Delta value={company.share_change} suffix=" pp" title="Share change in percentage points versus the same months last year" />
                  </td>
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

function Delta({ value = 0, suffix, title }: { value?: number; suffix: string; title?: string }) {
  const rounded = Math.round(value * 10) / 10;
  const tone = rounded > 0 ? "text-emerald-600" : rounded < 0 ? "text-rose-600" : "text-amber-500";
  const symbol = rounded > 0 ? "↗" : rounded < 0 ? "↘" : "≈";
  return <div className={`text-[10px] font-semibold ${tone}`} title={title}>{symbol} {rounded > 0 ? "+" : ""}{rounded}{suffix}</div>;
}
