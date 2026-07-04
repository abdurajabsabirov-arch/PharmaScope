"use client";

import { useState } from "react";
import { Bell, Globe, UserCircle2 } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";

type HeaderProps = {
  country?: string;
};

export default function Header({ country = "Uzbekistan" }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<"language" | "notifications" | null>(null);
  const { language, setLanguage, isRu } = useLanguage();

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">{isRu ? "Рынок" : "Market"}</p>
        <p className="text-base font-bold text-blue-900">
          <span className="mr-2">{flagForCountry(country)}</span>
          {country}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
            className="rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100"
            title={isRu ? "Язык" : "Language"}
          >
            <Globe size={20} />
          </button>
          {openMenu === "language" && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg">
              {(["EN", "RU"] as Language[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setLanguage(item);
                    setOpenMenu(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left font-medium ${language === item ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  {item === "EN" ? "English" : "Русский"}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
            className="relative rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100"
            title={isRu ? "Уведомления" : "Notifications"}
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {openMenu === "notifications" && (
            <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
              <p className="font-semibold text-slate-900">{isRu ? "Уведомления по данным" : "Data notifications"}</p>
              <p className="mt-2 text-slate-600">
                {isRu ? "Здесь будут отображаться изменения активного файла и статус загрузок." : "Active file changes and upload status will appear here."}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="max-w-[160px] text-right">
            <p className="truncate text-sm font-semibold text-slate-900">Rj Sabirov</p>
            <p className="truncate text-xs text-slate-500">{isRu ? "Администратор" : "Administrator"}</p>
          </div>

          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
            <UserCircle2 size={28} className="text-slate-600" />
          </div>
        </div>
      </div>
    </header>
  );
}

function flagForCountry(country?: string) {
  const flags: Record<string, string> = {
    Uzbekistan: "🇺🇿",
    Kazakhstan: "🇰🇿",
    Kyrgyzstan: "🇰🇬",
    Tajikistan: "🇹🇯",
    Turkmenistan: "🇹🇲",
    Azerbaijan: "🇦🇿",
    Georgia: "🇬🇪",
    Russia: "🇷🇺",
  };
  return flags[country ?? "Uzbekistan"] ?? "🌐";
}
