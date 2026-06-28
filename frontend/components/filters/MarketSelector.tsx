"use client";

const markets = [
  "Total Market",
  "Rx Market",
  "OTC Market",
  "Hospital",
];

export default function MarketSelector() {
  return (
    <div className="flex items-center gap-2">

      <span className="text-sm font-medium text-slate-600">
        Market
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {markets.map((market) => (
          <option
            key={market}
            value={market}
          >
            {market}
          </option>
        ))}

      </select>

    </div>
  );
}