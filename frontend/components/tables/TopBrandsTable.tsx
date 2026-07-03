const brands = [
  { brand: "Tylol Hot", company: "Nobel", sales: "$12.4M", growth: "+18.2%", share: "6.4%" },
  { brand: "Anzibel", company: "Nobel", sales: "$8.7M", growth: "+11.6%", share: "4.2%" },
  { brand: "Tractus", company: "Nobel", sales: "$7.1M", growth: "+9.4%", share: "3.8%" },
  { brand: "PanTap", company: "Nobel", sales: "$5.5M", growth: "+21.7%", share: "2.7%" },
  { brand: "UrsoPat", company: "Nobel", sales: "$4.2M", growth: "+14.1%", share: "2.1%" },
];

export default function TopBrandsTable() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">

      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Top Brands</h2>
          <p className="text-slate-500">By Sales Value • YTD 2026</p>
        </div>
        <button className="text-blue-600 text-sm font-medium hover:underline">View All →</button>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-100 text-left text-sm text-slate-500">
            <th className="pb-4 font-medium">Brand</th>
            <th className="pb-4 font-medium">Company</th>
            <th className="pb-4 font-medium text-right">Sales</th>
            <th className="pb-4 font-medium text-right">Growth</th>
            <th className="pb-4 font-medium text-right">Share</th>
          </tr>
        </thead>
        <tbody>
          {brands.map((brand, index) => (
            <tr key={index} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition">
              <td className="py-4 font-medium text-slate-900">{brand.brand}</td>
              <td className="py-4 text-slate-600">{brand.company}</td>
              <td className="py-4 text-right font-medium">{brand.sales}</td>
              <td className="py-4 text-right text-emerald-600 font-medium">{brand.growth}</td>
              <td className="py-4 text-right text-slate-600">{brand.share}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}