const cards = [
  {
    title: "Total Market",
    value: "$124.6M",
    growth: "+12.4%",
  },
  {
    title: "Nobel Sales",
    value: "$18.3M",
    growth: "+8.2%",
  },
  {
    title: "Market Share",
    value: "14.7%",
    growth: "+0.6 pp",
  },
  {
    title: "Rank",
    value: "#4",
    growth: "+1",
  },
];

export default function MarketKPIs() {
  return (
    <div className="grid gap-6 [grid-template-columns:repeat(auto-fit,minmax(260px,1fr))]">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
        >
          <p className="text-sm font-medium text-slate-500">
            {card.title}
          </p>

          <h2 className="mt-3 text-4xl font-bold text-slate-900">
            {card.value}
          </h2>

          <p className="mt-3 text-sm font-semibold text-emerald-600">
            {card.growth}
          </p>
        </div>
      ))}
    </div>
  );
}