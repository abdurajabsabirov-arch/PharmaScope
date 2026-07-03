"use client";

import dynamic from 'next/dynamic';

const Select = dynamic(() => import('react-select'), { ssr: false });

const moleculeOptions = [
  { value: "all", label: "All Molecules" },
  { value: "paracetamol", label: "Paracetamol" },
  { value: "ibuprofen", label: "Ibuprofen" },
  // добавь свои
];

export default function MoleculeSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Molecule</span>
      
      <Select
        options={moleculeOptions}
        defaultValue={moleculeOptions[0]}
        className="w-52"
        classNamePrefix="select"
        isSearchable={true}
        placeholder="Search molecule..."
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