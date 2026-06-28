"use client";

const atc = [
  "All ATC",
  "A - Alimentary tract",
  "B - Blood",
  "C - Cardiovascular",
  "D - Dermatology",
  "G - Genitourinary",
  "J - Anti-infectives",
  "M - Musculoskeletal",
  "N - Nervous System",
  "R - Respiratory",
];

export default function ATCSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        ATC
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">
        {atc.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
    </div>
  );
}