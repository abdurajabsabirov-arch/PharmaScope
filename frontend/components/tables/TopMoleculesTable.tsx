type TopMoleculesTableProps = {
  molecules: Array<{
    molecule: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
  }>;
  title?: string;
  subtitle?: string;
  label?: string;
  emptyLabel?: string;
};

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TopMoleculesTable({
  molecules = [],
  title = "Top Molecules",
  subtitle = "By Market Value (USD)",
  label = "Molecule",
  emptyLabel = "No molecule data",
}: Partial<TopMoleculesTableProps>) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-950">{title}</h2>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>

      {molecules.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[460px] table-fixed text-xs">
            <colgroup>
              <col className="w-9" />
              <col />
              <col className="w-24" />
              <col className="w-16" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">{label}</th>
                <th className="pb-3 text-right font-semibold">Value</th>
                <th className="pb-3 text-right font-semibold">Packs</th>
                <th className="pb-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody>
              {molecules.slice(0, 10).map((item, index) => (
                <tr key={item.molecule} className="border-b border-slate-100 last:border-0">
                  <td className="py-2.5 text-slate-500">{index + 1}.</td>
                  <td className="truncate py-2.5 pr-2 font-semibold text-slate-800" title={item.molecule}>{item.molecule}</td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold text-slate-800">
                    ${formatter.format(item.sales)}
                    <Delta value={item.sales_change} suffix="%" />
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{formatter.format(item.units ?? 0)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">
                    {item.share}%
                    <Delta value={item.share_change} suffix=" pp" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">{emptyLabel}</div>
      )}
    </div>
  );
}

function Delta({ value = 0, suffix }: { value?: number; suffix: string }) {
  const rounded = Math.round(value * 10) / 10;
  const tone = rounded > 0 ? "text-emerald-600" : rounded < 0 ? "text-rose-600" : "text-amber-500";
  const symbol = rounded > 0 ? "↗" : rounded < 0 ? "↘" : "≈";
  return <div className={`text-[10px] font-semibold ${tone}`}>{symbol} {rounded > 0 ? "+" : ""}{rounded}{suffix}</div>;
}
