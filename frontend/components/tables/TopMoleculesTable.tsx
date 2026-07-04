type TopMoleculesTableProps = {
  molecules: Array<{
    molecule: string;
    sales: number;
    units?: number;
    share: number;
  }>;
};

const formatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function TopMoleculesTable({ molecules = [] }: Partial<TopMoleculesTableProps>) {
  return (
    <div className="glass-panel rounded-lg p-5">
      <div className="mb-5">
        <h2 className="text-base font-bold text-slate-950">Top Molecules</h2>
        <p className="text-xs text-slate-500">By Market Value (USD)</p>
      </div>

      {molecules.length ? (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] table-fixed text-xs">
            <colgroup>
              <col className="w-9" />
              <col />
              <col className="w-20" />
              <col className="w-20" />
              <col className="w-14" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-100 text-left text-slate-500">
                <th className="pb-3 font-semibold">#</th>
                <th className="pb-3 font-semibold">Molecule</th>
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
                  <td className="whitespace-nowrap py-2.5 text-right font-semibold text-slate-800">${formatter.format(item.sales)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{formatter.format(item.units ?? 0)}</td>
                  <td className="whitespace-nowrap py-2.5 text-right text-slate-600">{item.share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center text-sm text-slate-500">No molecule data</div>
      )}
    </div>
  );
}
