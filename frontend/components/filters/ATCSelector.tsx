"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = [
  { value: "all", label: "All ATC" },
  { value: "a01", label: "A01 - Alimentary Tract" },
  { value: "c01", label: "C01 - Cardiac Therapy" },
  { value: "j01", label: "J01 - Antibacterials" },
  { value: "n02", label: "N02 - Analgesics" },
  { value: "r05", label: "R05 - Cough Preparations" },
];

export default function ATCSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">ATC</span>
      
      <Select
        options={options}
        defaultValue={options[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search ATC..."
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