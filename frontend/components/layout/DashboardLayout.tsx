"use client";

import { ReactNode } from "react";

import Header from "./Header";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  country?: string;
}

export default function DashboardLayout({ children, country }: DashboardLayoutProps) {
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
