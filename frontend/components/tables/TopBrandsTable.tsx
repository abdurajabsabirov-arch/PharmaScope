type TopBrandsTableProps = {
  brands: Array<{
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

export default function TopBrandsTable({ brands = [] }: Partial<TopBrandsTableProps>) {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Top Brands</h2>
          <p className="text-sm text-slate-500">By sales value</p>
        </div>
      </div>

      {brands.length ? (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
              <th className="pb-4 font-medium">Brand</th>
              <th className="pb-4 font-medium">Company</th>
              <th className="pb-4 font-medium text-right">Sales</th>
              <th className="pb-4 font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {brands.map((brand) => (
              <tr
                key={`${brand.brand}-${brand.company}`}
                className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition"
              >
                <td className="py-4 font-medium text-slate-900">{brand.brand}</td>
                <td className="py-4 text-slate-600">{brand.company || "-"}</td>
                <td className="py-4 text-right">
                  <p className="font-medium">${formatter.format(brand.sales)}</p>
                  <p className="text-xs text-slate-500">{formatter.format(brand.units ?? 0)} packs</p>
                </td>
                <td className="py-4 text-right text-slate-600">{brand.share}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="flex h-40 items-center justify-center text-slate-500">
          Upload a file to calculate top brands
        </div>
      )}
    </div>
  );
}
