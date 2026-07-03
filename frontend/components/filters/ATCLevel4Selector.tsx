"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = [
  { value: "all", label: "All ATC Level 4" },
  { value: "a01aa", label: "A01AA - Caries Prophylactic Agents" },
  { value: "j01ca", label: "J01CA - Penicillins with Extended Spectrum" },
];

export default function ATCLevel4Selector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">ATC Level 4</span>
      
      <Select
        options={options}
        defaultValue={options[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search ATC4..."
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