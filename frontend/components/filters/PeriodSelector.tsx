"use client";

import { useState } from "react";

const periodTypes = ["MAT", "YTD", "QTR", "MTH", "FULL YEAR"];
const years = [2026, 2025, 2024, 2023];
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];

export default function PeriodSelector() {
  const [periodType, setPeriodType] = useState("MAT");
  const [year, setYear] = useState(2026);
  const [month, setMonth] = useState("June");
  const [quarter, setQuarter] = useState("Q1");

  const showMonth = periodType === "MTH" || periodType === "MAT" || periodType === "YTD";
  const showQuarter = periodType === "QTR";

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-sm font-medium text-slate-600 whitespace-nowrap">Period</span>

      <select 
        value={periodType}
        onChange={(e) => setPeriodType(e.target.value)}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
      >
        {periodTypes.map(p => <option key={p} value={p}>{p}</option>)}
      </select>

      {showQuarter && (
        <select 
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
        >
          {quarters.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
      )}

      {showMonth && (
        <select 
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
        >
          {months.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
      )}

      <select 
        value={year}
        onChange={(e) => setYear(Number(e.target.value))}
        className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium"
      >
        {years.map(y => <option key={y} value={y}>{y}</option>)}
      </select>

      <span className="text-xs text-slate-500 ml-2 font-medium">
        {periodType} {showQuarter ? quarter : showMonth ? month : ''} {year}
      </span>
    </div>
  );
}