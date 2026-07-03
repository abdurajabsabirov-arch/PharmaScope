"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";

import {
  BarChart3,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  Settings,
} from "lucide-react";

const menu = [
  { title: "Market Intelligence", href: "/market", icon: BarChart3 },
  { title: "Sales Intelligence", href: "/sales", icon: TrendingUp },
  { title: "AI Intelligence", href: "/ai", icon: BrainCircuit },
  { title: "Knowledge Center", href: "/knowledge", icon: BookOpen },
  { title: "Administration", href: "/admin", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-80 flex-col bg-[#111827] text-white border-r border-slate-800">

      <div className="border-b border-slate-800 px-8 py-10">
        <Logo />
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {menu.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3.5 rounded-2xl px-5 py-3.5 text-[15px] font-medium transition-all ${
                isActive 
                  ? 'bg-white text-slate-900' 
                  : 'hover:bg-white/10'
              }`}
            >
              <Icon size={22} strokeWidth={2} />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-6">
        <div className="text-xs text-slate-500">
          PharmaScope • v1.0.0
        </div>
      </div>

    </aside>
  );
}
