"use client";

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Check, ChevronDown } from "lucide-react";

export type FilterOption = {
  value: string;
  label: string;
};

type MultiSelectDropdownProps = {
  label: string;
  options: FilterOption[];
  selectedValues: string[];
  onCommit: (values: string[]) => void;
  disabled?: boolean;
  single?: boolean;
  minWidthClass?: string;
  allLabel?: string;
};

export default function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onCommit,
  disabled = false,
  single = false,
  minWidthClass = "min-w-[118px]",
  allLabel = "All",
}: MultiSelectDropdownProps) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<string[]>(selectedValues);
  const [query, setQuery] = useState("");
  const [menuRect, setMenuRect] = useState({ left: 0, top: 0, width: 320 });
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setDraft(selectedValues);
  }, [selectedValues.join("|||")]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !menuRef.current?.contains(target)) {
        setOpen(false);
        setQuery("");
        setDraft(selectedValues);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [selectedValues]);

  useLayoutEffect(() => {
    if (!open) return;

    const updatePosition = () => {
      const rect = rootRef.current?.getBoundingClientRect();
      if (!rect) return;
      const menuWidth = Math.max(320, rect.width);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - menuWidth - 12);
      const preferredTop = rect.bottom + 8;
      const top = preferredTop + 300 > window.innerHeight
        ? Math.max(12, rect.top - 300)
        : preferredTop;
      setMenuRect({ left, top, width: menuWidth });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  const visibleOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return options;
    return options.filter((option) => option.label.toLowerCase().includes(normalized));
  }, [options, query]);

  const summary = useMemo(() => {
    if (!selectedValues.length) return allLabel;
    if (selectedValues.length === 1) {
      return options.find((option) => option.value === selectedValues[0])?.label ?? selectedValues[0];
    }
    return `${selectedValues.length} selected`;
  }, [allLabel, options, selectedValues]);

  const toggleValue = (value: string) => {
    setDraft((current) => {
      if (single) return current.includes(value) ? [] : [value];
      return current.includes(value)
        ? current.filter((item) => item !== value)
        : [...current, value];
    });
  };

  const commit = () => {
    onCommit(draft);
    setOpen(false);
    setQuery("");
  };

  return (
    <div
      ref={rootRef}
      className={`relative flex ${minWidthClass} ${open ? "z-[90]" : "z-0"} flex-1 flex-col gap-1.5 rounded-md border border-slate-100 bg-white px-3 py-2 shadow-sm`}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          commit();
        }
        if (event.key === "Escape") {
          setOpen(false);
          setQuery("");
          setDraft(selectedValues);
        }
      }}
    >
      <span className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <button
        type="button"
        onClick={() => {
          if (disabled) return;
          setDraft(selectedValues);
          setOpen((current) => !current);
        }}
        disabled={disabled}
        className="flex h-9 items-center justify-between gap-2 rounded-lg border border-transparent bg-transparent text-left text-sm font-semibold text-slate-900 outline-none focus:border-blue-500 disabled:cursor-not-allowed disabled:text-slate-400"
        title={summary}
      >
        <span className="truncate">{summary}</span>
        <ChevronDown size={15} className={`shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && mounted && createPortal(
        <div
          ref={menuRef}
          className="fixed z-[9999] rounded-xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/20"
          style={{ left: menuRect.left, top: menuRect.top, width: menuRect.width }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              commit();
            }
            if (event.key === "Escape") {
              setOpen(false);
              setQuery("");
              setDraft(selectedValues);
            }
          }}
        >
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search, then choose"
            className="mb-2 h-9 w-full rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-900 outline-none focus:border-blue-500"
            autoFocus
          />
          <div className="dropdown-scrollbar max-h-52 space-y-1 overflow-y-auto pr-1">
            <label className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
              <input
                type="checkbox"
                checked={draft.length === 0}
                onChange={() => setDraft([])}
              />
              <span>{allLabel}</span>
            </label>
            {visibleOptions.map((option) => (
              <label
                key={option.value}
                className="flex cursor-pointer items-center gap-2 rounded-lg px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-blue-50"
                title={option.label}
              >
                <input
                  type="checkbox"
                  checked={draft.includes(option.value)}
                  onChange={() => toggleValue(option.value)}
                />
                <span className="min-w-0 flex-1 truncate">{option.label}</span>
                {draft.includes(option.value) && <Check size={14} className="text-blue-600" />}
              </label>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-500">
            <span>Press Enter to apply</span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  onCommit([]);
                  setDraft([]);
                  setQuery("");
                  setOpen(false);
                }}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
              <button type="button" onClick={commit} className="rounded-lg bg-blue-600 px-3 py-1.5 text-white">
                Apply
              </button>
            </div>
          </div>
        </div>,
        document.body,
      )}
    </div>
  );
}
