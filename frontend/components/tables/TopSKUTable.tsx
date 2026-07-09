type TopSKUTableProps = {
  skus: Array<{
    sku: string;
    brand: string;
    company: string;
    sales: number;
    units?: number;
    share: number;
    sales_change?: number;
    share_change?: number;
  }>;
};

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TopSKUTable({ skus = [] }: Partial<TopSKUTableProps>) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-950">Top SKU</h2>
        <p className="text-xs text-slate-500">By selected brand, molecule, or current filter set</p>
      </div>

      {skus.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] table-fixed text-xs">
            <colgroup>
              <col />
              <col className="w-32" />
              <col className="w-32" />
              <col className="w-24" />
              <col className="w-20" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">SKU</th>
                <th className="pb-3 font-semibold">Brand</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 font-semibold text-right">Sales</th>
                <th className="pb-3 font-semibold text-right">Packs</th>
                <th className="pb-3 font-semibold text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={`${sku.sku}-${sku.company}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="truncate py-2.5 pr-2 font-semibold text-slate-900" title={sku.sku}>{sku.sku}</td>
                  <td className="truncate py-2.5 pr-2 text-slate-600" title={sku.brand}>{sku.brand}</td>
                  <td className="truncate py-2.5 pr-2 text-slate-600" title={sku.company}>{sku.company}</td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold">
                    ${formatter.format(sku.sales)}
                    <Delta value={sku.sales_change} suffix="%" />
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{formatter.format(sku.units ?? 0)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">
                    {sku.share}%
                    <Delta value={sku.share_change} suffix=" pp" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          No SKU data
        </div>
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
