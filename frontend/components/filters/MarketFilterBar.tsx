"use client";

import { DashboardData, DashboardFilters } from "@/app/dashboard/lib/api";
import MultiSelectDropdown, { type FilterOption } from "./MultiSelectDropdown";

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
  { key: "channel", label: "RX/OTC/FS" },
  { key: "segment", label: "Segment" },
  { key: "form", label: "Form" },
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
  MONTH: "Month",
  MONTHS: "Multiple Months",
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
  const defaults = periodOptions?.default;
  const periodType = filters.period_type ?? defaults?.period_type ?? "MONTH";
  const selectedMonths = (filters.selected_months ?? defaults?.selected_months ?? "")
    .split(",")
    .filter(Boolean);
  const selectedYears = (filters.selected_years ?? filters.year ?? defaults?.selected_years ?? defaults?.year ?? "")
    .split(",")
    .filter(Boolean);
  const allMonthValues = (periodOptions?.months ?? Array.from({ length: 12 }, (_, index) => ({ value: `${index + 1}`.padStart(2, "0"), label: "" })))
    .map((month) => month.value);

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

  const setSelectedYears = (values: string[]) => {
    const nextValues = values.length ? values : [defaults?.year ?? ""].filter(Boolean);
    onChange({
      ...filters,
      year: nextValues[0],
      selected_years: nextValues.join(","),
    });
  };

  const updatePeriod = (key: keyof DashboardFilters, value: string) => {
    const next = { ...filters };
    if (value) {
      next[key] = value;
    } else {
      delete next[key];
    }
    onChange(next);
  };

  const updateMonthSelection = (values: string[]) => {
    const uniqueValues = [...new Set(values)].sort();
    const next: DashboardFilters = {
      ...filters,
      year: filters.year ?? defaults?.year,
      selected_years: filters.selected_years ?? defaults?.selected_years ?? defaults?.year,
    };

    if (uniqueValues.length === 0) {
      next.period_type = "MONTH";
      next.month = "All";
      delete next.selected_months;
      delete next.quarter;
      onChange(next);
      return;
    }

    if (uniqueValues.length === 1) {
      next.period_type = "MONTH";
      next.month = uniqueValues[0] ?? defaults?.month ?? "";
      delete next.selected_months;
      delete next.quarter;
      onChange(next);
      return;
    }

    next.period_type = "MONTHS";
    next.selected_months = uniqueValues.join(",");
    delete next.month;
    delete next.quarter;
    onChange(next);
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

  return (
    <div id="market-filters" className="glass-panel filter-panel scroll-mt-8 rounded-lg p-3">
      <div className="flex flex-wrap gap-2">
        <MultiSelectDropdown
          label="Period Type"
          options={(periodOptions?.period_types ?? ["MONTH", "MONTHS", "YTD", "QTR", "MAT", "FULL_YEAR"]).map((type) => ({
            value: type,
            label: labelByPeriod[type] ?? type,
          }))}
          selectedValues={[periodType].filter(Boolean)}
          onCommit={(values) => changePeriodType(values[0] ?? "MONTH")}
          disabled={disabled}
          single
        />

        <MultiSelectDropdown
          label="Year"
          options={(periodOptions?.years ?? []).map((year) => ({ value: year, label: year }))}
          selectedValues={selectedYears}
          onCommit={(values) => setSelectedYears(values)}
          disabled={disabled}
          minWidthClass="min-w-[104px]"
        />

        {(periodType === "MONTH" || periodType === "YTD" || periodType === "MAT") && (
          <MultiSelectDropdown
            label={periodType === "YTD" ? "Through" : "Month"}
            options={(periodOptions?.months ?? []).map((month) => ({ value: month.value, label: month.label }))}
            selectedValues={periodType === "MONTH"
              ? (filters.month === "All"
                ? []
                : ([filters.month ?? defaults?.month ?? "", ...selectedMonths].filter(Boolean).slice(0, Math.max(1, selectedMonths.length || 1))))
              : [filters.month ?? defaults?.month ?? ""].filter(Boolean)}
            onCommit={(values) => periodType === "MONTH"
              ? updateMonthSelection(values)
              : updatePeriod("month", values[0] ?? defaults?.month ?? "")}
            disabled={disabled}
            single={periodType !== "MONTH"}
            minWidthClass="min-w-[104px]"
            allLabel={periodType === "MONTH" ? "All available months" : "All"}
          />
        )}

        {periodType === "QTR" && (
          <MultiSelectDropdown
            label="Quarter"
            options={(periodOptions?.quarters ?? ["Q1", "Q2", "Q3", "Q4"]).map((quarter) => ({ value: quarter, label: quarter }))}
            selectedValues={[filters.quarter ?? defaults?.quarter ?? "Q1"].filter(Boolean)}
            onCommit={(values) => updatePeriod("quarter", values[0] ?? defaults?.quarter ?? "Q1")}
            disabled={disabled}
            single
            minWidthClass="min-w-[104px]"
          />
        )}

        {periodType === "MONTHS" && (
          <MultiSelectDropdown
            label="Months"
            options={(periodOptions?.months ?? []).map((month) => ({ value: month.value, label: month.label }))}
            selectedValues={selectedMonths}
            onCommit={(values) => updatePeriod("selected_months", (values.length ? values : allMonthValues).sort().join(","))}
            disabled={disabled}
            minWidthClass="min-w-[112px]"
            allLabel="All available months"
          />
        )}

        {dimensionFields.map((field) => {
          const values = options?.[field.key as keyof DashboardData["filter_options"]] ?? [];
          const selected = splitValues(filters[field.key]);
          const fieldOptions: FilterOption[] = values.map((value) => ({ value, label: value }));

          return (
            <MultiSelectDropdown
              key={field.key}
              label={field.label}
              options={fieldOptions}
              selectedValues={selected}
              onCommit={(values) => values.length ? setFilterValues(field.key, values) : clearFilter(field.key)}
              disabled={disabled || values.length === 0}
              minWidthClass="min-w-[112px]"
            />
          );
        })}
      </div>
    </div>
  );
}
