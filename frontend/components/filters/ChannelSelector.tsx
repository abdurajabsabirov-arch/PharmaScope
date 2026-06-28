"use client";

const channels = [
  "All Channels",
  "Retail Pharmacy",
  "Hospital",
  "Government Tender",
  "Private Clinic",
  "Distributor",
];

export default function ChannelSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        Channel
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {channels.map((channel) => (
          <option key={channel} value={channel}>
            {channel}
          </option>
        ))}
      </select>
    </div>
  );
}