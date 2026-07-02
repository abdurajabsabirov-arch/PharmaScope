const brands = [
  {
    rank: 1,
    brand: "Tylol Hot",
    company: "Nobel",
    sales: "$12.4M",
    share: "6.4%",
    growth: "+18.2%",
  },
  {
    rank: 2,
    brand: "Anzibel",
    company: "Nobel",
    sales: "$8.7M",
    share: "4.2%",
    growth: "+11.6%",
  },
  {
    rank: 3,
    brand: "PanTap",
    company: "Nobel",
    sales: "$5.5M",
    share: "2.7%",
    growth: "+21.7%",
  },
  {
    rank: 4,
    brand: "Tractus",
    company: "Nobel",
    sales: "$5.1M",
    share: "2.5%",
    growth: "+9.4%",
  },
  {
    rank: 5,
    brand: "UrsoPat",
    company: "Nobel",
    sales: "$4.2M",
    share: "2.1%",
    growth: "+14.1%",
  },
];

export default function TopBrandsMarketTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Top Brands
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b text-left text-sm text-slate-500">

            <th className="pb-3">Rank</th>
            <th className="pb-3">Brand</th>
            <th className="pb-3">Company</th>
            <th className="pb-3">Sales</th>
            <th className="pb-3">Share</th>
            <th className="pb-3">Growth</th>

          </tr>

        </thead>

        <tbody>

          {brands.map((item) => (

            <tr
              key={item.rank}
              className="border-b last:border-0"
            >

              <td className="py-3 font-semibold">
                {item.rank}
              </td>

              <td>{item.brand}</td>

              <td>{item.company}</td>

              <td>{item.sales}</td>

              <td>{item.share}</td>

              <td className="font-medium text-emerald-600">
                {item.growth}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}