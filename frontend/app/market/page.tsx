import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/filters/FilterBar";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import MarketShareCard from "@/components/cards/MarketShareCard";
import TopBrandsTable from "@/components/tables/TopBrandsTable";

export default function MarketPage() {
  return (
    <DashboardLayout>
      <div className="space-y-10">

        <div>
          <h1 className="text-5xl font-semibold tracking-tight text-slate-900">
            Market Intelligence
          </h1>
          <p className="mt-3 text-xl text-slate-500">
            Аналитика фармацевтического рынка
          </p>
        </div>

        <FilterBar />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <KPICard title="TOTAL MARKET VALUE" value="$854.5M" change="-13.1%" trend="down" />
          <KPICard title="TOTAL UNITS" value="364.8M" change="-4.4%" trend="down" />
          <KPICard title="TOP COMPANY SALES" value="$19.24M" change="+29.3%" trend="up" />
          <KPICard title="MARKET SHARE" value="1.96%" change="+0.22pp" trend="up" />
        </div>

        <SalesLineChart />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <MarketShareCard />
          <TopBrandsTable />
        </div>

      </div>
    </DashboardLayout>
  );
}