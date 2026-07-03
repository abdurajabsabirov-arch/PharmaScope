type TopSKUTableProps = {
  skus: Array<{
    sku: string;
    brand: string;
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

export default function TopSKUTable({ skus = [] }: Partial<TopSKUTableProps>) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold tracking-tight">Top SKU</h2>
        <p className="text-slate-500">By selected brand, molecule, or current filter set</p>
      </div>

      {skus.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
                <th className="pb-4 font-medium">SKU</th>
                <th className="pb-4 font-medium">Brand</th>
                <th className="pb-4 font-medium">Company</th>
                <th className="pb-4 font-medium text-right">Sales</th>
                <th className="pb-4 font-medium text-right">Packs</th>
                <th className="pb-4 font-medium text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {skus.map((sku) => (
                <tr key={`${sku.sku}-${sku.company}`} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
                  <td className="py-4 font-medium text-slate-900">{sku.sku}</td>
                  <td className="py-4 text-slate-600">{sku.brand}</td>
                  <td className="py-4 text-slate-600">{sku.company}</td>
                  <td className="py-4 text-right font-medium">${formatter.format(sku.sales)}</td>
                  <td className="py-4 text-right text-slate-600">{formatter.format(sku.units ?? 0)}</td>
                  <td className="py-4 text-right text-slate-600">{sku.share}%</td>
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
