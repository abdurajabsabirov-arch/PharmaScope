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
  { key: "atc1", label: "ATC1" },
  { key: "atc2", label: "ATC2" },
  { key: "atc3", label: "ATC3" },
  { key: "atc4", label: "ATC4" },
  { key: "region", label: "Region" },
];

const labelByPeriod: Record<string, string> = {
  MONTH: "Month",
  MONTHS: "Months",
  YTD: "Year to Date",
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

    if (key === "company") {
      delete next.brand;
      delete next.sku;
    }
    if (key === "brand") {
      delete next.sku;
    }
    if (key === "atc1") {
      delete next.atc2;
      delete next.atc3;
      delete next.atc4;
    }
    if (key === "atc2") {
      delete next.atc3;
      delete next.atc4;
    }
    if (key === "atc3") {
      delete next.atc4;
    }

    onChange(next);
  };

  const addFilterValue = (key: keyof DashboardFilters, value: string) => {
    const cleanValue = value.trim();
    if (!cleanValue) return;
    setFilterValues(key, [...splitValues(filters[key]), cleanValue]);
    setDrafts((current) => ({ ...current, [key]: "" }));
  };

  const removeFilterValue = (key: keyof DashboardFilters, value: string) => {
    setFilterValues(
      key,
      splitValues(filters[key]).filter((item) => item !== value),
    );
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
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-slate-900">Filters</h3>
        <button
          type="button"
          onClick={() => onChange({})}
          disabled={disabled || Object.keys(filters).length === 0}
          className="rounded-xl bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset Filters
        </button>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-5">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">Period</span>
          <select
            value={periodType}
            onChange={(event) => changePeriodType(event.target.value)}
            disabled={disabled}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600"
          >
            {(periodOptions?.period_types ?? ["MONTH", "MONTHS", "YTD", "QTR", "MAT", "FULL_YEAR"]).map((type) => (
              <option key={type} value={type}>
                {labelByPeriod[type] ?? type}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-600">Year</span>
          <select
            multiple
            value={selectedYears}
            onChange={(event) => setSelectedYears(Array.from(event.currentTarget.selectedOptions).map((option) => option.value))}
            disabled={disabled}
            className="min-h-24 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600"
          >
            {(periodOptions?.years ?? []).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        {(periodType === "MONTH" || periodType === "YTD" || periodType === "MAT") && (
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">
              {periodType === "YTD" ? "Through Month" : "Month"}
            </span>
            <select
              value={filters.month ?? defaults?.month ?? ""}
              onChange={(event) => updatePeriod("month", event.target.value)}
              disabled={disabled}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600"
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
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium text-slate-600">Quarter</span>
            <select
              value={filters.quarter ?? defaults?.quarter ?? "Q1"}
              onChange={(event) => updatePeriod("quarter", event.target.value)}
              disabled={disabled}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600"
            >
              {(periodOptions?.quarters ?? ["Q1", "Q2", "Q3", "Q4"]).map((quarter) => (
                <option key={quarter} value={quarter}>
                  {quarter}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      {periodType === "MONTHS" && (
        <div className="mb-6 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-6">
          {(periodOptions?.months ?? []).map((month) => (
            <label key={month.value} className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm">
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

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-5">
        {dimensionFields.map((field) => {
          const values = options?.[field.key as keyof DashboardData["filter_options"]] ?? [];
          const selected = splitValues(filters[field.key]);
          const listId = `market-filter-${field.key}`;

          return (
            <div key={field.key} className="flex flex-col gap-2">
              <span className="text-sm font-medium text-slate-600">{field.label}</span>
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
                placeholder={`Type ${field.label}, Enter`}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3 text-sm font-medium shadow-sm outline-none transition hover:border-blue-500 focus:border-blue-600 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
              <datalist id={listId}>
                {values.map((value) => (
                  <option key={value} value={value} />
                ))}
              </datalist>
              <select
                multiple
                value={selected}
                onChange={(event) => setFilterValues(field.key, Array.from(event.currentTarget.selectedOptions).map((option) => option.value))}
                disabled={disabled || values.length === 0}
                className="min-h-24 rounded-xl border border-slate-200 bg-white px-2 py-2 text-xs text-slate-700 outline-none focus:border-blue-600 disabled:bg-slate-50"
              >
                {values.slice(0, 250).map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
              {selected.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {selected.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => removeFilterValue(field.key, value)}
                      className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700 hover:bg-slate-200"
                    >
                      {value} x
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
