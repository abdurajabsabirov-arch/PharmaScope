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
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Left */}

      <div className="flex items-center gap-6">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="
              h-11
              w-96
              rounded-xl
              border
              border-slate-300
              bg-slate-50
              pl-11
              pr-4
              outline-none
              transition
              focus:border-blue-500
              focus:bg-white
            "
          />

        </div>

      </div>

      {/* Right */}

      <div className="flex items-center gap-6">

        <button className="rounded-xl p-2 hover:bg-slate-100 transition">
          <Globe size={20} />
        </button>

        <button className="rounded-xl p-2 hover:bg-slate-100 transition">
          <Bell size={20} />
        </button>

        <button className="rounded-xl p-2 hover:bg-slate-100 transition">
          <Settings size={20} />
        </button>

        <div className="flex items-center gap-3 rounded-xl border border-slate-200 px-3 py-2">

          <UserCircle2
            size={34}
            className="text-slate-700"
          />

          <div>

            <p className="text-sm font-semibold">
              Administrator
            </p>

            <p className="text-xs text-slate-500">
              admin@pharmascope.ai
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}