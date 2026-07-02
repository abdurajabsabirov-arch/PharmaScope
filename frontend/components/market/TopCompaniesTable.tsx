const companies = [
  {
    rank: 1,
    company: "Santo",
    sales: "$22.4M",
    share: "18.0%",
    growth: "+8.4%",
  },
  {
    rank: 2,
    company: "Berlin Chemie",
    sales: "$20.1M",
    share: "16.1%",
    growth: "+6.2%",
  },
  {
    rank: 3,
    company: "World Medicine",
    sales: "$18.9M",
    share: "15.2%",
    growth: "+11.3%",
  },
  {
    rank: 4,
    company: "Nobel",
    sales: "$18.3M",
    share: "14.7%",
    growth: "+8.2%",
  },
  {
    rank: 5,
    company: "Kusum",
    sales: "$15.2M",
    share: "12.2%",
    growth: "+4.9%",
  },
];

export default function TopCompaniesTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-xl font-semibold">
        Top Companies
      </h2>

      <table className="w-full">

        <thead>

          <tr className="border-b text-left text-sm text-slate-500">

            <th className="pb-3">Rank</th>
            <th className="pb-3">Company</th>
            <th className="pb-3">Sales</th>
            <th className="pb-3">Share</th>
            <th className="pb-3">Growth</th>

          </tr>

        </thead>

        <tbody>

          {companies.map((item) => (

            <tr
              key={item.rank}
              className="border-b last:border-0"
            >

              <td className="py-3 font-semibold">
                {item.rank}
              </td>

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