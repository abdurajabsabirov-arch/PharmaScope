"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Activity, BarChart3, Database, Gauge, Settings, type LucideIcon } from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "@/lib/i18n";
import { readCurrentUser } from "@/lib/demoAuth";

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  path: string;
};

const menu: MenuItem[] = [
  { title: "Market Intelligence", href: "/market", icon: BarChart3, path: "/market" },
  { title: "Performance Cockpit", href: "/market/performance", icon: Gauge, path: "/market/performance" },
  { title: "Data Management", href: "/data", icon: Database, path: "/data" },
  { title: "Administration", href: "/admin", icon: Settings, path: "/admin" },
];

const RU = {
  "Market Intelligence": "\u0410\u043d\u0430\u043b\u0438\u0442\u0438\u043a\u0430 \u0440\u044b\u043d\u043a\u0430",
  "Performance Cockpit": "Performance Cockpit",
  "Data Management": "\u0423\u043f\u0440\u0430\u0432\u043b\u0435\u043d\u0438\u0435 \u0434\u0430\u043d\u043d\u044b\u043c\u0438",
  Administration: "\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u0435",
  data: "\u0414\u0430\u043d\u043d\u044b\u0435",
  updated: "\u041e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u043e",
  source: "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a",
  marketFile: "\u0424\u0430\u0439\u043b \u0440\u044b\u043d\u043a\u0430",
};

const UZ = {
  "Market Intelligence": "Market Intelligence",
  "Performance Cockpit": "Performance Cockpit",
  "Data Management": "Data Management",
  Administration: "Administrator",
  data: "Ma'lumotlar",
  updated: "Oxirgi yangilanish",
  source: "Ma'lumot manbai",
  marketFile: "Market fayli",
};

function readRole() {
  return readCurrentUser()?.role ?? "user";
}

export default function Sidebar() {
  const pathname = usePathname();
  const { isRu, isUz } = useLanguage();
  const [role, setRole] = useState<string>("user");

  useEffect(() => {
    const timer = window.setTimeout(() => setRole(readRole()), 0);
    const onChange = () => setRole(readRole());
    window.addEventListener("pharmascope-user-change", onChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pharmascope-user-change", onChange);
    };
  }, []);

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-950 bg-[#071426] text-white shadow-2xl">
      <div className="border-b border-white/10 px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menu.filter((item) => role === "admin" || item.title === "Market Intelligence" || item.title === "Performance Cockpit").map((item) => {
          const Icon = item.icon;
          const isActive = item.path === pathname;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                  : "text-slate-200 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} strokeWidth={2} />
              <span>{isUz ? UZ[item.title as keyof typeof UZ] ?? item.title : isRu ? RU[item.title as keyof typeof RU] ?? item.title : item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
          <div className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Activity size={15} />
            {isRu ? RU.data : "Data Info"}
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-slate-500">{isRu ? RU.updated : "Last update"}</p>
              <p className="font-semibold text-emerald-300">May 2026</p>
            </div>
            <div className="border-t border-white/10 pt-2.5">
              <p className="text-slate-500">{isRu ? RU.source : "Data source"}</p>
              <p className="font-semibold text-white">{isRu ? RU.marketFile : "Market file"}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
