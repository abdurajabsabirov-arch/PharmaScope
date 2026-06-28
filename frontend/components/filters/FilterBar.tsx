"use client";

import YearSelector from "./YearSelector";
import PeriodSelector from "./PeriodSelector";
import MarketSelector from "./MarketSelector";
import CompanySelector from "./CompanySelector";
import BrandSelector from "./BrandSelector";
import MoleculeSelector from "./MoleculeSelector";
import SKUSelector from "./SKUSelector";
import ATCSelector from "./ATCSelector";
import RegionSelector from "./RegionSelector";
import BrickSelector from "./BrickSelector";
import ChannelSelector from "./ChannelSelector";
import DistributorSelector from "./DistributorSelector";
import ManagerSelector from "./ManagerSelector";
import ProductManagerSelector from "./ProductManagerSelector";
import PriceTypeSelector from "./PriceTypeSelector";
import FilterResetButton from "./FilterResetButton";

const metrics = ["Value", "Units", "Share", "Growth"];

export default function FilterBar() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-7">

        <YearSelector />
        <PeriodSelector />
        <MarketSelector />
        <CompanySelector />
        <BrandSelector />
        <MoleculeSelector />
        <SKUSelector />

        <ATCSelector />
        <RegionSelector />
        <BrickSelector />
        <ChannelSelector />
        <DistributorSelector />
        <ManagerSelector />
        <ProductManagerSelector />

        <PriceTypeSelector />

      </div>

      <div className="mt-6 flex justify-end">

        <div className="flex items-center gap-2">

          {metrics.map((item) => (
            <button
              key={item}
              className="rounded-xl border border-slate-300 px-5 py-2 text-sm font-medium transition hover:bg-blue-600 hover:text-white"
            >
              {item}
            </button>
          ))}

          <FilterResetButton />

        </div>

      </div>

    </div>
  );
}