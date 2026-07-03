"use client";

import PeriodSelector from "./PeriodSelector";
import MarketSelector from "./MarketSelector";
import CompanySelector from "./CompanySelector";
import BrandSelector from "./BrandSelector";
import MoleculeSelector from "./MoleculeSelector";
import SKUSelector from "./SKUSelector";
import ATCSelector from "./ATCSelector";
import ATCLevel3Selector from "./ATCLevel3Selector";
import ATCLevel4Selector from "./ATCLevel4Selector";
import RegionSelector from "./RegionSelector";
import BrickSelector from "./BrickSelector";
import ChannelSelector from "./ChannelSelector";
import FilterResetButton from "./FilterResetButton";

export default function FilterBar() {
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">

      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <FilterResetButton />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        <PeriodSelector />
        <MarketSelector />
        <CompanySelector />
        <BrandSelector />
        <MoleculeSelector />
        <SKUSelector />
        <ATCSelector />
        <ATCLevel3Selector />
        <ATCLevel4Selector />
        <RegionSelector />
        <BrickSelector />
        <ChannelSelector />
      </div>

    </div>
  );
}