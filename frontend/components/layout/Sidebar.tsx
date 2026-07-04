"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import {
  Activity,
  BarChart3,
  Database,
  Settings,
  type LucideIcon,
} from "lucide-react";
import Logo from "./Logo";
import { useLanguage } from "@/lib/i18n";

type MenuItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  section?: string;
  path?: string;
};

const menu: MenuItem[] = [
  { title: "Market Intelligence", href: "/market", icon: BarChart3, path: "/market" },
  { title: "Data Management", href: "/data", icon: Database, path: "/data" },
  { title: "Administration", href: "/admin", icon: Settings, path: "/admin" },
];

const ruTitles: Record<string, string> = {
  "Market Intelligence": "Аналитика рынка",
  "Data Management": "Управление данными",
  Administration: "Администрирование",
};

export default function Sidebar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeSection = searchParams.get("section");
  const { isRu } = useLanguage();

  return (
    <aside className="flex h-screen w-72 flex-col border-r border-slate-950 bg-[#071426] text-white shadow-2xl">
      <div className="border-b border-white/10 px-5 py-5">
        <Logo />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {menu.map((item) => {
          const Icon = item.icon;
          const isSectionActive = item.section && activeSection === item.section;
          const isPathActive = item.path === pathname && !activeSection;
          const isAdminDataActive = false;
          const isActive = Boolean(isSectionActive || isPathActive || isAdminDataActive);

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
              <span>{isRu ? ruTitles[item.title] ?? item.title : item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-300">
          <div className="mb-2 flex items-center gap-2 font-semibold text-white">
            <Activity size={15} />
            {isRu ? "Данные" : "Data Info"}
          </div>
          <div className="space-y-2.5">
            <div>
              <p className="text-slate-500">{isRu ? "Обновлено" : "Last update"}</p>
              <p className="font-semibold text-emerald-300">May 2026</p>
            </div>
            <div className="border-t border-white/10 pt-2.5">
              <p className="text-slate-500">{isRu ? "Источник" : "Data source"}</p>
              <p className="font-semibold text-white">{isRu ? "Файл рынка" : "Market file"}</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
