const brands = [
  {
    brand: "Tylol Hot",
    company: "Nobel",
    sales: "$12.4M",
    growth: "+18.2%",
    share: "6.4%",
  },
  {
    brand: "Anzibel",
    company: "Nobel",
    sales: "$8.7M",
    growth: "+11.6%",
    share: "4.2%",
  },
  {
    brand: "Tractus",
    company: "Nobel",
    sales: "$7.1M",
    growth: "+9.4%",
    share: "3.8%",
  },
  {
    brand: "PanTap",
    company: "Nobel",
    sales: "$5.5M",
    growth: "+21.7%",
    share: "2.7%",
  },
  {
    brand: "UrsoPat",
    company: "Nobel",
    sales: "$4.2M",
    growth: "+14.1%",
    share: "2.1%",
  },
];

export default function TopBrandsTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Top Brands
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b text-left text-sm text-slate-500">

            <th className="pb-3">Brand</th>
            <th className="pb-3">Company</th>
            <th className="pb-3">Sales</th>
            <th className="pb-3">Growth</th>
            <th className="pb-3">Share</th>

          </tr>

        </thead>

        <tbody>

          {brands.map((brand) => (

            <tr
              key={brand.brand}
              className="border-b last:border-0"
            >

              <td className="py-3 font-medium">
                {brand.brand}
              </td>

              <td>{brand.company}</td>

              <td>{brand.sales}</td>

              <td className="text-emerald-600">
                {brand.growth}
              </td>

              <td>{brand.share}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}