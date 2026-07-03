"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = [
  { value: "all", label: "All SKU" },
  { value: "sku001", label: "SKU-001" },
  { value: "sku002", label: "SKU-002" },
];

export default function SKUSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">SKU</span>
      
      <Select
        options={options}
        defaultValue={options[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search SKU..."
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