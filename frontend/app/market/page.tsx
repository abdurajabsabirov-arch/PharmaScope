import DashboardLayout from "@/components/layout/DashboardLayout";
import FilterBar from "@/components/filters/FilterBar";
import MarketKPIs from "@/components/market/MarketKPIs";
import MarketTrendChart from "@/components/market/MarketTrendChart";
import MarketShareTreemap from "@/components/market/MarketShareTreemap";
import TopCompaniesTable from "@/components/market/TopCompaniesTable";
import TopBrandsMarketTable from "@/components/market/TopBrandsMarketTable";

export default function MarketPage() {
  return (
    <DashboardLayout>

      <div className="space-y-8">

        <div>

          <h1 className="text-4xl font-bold">
            Market Intelligence
          </h1>

          <p className="mt-2 text-slate-500">
            Pharmaceutical Market Analytics
          </p>

        </div>

        <FilterBar />

        <MarketKPIs />

        <MarketTrendChart />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

          <MarketShareTreemap />

          <TopCompaniesTable />

        </div>

        <TopBrandsMarketTable />

      </div>

    </DashboardLayout>
  );
}