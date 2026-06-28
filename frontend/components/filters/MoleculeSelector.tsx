"use client";

const molecules = [
  "All Molecules",
  "Pantoprazole",
  "Paracetamol",
  "Loratadine",
  "Dexketoprofen",
  "Ursodeoxycholic Acid",
  "Passiflora Extract",
  "Benzydamine",
];

export default function MoleculeSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        Molecule
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {molecules.map((molecule) => (
          <option key={molecule} value={molecule}>
            {molecule}
          </option>
        ))}
      </select>
    </div>
  );
}