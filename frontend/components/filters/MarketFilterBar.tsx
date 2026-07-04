"use client";

import { useState } from "react";
import { DashboardData, DashboardFilters } from "@/app/dashboard/lib/api";

type MarketFilterBarProps = {
  filters: DashboardFilters;
  options?: DashboardData["filter_options"];
  periodOptions?: DashboardData["period_options"];
  onChange: (filters: DashboardFilters) => void;
  disabled?: boolean;
};

const MULTI_VALUE_SEPARATOR = "|||";

const dimensionFields: Array<{ key: keyof DashboardFilters; label: string }> = [
  { key: "market", label: "Market" },
  { key: "company", label: "Company" },
  { key: "brand", label: "Brand" },
  { key: "sku", label: "SKU" },
  { key: "molecule", label: "Molecule" },
  { key: "atc1", label: "ATC 1" },
  { key: "atc2", label: "ATC 2" },
  { key: "atc3", label: "ATC 3" },
  { key: "atc4", label: "ATC 4" },
  { key: "region", label: "Region" },
];

const hiddenDependencyFields: Record<string, Array<keyof DashboardFilters>> = {
  company: ["brand", "sku"],
  brand: ["sku"],
  atc1: ["atc2", "atc3", "atc4"],
  atc2: ["atc3", "atc4"],
  atc3: ["atc4"],
};

const labelByPeriod: Record<string, string> = {
  MONTH: "Single Month",
  MONTHS: "Months",
  YTD: "YTD",
  QTR: "Quarter",
  MAT: "MAT",
  FULL_YEAR: "Full Year",
};

function splitValues(value?: string) {
  return (value ?? "").split(MULTI_VALUE_SEPARATOR).filter(Boolean);
}

function serializeValues(values: string[]) {
  return values.filter(Boolean).join(MULTI_VALUE_SEPARATOR);
}

export default function MarketFilterBar({
  filters,
  options,
  periodOptions,
  onChange,
  disabled = false,
}: MarketFilterBarProps) {
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [isYearOpen, setIsYearOpen] = useState(false);
  const defaults = periodOptions?.default;
  const periodType = filters.period_type ?? defaults?.period_type ?? "MONTH";
  const selectedMonths = (filters.selected_months ?? defaults?.selected_months ?? "")
    .split(",")
    .filter(Boolean);
  const selectedYears = (filters.selected_years ?? filters.year ?? defaults?.selected_years ?? defaults?.year ?? "")
    .split(",")
    .filter(Boolean);

  const setFilterValues = (key: keyof DashboardFilters, values: string[]) => {
    const next = { ...filters };
    const serialized = serializeValues([...new Set(values)]);

    if (serialized) {
      next[key] = serialized;
    } else {
      delete next[key];
    }

    hiddenDependencyFields[String(key)]?.forEach((field) => {
      delete next[field];
    });

    onChange(next);
  };

  const clearFilter = (key: keyof DashboardFilters) => {
    const next = { ...filters };
    delete next[key];

    hiddenDependencyFields[String(key)]?.forEach((field) => {
      delete next[field];
    });

    onChange(next);
  };

  const addFilterValue = (key: keyof DashboardFilters, value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setFilterValues(key, [...splitValues(filters[key]), cleanValue]);
    setDrafts((current) => ({ ...current, [key]: "" }));
  };

  const updatePeriod = (key: keyof DashboardFilters, value: string) => {
    onChange({ ...filters, [key]: value });
  };

  const setSelectedYears = (values: string[]) => {
    const nextValues = values.length ? values : [defaults?.year ?? ""].filter(Boolean);
    onChange({
      ...filters,
      year: nextValues[0],
      selected_years: nextValues.join(","),
    });
  };

  const changePeriodType = (value: string) => {
    const next: DashboardFilters = {
      ...filters,
      period_type: value,
      year: filters.year ?? defaults?.year,
      selected_years: filters.selected_years ?? defaults?.selected_years ?? defaults?.year,
    };

    if (value === "MONTH" || value === "YTD" || value === "MAT") {
      next.month = filters.month ?? defaults?.month;
      delete next.selected_months;
      delete next.quarter;
    } else if (value === "MONTHS") {
      next.selected_months = filters.selected_months ?? defaults?.selected_months;
      delete next.month;
      delete next.quarter;
    } else if (value === "QTR") {
      next.quarter = filters.quarter ?? defaults?.quarter;
      delete next.month;
      delete next.selected_months;
    } else {
      delete next.month;
      delete next.selected_months;
      delete next.quarter;
    }

    onChange(next);
  };

  const toggleMonth = (month: string) => {
    const nextMonths = selectedMonths.includes(month)
      ? selectedMonths.filter((value) => value !== month)
      : [...selectedMonths, month].sort();

    updatePeriod("selected_months", nextMonths.join(","));
  };

  return (
    <div id="market-filters" className="glass-panel scroll-mt-8 rounded-lg p-3">
      <div className="flex flex-wrap gap-2">
        <label className="flex min-w-[118px] flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Period Type</span>
          <select
            value={periodType}
            onChange={(event) => changePeriodType(event.target.value)}
            disabled={disabled}
            className="h-9 rounded-lg border border-transparent bg-transparent text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
          >
            {(periodOptions?.period_types ?? ["MONTH", "MONTHS", "YTD", "QTR", "MAT", "FULL_YEAR"]).map((type) => (
              <option key={type} value={type}>
                {labelByPeriod[type] ?? type}
              </option>
            ))}
          </select>
        </label>

        <label className="flex min-w-[104px] flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm">
          <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Year</span>
          <button
            type="button"
            onClick={() => setIsYearOpen((current) => !current)}
            disabled={disabled}
            className="h-9 rounded-lg border border-transparent bg-transparent text-left text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-400"
          >
            {selectedYears.length > 1 ? `${selectedYears.length} years` : selectedYears[0] ?? "All"}
          </button>
          {isYearOpen && (
            <div className="mt-2 grid gap-1 rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
              {(periodOptions?.years ?? []).map((year) => (
                <label key={year} className="flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                  <input
                    type="checkbox"
                    checked={selectedYears.includes(year)}
                    onChange={() => {
                      const nextYears = selectedYears.includes(year)
                        ? selectedYears.filter((value) => value !== year)
                        : [...selectedYears, year].sort().reverse();
                      setSelectedYears(nextYears);
                    }}
                    disabled={disabled}
                  />
                  <span>{year}</span>
                </label>
              ))}
            </div>
          )}
        </label>

        {(periodType === "MONTH" || periodType === "YTD" || periodType === "MAT") && (
          <label className="flex min-w-[104px] flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              {periodType === "YTD" ? "Through" : "Month"}
            </span>
            <select
              value={filters.month ?? defaults?.month ?? ""}
              onChange={(event) => updatePeriod("month", event.target.value)}
              disabled={disabled}
              className="h-9 rounded-lg border border-transparent bg-transparent text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
            >
              {(periodOptions?.months ?? []).map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </label>
        )}

        {periodType === "QTR" && (
          <label className="flex min-w-[104px] flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Quarter</span>
            <select
              value={filters.quarter ?? defaults?.quarter ?? "Q1"}
              onChange={(event) => updatePeriod("quarter", event.target.value)}
              disabled={disabled}
              className="h-9 rounded-lg border border-transparent bg-transparent text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
            >
              {(periodOptions?.quarters ?? ["Q1", "Q2", "Q3", "Q4"]).map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>
        )}

        {dimensionFields.map((field) => {
          const values = options?.[field.key as keyof DashboardData["filter_options"]] ?? [];
          const selected = splitValues(filters[field.key]);
          const listId = `market-filter-${field.key}`;

          return (
            <div
              key={field.key}
              className="flex min-w-[112px] flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{field.label}</span>
                {selected.length > 0 && (
                  <button
                    type="button"
                    onClick={() => clearFilter(field.key)}
                    disabled={disabled}
                    className="rounded-full px-1.5 text-xs font-bold text-slate-400 hover:bg-slate-100 hover:text-rose-600 disabled:cursor-not-allowed"
                    aria-label={`Clear ${field.label}`}
                    title={`Clear ${field.label}`}
                  >
                    x
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  value={drafts[field.key] ?? ""}
                  list={listId}
                  onChange={(event) => setDrafts((current) => ({ ...current, [field.key]: event.target.value }))}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addFilterValue(field.key, event.currentTarget.value);
                    }
                  }}
                  disabled={disabled || values.length === 0}
                  placeholder={selected.length ? selected.length === 1 ? selected[0] : `${selected.length} selected` : "All"}
                  className="h-9 w-full rounded-lg border border-transparent bg-transparent pr-2 text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-900 focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-400"
                />
              </div>
              <datalist id={listId}>
                {values.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
            </div>
          );
        })}
      </div>

        {periodType === "MONTHS" && (
        <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
          {(periodOptions?.months ?? []).map((month) => (
            <label
              key={month.value}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700"
            >
              <input
                type="checkbox"
                checked={selectedMonths.includes(month.value)}
                onChange={() => toggleMonth(month.value)}
                disabled={disabled}
              />
              <span>{month.label}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
