"use client";

import { ReactNode } from "react";

import Sidebar from "./Sidebar";
import Header from "./Header";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">

      {/* Тёмный Sidebar */}
      <Sidebar />

      {/* Основная область */}
      <div className="flex flex-1 flex-col overflow-hidden">

        <Header />

        {/* Контент */}
        <main className="flex-1 overflow-auto p-10 bg-[#F8FAFC]">
          <div className="max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}