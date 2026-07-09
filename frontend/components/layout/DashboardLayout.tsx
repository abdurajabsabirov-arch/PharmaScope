"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import Header from "./Header";
import Sidebar from "./Sidebar";
import { canAccessRoute, readCurrentUser } from "@/lib/demoAuth";

interface DashboardLayoutProps {
  children: ReactNode;
  country?: string;
}

export default function DashboardLayout({ children, country }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [authState, setAuthState] = useState<"checking" | "allowed" | "denied">("checking");

  useEffect(() => {
    const user = readCurrentUser();
    if (!user) {
      setAuthState("denied");
      router.replace("/");
      return;
    }
    if (!canAccessRoute(user, pathname)) {
      setAuthState("denied");
      router.replace("/market");
      return;
    }
    setAuthState("allowed");
  }, [pathname, router]);

  if (authState !== "allowed") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm font-semibold text-slate-600">
        {authState === "denied"
          ? "Access denied. Redirecting..."
          : "Checking access..."}
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#f6f8fc]">
      <Sidebar />

      <div className="flex flex-1 flex-col overflow-hidden">
        <Header country={country} />

        <main className="flex-1 overflow-auto bg-[#f6f8fc] p-8">
          <div className="mx-auto max-w-[1600px]">{children}</div>
        </main>
      </div>
    </div>
  );
}
