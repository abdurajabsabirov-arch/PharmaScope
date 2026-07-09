"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "Overview", href: "/market", match: "/market" },
  { label: "Competitive Intelligence", href: "/market?section=competitive", match: "competitive" },
  { label: "Performance Cockpit", href: "/market/performance", match: "/market/performance" },
];

export default function MarketTabs() {
  const pathname = usePathname();

  return (
    <div className="mb-5 flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      {tabs.map((tab) => {
        const active = tab.match.startsWith("/") ? pathname === tab.match : false;
        return (
          <Link
            key={tab.label}
            href={tab.href}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              active
                ? "bg-blue-600 text-white shadow-sm"
                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
