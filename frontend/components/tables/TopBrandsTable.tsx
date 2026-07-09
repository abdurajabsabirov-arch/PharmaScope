type TopBrandsTableProps = {
  brands: Array<{
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

export default function TopBrandsTable({ brands = [] }: Partial<TopBrandsTableProps>) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5 flex justify-between items-center">
        <div>
          <h2 className="text-base font-bold text-slate-950">Top Brands</h2>
          <p className="text-xs text-slate-500">By Market Value (USD)</p>
        </div>
      </div>

      {brands.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[500px] table-fixed text-xs">
            <colgroup>
              <col className="w-9" />
              <col />
              <col className="w-24" />
              <col className="w-24" />
              <col className="w-16" />
              <col className="w-20" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">Brand</th>
                <th className="pb-3 font-semibold">Company</th>
                <th className="pb-3 text-right font-semibold">Value</th>
                <th className="pb-3 text-right font-semibold">Packs</th>
                <th className="pb-3 text-right font-semibold">Share</th>
              </tr>
            </thead>
            <tbody>
              {brands.slice(0, 10).map((brand, index) => (
                <tr
                  key={`${brand.brand}-${brand.company}`}
                  className="border-b border-slate-100 last:border-0"
                >
                  <td className="py-2.5 text-slate-500">{index + 1}.</td>
                  <td className="truncate py-2.5 pr-2 font-semibold text-slate-800" title={brand.brand}>{brand.brand}</td>
                  <td className="truncate py-2.5 pr-2 text-slate-600" title={brand.company || "-"}>{brand.company || "-"}</td>
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold text-slate-800">
                    ${formatter.format(brand.sales)}
                    <Delta value={brand.sales_change} suffix="%" />
                  </td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{formatter.format(brand.units ?? 0)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">
                    {brand.share}%
                    <Delta value={brand.share_change} suffix=" pp" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">
          Upload a file to calculate top brands
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
