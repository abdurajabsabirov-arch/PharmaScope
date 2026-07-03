"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = [
  { value: "all", label: "All ATC Level 3" },
  { value: "a01a", label: "A01A - Stomatological Preparations" },
  { value: "c01a", label: "C01A - Cardiac Glycosides" },
  { value: "j01c", label: "J01C - Beta-Lactam Antibacterials" },
];

export default function ATCLevel3Selector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">ATC Level 3</span>
      
      <Select
        options={options}
        defaultValue={options[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search ATC3..."
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