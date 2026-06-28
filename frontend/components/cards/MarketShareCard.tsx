export default function MarketShareCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-slate-900">
        Market Share
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Top 5 Companies
      </p>

      <div className="mt-6 space-y-4">

        <Row name="Nobel" value={18.2} />
        <Row name="Santo" value={15.6} />
        <Row name="Berlin Chemie" value={12.4} />
        <Row name="World Medicine" value={10.8} />
        <Row name="Kusum" value={9.9} />

      </div>
    </div>
  );
}

function Row({
  name,
  value,
}: {
  name: string;
  value: number;
}) {
  return (
    <div>

      <div className="mb-1 flex justify-between text-sm">

        <span>{name}</span>

        <span>{value}%</span>

      </div>

      <div className="h-2 rounded-full bg-slate-200">

        <div
          className="h-2 rounded-full bg-slate-900"
          style={{
            width: `${value * 4}%`,
          }}
        />

      </div>

    </div>
  );
}