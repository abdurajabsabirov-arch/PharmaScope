"use client";

import Link from "next/link";
import Logo from "./Logo";

import {
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  Settings,
} from "lucide-react";

const menu = [
  {
    title: "Executive",
    href: "/executive",
    icon: LayoutDashboard,
  },
  {
    title: "Market Intelligence",
    href: "/market",
    icon: BarChart3,
  },
  {
    title: "Sales Intelligence",
    href: "/sales",
    icon: TrendingUp,
  },
  {
    title: "AI Intelligence",
    href: "/ai",
    icon: BrainCircuit,
  },
  {
    title: "Knowledge Center",
    href: "/knowledge",
    icon: BookOpen,
  },
  {
    title: "Administration",
    href: "/admin",
    icon: Settings,
  },
];

export default function Sidebar() {
  return (
    <aside className="flex h-screen w-72 flex-col bg-slate-950 text-white">

      <div className="border-b border-slate-800 px-8 py-8">
        <Logo />
      </div>

      <nav className="flex-1 space-y-2 p-4">
        {menu.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-800"
            >
              <Icon size={20} />

              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-800 p-6 text-xs text-slate-500">
        PharmaScope v1.0
      </div>
    </aside>
  );
}