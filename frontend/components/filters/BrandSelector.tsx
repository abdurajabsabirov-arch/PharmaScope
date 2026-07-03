"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const brandOptions = [
  { value: "all", label: "All Brands" },
  { value: "tylol_hot", label: "Tylol Hot" },
  { value: "anzibel", label: "Anzibel" },
  { value: "tractus", label: "Tractus" },
  { value: "pantap", label: "PanTap" },
  { value: "ursopat", label: "UrsoPat" },
];

export default function BrandSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Brand</span>
      
      <Select
        options={brandOptions}
        defaultValue={brandOptions[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search brand..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '16px',
            borderColor: '#e2e8f0',
            minHeight: '42px',
          }),
        }}
      />
    </div>
  );
}