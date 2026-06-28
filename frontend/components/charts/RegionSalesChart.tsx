const regions = [
  { name: "Tashkent", value: 98 },
  { name: "Samarkand", value: 84 },
  { name: "Fergana", value: 76 },
  { name: "Andijan", value: 69 },
  { name: "Bukhara", value: 63 },
  { name: "Namangan", value: 58 },
  { name: "Kashkadarya", value: 55 },
];

export default function RegionSalesChart() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        Regional Sales
      </h2>

      <p className="mb-6 text-sm text-slate-500">
        Sales Performance
      </p>

      <div className="space-y-5">

        {regions.map((region) => (

          <div key={region.name}>

            <div className="mb-2 flex justify-between text-sm">

              <span>{region.name}</span>

              <span className="font-semibold">
                {region.value}%
              </span>

            </div>

            <div className="h-3 rounded-full bg-slate-200">

              <div
                className="h-3 rounded-full bg-blue-600 transition-all"
                style={{
                  width: `${region.value}%`,
                }}
              />

            </div>

          </div>

        ))}

      </div>

    </div>
  );
}