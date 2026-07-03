"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const companyOptions = [
  { value: "all", label: "All Companies" },
  { value: "nobel", label: "Nobel" },
  { value: "santo", label: "Santo" },
  { value: "berlin_chemie", label: "Berlin Chemie" },
  { value: "world_medicine", label: "World Medicine" },
  { value: "kusum", label: "Kusum" },
];

export default function CompanySelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Company</span>
      
      <Select
        options={companyOptions}
        defaultValue={companyOptions[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        isClearable={true}
        placeholder="Search company..."
        styles={{
          control: (base) => ({
            ...base,
            borderRadius: '16px',
            borderColor: '#e2e8f0',
            minHeight: '42px',
            boxShadow: 'none',
          }),
          menu: (base) => ({
            ...base,
            borderRadius: '12px',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
          }),
        }}
      />
    </div>
  );
}