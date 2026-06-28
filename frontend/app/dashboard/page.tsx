import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/filters/FilterBar";
import KPICard from "@/components/cards/KPICard";
import SalesLineChart from "@/components/charts/SalesLineChart";
import RegionSalesChart from "@/components/charts/RegionSalesChart";
import MarketShareCard from "@/components/cards/MarketShareCard";
import AIInsightsCard from "@/components/cards/AIInsightsCard";
import TopBrandsTable from "@/components/tables/TopBrandsTable";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold text-slate-900">
            Executive Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            AI-powered Pharmaceutical Intelligence Platform
          </p>

        </div>

        <FilterBar />

        <div className="grid grid-cols-4 gap-6">

          <KPICard
            title="Market Size"
            value="$124.6M"
            change="+12.4%"
          />

          <KPICard
            title="Sales"
            value="$18.3M"
            change="+8.2%"
          />

          <KPICard
            title="PPG"
            value="+14.7%"
            change="+2.3%"
          />

          <KPICard
            title="Evolution Index"
            value="118.4"
            change="+5.1%"
          />

        </div>

        <SalesLineChart />

        <div className="grid grid-cols-2 gap-6">

          <MarketShareCard />

          <RegionSalesChart />

        </div>

        <TopBrandsTable />

        <AIInsightsCard />

      </div>
    </DashboardLayout>
  );
}