"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/filters/FilterBar";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import MarketShareCard from "@/components/cards/MarketShareCard";
import TopBrandsTable from "@/components/tables/TopBrandsTable";

export default function DashboardPage() {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/dashboard')
      .then(res => res.json())
      .then(setData)
      .catch(err => console.error(err));
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-10">
        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Market Overview
          </h1>
        </div>

        <FilterBar />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="TOTAL MARKET VALUE" value="$854.5M" change="-13.1%" trend="down" />
          <KPICard title="TOTAL UNITS" value="364.8M" change="-4.4%" trend="down" />
          <KPICard title="NOBEL SALES" value="$19.24M" change="+29.3%" trend="up" />
          <KPICard title="MARKET SHARE" value="1.96%" change="+0.22pp" trend="up" />
        </div>

        <SalesLineChart />
        <MarketShareCard />
        <TopBrandsTable />
      </div>
    </DashboardLayout>
  );
}