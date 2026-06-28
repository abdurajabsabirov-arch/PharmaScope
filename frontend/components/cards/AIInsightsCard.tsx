const insights = [
  {
    type: "Market",
    text: "PPI category is growing 12.4% faster than the total market.",
  },
  {
    type: "Opportunity",
    text: "PanTap demonstrates the highest growth among TOP competitors.",
  },
  {
    type: "Risk",
    text: "Sales performance in Kashkadarya remains below target.",
  },
  {
    type: "Recommendation",
    text: "Increase promotional activity in Samarkand and Bukhara.",
  },
];

export default function AIInsightsCard() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

      <h2 className="text-xl font-semibold">
        AI Insights
      </h2>

      <p className="mt-1 text-sm text-slate-500">
        Executive Summary
      </p>

      <div className="mt-6 space-y-4">

        {insights.map((item, index) => (

          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-slate-50 p-4"
          >

            <p className="text-xs font-semibold uppercase text-blue-600">
              {item.type}
            </p>

            <p className="mt-2 text-sm text-slate-700">
              {item.text}
            </p>

          </div>

        ))}

      </div>

    </div>
  );
}