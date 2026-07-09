"use client";

import { useEffect, useState } from "react";
import { Bell, Globe, UserCircle2 } from "lucide-react";
import { useLanguage, type Language } from "@/lib/i18n";
import { logoutCurrentUser, readCurrentUser } from "@/lib/demoAuth";

type HeaderProps = {
  country?: string;
};

type CurrentUser = {
  login: string;
  full_name?: string;
  role?: string;
};

const RU = {
  market: "\u0420\u044b\u043d\u043e\u043a",
  language: "\u042f\u0437\u044b\u043a",
  russian: "\u0420\u0443\u0441\u0441\u043a\u0438\u0439",
  notifications: "\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f",
  dataNotifications: "\u0423\u0432\u0435\u0434\u043e\u043c\u043b\u0435\u043d\u0438\u044f \u043f\u043e \u0434\u0430\u043d\u043d\u044b\u043c",
  notificationText: "\u0417\u0434\u0435\u0441\u044c \u0431\u0443\u0434\u0443\u0442 \u043e\u0442\u043e\u0431\u0440\u0430\u0436\u0430\u0442\u044c\u0441\u044f \u0438\u0437\u043c\u0435\u043d\u0435\u043d\u0438\u044f \u0430\u043a\u0442\u0438\u0432\u043d\u043e\u0433\u043e \u0444\u0430\u0439\u043b\u0430 \u0438 \u0441\u0442\u0430\u0442\u0443\u0441 \u0437\u0430\u0433\u0440\u0443\u0437\u043e\u043a.",
  administrator: "\u0410\u0434\u043c\u0438\u043d\u0438\u0441\u0442\u0440\u0430\u0442\u043e\u0440",
  checkUpdates: "\u041f\u0440\u043e\u0432\u0435\u0440\u0438\u0442\u044c \u043d\u0430 \u043e\u0431\u043d\u043e\u0432\u043b\u0435\u043d\u0438\u044f",
  user: "\u041f\u043e\u043b\u044c\u0437\u043e\u0432\u0430\u0442\u0435\u043b\u044c",
};

export default function Header({ country }: HeaderProps) {
  const [openMenu, setOpenMenu] = useState<"language" | "notifications" | null>(null);
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const { language, setLanguage, isRu, isUz } = useLanguage();
  const countryCode = country ? countryCodeFor(country) : undefined;
  const countryLabel = country ?? (isUz ? "Yuklanmoqda..." : isRu ? "Загрузка..." : "Loading...");

  useEffect(() => {
    const timer = window.setTimeout(() => setCurrentUser(readCurrentUser()), 0);
    const onChange = () => setCurrentUser(readCurrentUser());
    window.addEventListener("pharmascope-user-change", onChange);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pharmascope-user-change", onChange);
    };
  }, []);

  const logout = () => {
    logoutCurrentUser();
    window.location.href = "/";
  };

  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-10">
      <div className="rounded-xl border border-blue-100 bg-blue-50 px-4 py-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-blue-500">{isUz ? "Bozor" : isRu ? RU.market : "Market"}</p>
        <p className="flex items-center gap-2 text-base font-bold text-blue-900">
          <span className="flex h-5 w-7 overflow-hidden rounded-sm border border-blue-100 bg-white">
            {countryCode ? (
              <img
                src={`https://flagcdn.com/w40/${countryCode}.png`}
                alt=""
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="m-auto text-[10px] font-bold text-blue-700">...</span>
            )}
          </span>
          {countryLabel}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === "language" ? null : "language")}
            className="rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100"
            title={isUz ? "Til" : isRu ? RU.language : "Language"}
          >
            <Globe size={20} />
          </button>
          {openMenu === "language" && (
            <div className="absolute right-0 z-20 mt-2 w-40 rounded-xl border border-slate-200 bg-white p-2 text-sm shadow-lg">
              {(["EN", "RU", "UZ"] as Language[]).map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setLanguage(item);
                    setOpenMenu(null);
                  }}
                  className={`block w-full rounded-lg px-3 py-2 text-left font-medium ${language === item ? "bg-blue-50 text-blue-700" : "text-slate-700 hover:bg-slate-50"}`}
                >
                  {item === "EN" ? "English" : item === "RU" ? RU.russian : "O'zbekcha"}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => window.open("https://github.com/abdurajabsabirov-arch/PharmaScope/releases", "_blank", "noopener,noreferrer")}
          className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
        >
          {isUz ? "Yangilanishlarni tekshirish" : isRu ? RU.checkUpdates : "Check for Updates"}
        </button>

        <div className="relative">
          <button
            onClick={() => setOpenMenu(openMenu === "notifications" ? null : "notifications")}
            className="relative rounded-2xl p-3 text-slate-600 transition hover:bg-slate-100"
            title={isUz ? "Bildirishnomalar" : isRu ? RU.notifications : "Notifications"}
          >
            <Bell size={20} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
          </button>
          {openMenu === "notifications" && (
            <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-slate-200 bg-white p-4 text-sm shadow-lg">
              <p className="font-semibold text-slate-900">{isUz ? "Ma'lumot bildirishnomalari" : isRu ? RU.dataNotifications : "Data notifications"}</p>
              <p className="mt-2 text-slate-600">
                {isUz ? "Faol fayl o‘zgarishlari va yuklash holati bu yerda ko‘rinadi." : isRu ? RU.notificationText : "Active file changes and upload status will appear here."}
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="max-w-[160px] text-right">
            <p className="truncate text-sm font-semibold text-slate-900">{currentUser?.full_name || currentUser?.login || "Guest"}</p>
            <p className="truncate text-xs text-slate-500">
              {currentUser?.role === "admin" ? (isRu ? RU.administrator : "Administrator") : (isRu ? RU.user : "User")}
            </p>
          </div>

          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-slate-200">
            <UserCircle2 size={28} className="text-slate-600" />
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}

function countryCodeFor(country?: string) {
  const codes: Record<string, string> = {
    Uzbekistan: "uz",
    Russia: "ru",
    Azerbaijan: "az",
    Albania: "al",
    Belarus: "by",
    Bulgaria: "bg",
    "Bosnia and Herzegovina": "ba",
    Germany: "de",
    Georgia: "ge",
    Kazakhstan: "kz",
    Kyrgyzstan: "kg",
    Kosovo: "xk",
    Macedonia: "mk",
    Moldova: "md",
    Mongolia: "mn",
    Serbia: "rs",
    Turkmenistan: "tm",
    Turkey: "tr",
    Ukraine: "ua",
    Switzerland: "ch",
  };
  return codes[country ?? ""];
}
