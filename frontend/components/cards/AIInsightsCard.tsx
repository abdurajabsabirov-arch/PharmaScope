const insights = [
  {
    type: "Positive",
    text: "Nobel Pharmsanoat is growing 29.3% YoY — significantly outperforming the market (+15.1%).",
    color: "emerald"
  },
  {
    type: "Opportunity",
    text: "PanTap shows the highest growth rate among all top brands (+21.7%). Consider expanding promotion.",
    color: "blue"
  },
  {
    type: "Alert",
    text: "Kashkadarya region is underperforming. Sales are 18% below target.",
    color: "amber"
  },
  {
    type: "Recommendation",
    text: "Increase focus on Samarkand and Bukhara regions to capture additional 4.2% market share.",
    color: "slate"
  },
];

export default function AIInsightsCard() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">

      <h2 className="text-2xl font-semibold tracking-tight mb-2">AI Executive Insights</h2>
      <p className="text-slate-500">Generated from latest IQVIA data • July 2026</p>

      <div className="mt-8 space-y-5">
        {insights.map((insight, index) => (
          <div key={index} className="flex gap-5 rounded-2xl border border-slate-100 p-6 hover:border-slate-200 transition">
            <div className={`w-2.5 h-2.5 mt-2 rounded-full flex-shrink-0 ${
              insight.color === 'emerald' ? 'bg-emerald-500' : 
              insight.color === 'blue' ? 'bg-blue-500' : 
              insight.color === 'amber' ? 'bg-amber-500' : 'bg-slate-400'
            }`} />
            
            <div>
              <p className="uppercase text-xs font-semibold tracking-widest text-slate-500">{insight.type}</p>
              <p className="mt-2 leading-relaxed text-slate-700">{insight.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}