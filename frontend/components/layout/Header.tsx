"use client";

import {
  Bell,
  Globe,
  Search,
  Settings,
  UserCircle2,
} from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10">

      {/* Search */}
      <div className="relative w-96">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />
        <input
          type="text"
          placeholder="Search market, company, SKU..."
          onChange={(e) => console.log("Search:", e.target.value)}
          className="h-11 w-full rounded-2xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        <button className="rounded-2xl p-3 hover:bg-slate-100 transition text-slate-600">
          <Globe size={20} />
        </button>

        <button className="rounded-2xl p-3 hover:bg-slate-100 transition text-slate-600 relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>

        <button className="rounded-2xl p-3 hover:bg-slate-100 transition text-slate-600">
          <Settings size={20} />
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-slate-200">
          <div className="text-right max-w-[160px]">
            <p className="text-sm font-semibold text-slate-900 truncate">Rj Sabirov</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>

          <div className="h-9 w-9 rounded-2xl bg-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0">
            <UserCircle2 size={28} className="text-slate-600" />
          </div>
        </div>

      </div>

    </header>
  );
}