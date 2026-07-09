from __future__ import annotations

from datetime import datetime, timedelta
import json
from pathlib import Path
import re
from threading import Lock
from typing import Any
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import pandas as pd

from app.services.file_registry import UPLOAD_DIR, get_active_upload_entry


CACHE_FILE = UPLOAD_DIR / ".performance_frame_cache.pkl"
CACHE_META_FILE = UPLOAD_DIR / ".performance_frame_cache.json"

PERFORMANCE_USECOLS = [0, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 16, 17, 24, 25]
PERFORMANCE_COLUMNS = [
    "period",
    "brand",
    "sku",
    "group",
    "tylolfen",
    "type",
    "country",
    "region",
    "city",
    "supervisor",
    "marketing_manager",
    "product_manager",
    "rx_otc",
    "quti_plan",
    "quti_fact",
    "uzs_plan",
    "uzs_fact",
]
SUPERVISOR_HINTS = ("aziz abduraxmanov", "orif husanov", "arif husanov")
FIELD_FORCE_HINTS = (
    "otabek",
    "yuldashev",
    "rixsixon",
    "rehsi",
    "tadjixo",
    "murod",
    "murodxo",
    "gapparov",
    "komola",
    "kamola",
    "azizova",
)
CELL_RE = re.compile(r"([A-Z]+)(\d+)")
_CACHE_LOCK = Lock()


def get_performance_cockpit_data(filters: dict[str, str | None]) -> dict[str, Any]:
    entry = get_active_upload_entry("performance_cockpit")
    if not entry:
        return _empty_response("Upload a Performance Cockpit file in Data Management.")

    path = Path(entry["path"])
    if not path.exists():
        return _empty_response("The active Performance Cockpit file was not found.")

    frame = _normalize_current_assignments(_load_frame(path))
    if frame.empty:
        return _empty_response("The active Performance Cockpit file has no readable rows.")

    period_selected = _apply_period(frame, filters)
    selected = _apply_filters(period_selected, filters)

    year = _first(filters.get("year")) or str(int(frame["year"].max()))
    month = _first(filters.get("month"))
    if not month:
        year_frame = frame[frame["year"] == int(year)]
        month = f"{int(year_frame['month'].max() if not year_frame.empty else frame['month'].max()):02d}"
    period_label = _selected_period_label(selected, filters, year, month)

    comparison_filters = {key: value for key, value in filters.items() if key not in {"year", "month", "quarter"}}
    previous = _same_period_previous_year(frame, selected, int(year))
    previous = _comparison_frame(previous, selected, comparison_filters)

    totals = _totals(selected)
    previous_totals = _totals(previous)
    all_current = _apply_period(frame, filters)
    all_totals = _totals(all_current)

    quti_achievement = _percent(totals["quti_fact"], totals["quti_plan"])
    uzs_achievement = _percent(totals["uzs_fact"], totals["uzs_plan"])
    quti_ppg = _growth(totals["quti_fact"], previous_totals["quti_fact"])
    uzs_ppg = _growth(totals["uzs_fact"], previous_totals["uzs_fact"])
    quti_share = _percent(totals["quti_fact"], all_totals["quti_fact"])
    uzs_share = _percent(totals["uzs_fact"], all_totals["uzs_fact"])

    trend = _monthly_trend(_trend_frame(frame, selected, comparison_filters), int(year))
    brand_rows = _top_table(selected, previous, "brand", "brand")
    sku_rows = _top_table(selected, previous, "sku", "sku", extra=("brand",))
    region_rows = sorted(
        _top_table(selected, previous, "region", "region", extra=("supervisor",)),
        key=lambda row: row["achievement_uzs"],
        reverse=True,
    )
    manager_rows = _top_table(selected, previous, "group", "group", extra=("marketing_manager", "product_manager"))
    marketing_manager_rows = _top_table(selected, previous, "marketing_manager", "marketing_manager", extra=("group",))
    field_force_rows = _field_force_table(selected, previous)
    product_manager_rows = _top_table(selected, previous, "product_manager", "product_manager", extra=("group", "marketing_manager"))

    best_brand = max(brand_rows, key=lambda row: row["uzs_ppg"], default=None)
    weak_brand = min(brand_rows, key=lambda row: row["achievement_quti"], default=None)
    best_region = max(region_rows, key=lambda row: row["achievement_uzs"], default=None)
    weak_region = min(region_rows, key=lambda row: row["achievement_uzs"], default=None)
    best_group = max(manager_rows, key=lambda row: row["uzs_ppg"], default=None)
    weak_group = min(manager_rows, key=lambda row: row["uzs_ppg"], default=None)
    best_pm = max(
        _top_table(selected, previous, "product_manager", "product_manager"),
        key=lambda row: row["uzs_ppg"],
        default=None,
    )

    return {
        "kpis": {
            "quti_plan": round(totals["quti_plan"]),
            "quti_fact": round(totals["quti_fact"]),
            "uzs_plan": round(totals["uzs_plan"]),
            "uzs_fact": round(totals["uzs_fact"]),
            "achievement_quti": quti_achievement,
            "achievement_uzs": uzs_achievement,
            "ppg_quti": quti_ppg,
            "ppg_uzs": uzs_ppg,
            "share_quti": quti_share,
            "share_uzs": uzs_share,
            "quti_change": quti_ppg,
            "uzs_change": uzs_ppg,
        },
        "pulse": {
            "summary": _summary(quti_achievement, uzs_achievement, quti_ppg),
            "overall_status": "Above Plan" if quti_achievement >= 100 else "Below Plan",
            "best_brand": best_brand,
            "weak_brand": weak_brand,
            "best_region": best_region,
            "weak_region": weak_region,
            "best_group": best_group,
            "weak_group": weak_group,
            "best_product_manager": best_pm,
        },
        "charts": {
            "performance_trend": trend,
            "quti_growth": [{"month": item["month"], "value": item["quti_ppg"]} for item in trend],
            "uzs_growth": [{"month": item["month"], "value": item["uzs_ppg"]} for item in trend],
        },
        "tables": {
            "brands": brand_rows[:15],
            "skus": sku_rows[:15],
            "regions": region_rows[:10],
            "groups": manager_rows[:10],
            "marketing_managers": marketing_manager_rows[:15],
            "field_force_managers": field_force_rows[:15],
            "product_managers": product_manager_rows[:15],
        },
        "filter_options": _filter_options(selected if not selected.empty else period_selected),
        "period_options": _period_options(frame),
        "metadata": {
            "filename": entry.get("filename"),
            "stored_name": entry.get("stored_name"),
            "country": entry.get("country") or "Uzbekistan",
            "rows": int(len(frame)),
            "latest_period": period_label,
            "selected_rows": int(len(selected)),
            "message": "Performance Cockpit calculated from the active performance file.",
        },
    }


def _load_frame(path: Path) -> pd.DataFrame:
    meta = {
        "path": str(path),
        "mtime": path.stat().st_mtime,
        "size": path.stat().st_size,
    }
    cached = _read_frame_cache(meta)
    if cached is not None:
        return cached

    with _CACHE_LOCK:
        cached = _read_frame_cache(meta)
        if cached is not None:
            return cached

        frame = _read_xlsx_fast(path)
        frame["period"] = frame["period"].apply(_excel_period)
        frame = frame.dropna(subset=["period"])
        frame["year"] = frame["period"].dt.year.astype(int)
        frame["month"] = frame["period"].dt.month.astype(int)
        for column in ["quti_plan", "quti_fact", "uzs_plan", "uzs_fact"]:
            frame[column] = pd.to_numeric(frame[column], errors="coerce").fillna(0)
        for column in [
            "brand",
            "sku",
            "group",
            "tylolfen",
            "type",
            "country",
            "region",
            "city",
            "supervisor",
            "marketing_manager",
            "product_manager",
            "rx_otc",
        ]:
            frame[column] = frame[column].fillna("Unassigned").astype(str)
        frame.to_pickle(CACHE_FILE)
        CACHE_META_FILE.write_text(json.dumps(meta, indent=2), encoding="utf-8")
        return frame


def _read_frame_cache(meta: dict[str, Any]) -> pd.DataFrame | None:
    if CACHE_FILE.exists() and CACHE_META_FILE.exists():
        try:
            cached_meta = json.loads(CACHE_META_FILE.read_text(encoding="utf-8"))
            if cached_meta == meta:
                return pd.read_pickle(CACHE_FILE)
        except Exception:
            pass
    return None


def _read_xlsx_fast(path: Path) -> pd.DataFrame:
    shared_strings = _read_shared_strings(path)
    selected = {index + 1: position for position, index in enumerate(PERFORMANCE_USECOLS)}
    rows: list[list[Any]] = []

    with ZipFile(path) as archive:
        sheet_name = _first_sheet_name(archive)
        with archive.open(sheet_name) as sheet:
            for event, element in ET.iterparse(sheet, events=("end",)):
                if _local_name(element.tag) != "row":
                    continue
                row_number = int(element.attrib.get("r", "0") or 0)
                if row_number < 4:
                    element.clear()
                    continue
                values: list[Any] = [None] * len(PERFORMANCE_COLUMNS)
                for cell in element:
                    if _local_name(cell.tag) != "c":
                        continue
                    ref = cell.attrib.get("r", "")
                    match = CELL_RE.match(ref)
                    if not match:
                        continue
                    column_index = _column_number(match.group(1))
                    if column_index not in selected:
                        continue
                    values[selected[column_index]] = _cell_value(cell, shared_strings)
                rows.append(values)
                element.clear()

    return pd.DataFrame(rows, columns=PERFORMANCE_COLUMNS)


def _read_shared_strings(path: Path) -> list[str]:
    with ZipFile(path) as archive:
        if "xl/sharedStrings.xml" not in archive.namelist():
            return []
        strings: list[str] = []
        with archive.open("xl/sharedStrings.xml") as shared:
            current: list[str] = []
            for event, element in ET.iterparse(shared, events=("end",)):
                name = _local_name(element.tag)
                if name == "t" and element.text:
                    current.append(element.text)
                elif name == "si":
                    strings.append("".join(current))
                    current = []
                    element.clear()
        return strings


def _first_sheet_name(archive: ZipFile) -> str:
    names = archive.namelist()
    if "xl/worksheets/sheet1.xml" in names:
        return "xl/worksheets/sheet1.xml"
    sheet_names = sorted(name for name in names if name.startswith("xl/worksheets/sheet") and name.endswith(".xml"))
    if not sheet_names:
        raise ValueError("No worksheet XML found in workbook")
    return sheet_names[0]


def _cell_value(cell: ET.Element, shared_strings: list[str]) -> Any:
    cell_type = cell.attrib.get("t")
    value_element = next((child for child in cell if _local_name(child.tag) == "v"), None)
    if cell_type == "inlineStr":
        return "".join(child.text or "" for child in cell.iter() if _local_name(child.tag) == "t")
    if value_element is None or value_element.text is None:
        return None
    value = value_element.text
    if cell_type == "s":
        index = int(float(value))
        return shared_strings[index] if 0 <= index < len(shared_strings) else None
    try:
        return float(value)
    except ValueError:
        return value


def _excel_period(value: Any) -> Any:
    if isinstance(value, datetime):
        return value
    if isinstance(value, (int, float)) and value > 20000:
        return datetime(1899, 12, 30) + timedelta(days=float(value))
    return pd.to_datetime(value, errors="coerce")


def _column_number(column: str) -> int:
    number = 0
    for char in column:
        number = number * 26 + (ord(char) - 64)
    return number


def _local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1]


def _apply_period(frame: pd.DataFrame, filters: dict[str, str | None]) -> pd.DataFrame:
    data = frame
    years = _values(filters.get("year"))
    if not years:
        years = [str(int(frame["year"].max()))]
    data = data[data["year"].isin([int(year) for year in years if str(year).isdigit()])]

    quarters = _values(filters.get("quarter"))
    months = _values(filters.get("month"))
    if quarters:
        quarter_months = {
            "Q1": [1, 2, 3],
            "Q2": [4, 5, 6],
            "Q3": [7, 8, 9],
            "Q4": [10, 11, 12],
        }
        selected_months = sorted({month for quarter in quarters for month in quarter_months.get(quarter, [])})
        data = data[data["month"].isin(selected_months)]
    elif months:
        data = data[data["month"].isin([int(month) for month in months if str(month).isdigit()])]
    else:
        data = data[data["year"].isin([int(year) for year in years if str(year).isdigit()])]
    return data


def _selected_period_label(frame: pd.DataFrame, filters: dict[str, str | None], fallback_year: str, fallback_month: str) -> str:
    if frame.empty:
        return f"{fallback_year}-{fallback_month}"

    selected_type = (filters.get("period_type") or "MONTH").upper()
    years = sorted(frame["year"].dropna().astype(int).unique().tolist())
    months = sorted(frame["month"].dropna().astype(int).unique().tolist())

    if selected_type == "QTR" and filters.get("quarter"):
        return f"{years[0]} {filters.get('quarter')}" if len(years) == 1 else f"{years[0]}-{years[-1]} {filters.get('quarter')}"

    if len(years) == 1 and months:
      if len(months) == 12:
          return str(years[0])
      if len(months) == 1:
          return f"{years[0]}-{months[0]:02d}"
      return f"{years[0]}-{months[0]:02d}..{years[0]}-{months[-1]:02d}"

    if years and months:
        return f"{years[0]}-{months[0]:02d}..{years[-1]}-{months[-1]:02d}"

    return f"{fallback_year}-{fallback_month}"


def _normalize_current_assignments(frame: pd.DataFrame) -> pd.DataFrame:
    latest_year = int(frame["year"].max())
    latest_month = int(frame[frame["year"] == latest_year]["month"].max())
    latest = frame[(frame["year"] == latest_year) & (frame["month"] == latest_month)]
    if latest.empty:
        return frame

    group_manager = (
        latest.groupby(["group", "marketing_manager"], dropna=False)["uzs_fact"]
        .sum()
        .reset_index()
        .sort_values(["group", "uzs_fact"], ascending=[True, False])
        .drop_duplicates("group")
        .set_index("group")["marketing_manager"]
        .to_dict()
    )
    if not group_manager:
        return frame

    normalized = frame.copy()
    normalized["marketing_manager"] = normalized["group"].map(group_manager).fillna(normalized["marketing_manager"])
    return normalized


def _apply_filters(frame: pd.DataFrame, filters: dict[str, str | None]) -> pd.DataFrame:
    data = frame
    mapping = {
        "group": "group",
        "region": "region",
        "city": "city",
        "supervisor": "supervisor",
        "field_force_manager": "supervisor",
        "marketing_manager": "marketing_manager",
        "product_manager": "product_manager",
        "brand": "brand",
        "sku": "sku",
        "type": "type",
        "rx_otc": "rx_otc",
        "tylolfen": "tylolfen",
        "country": "country",
    }
    for key, column in mapping.items():
        selected = _values(filters.get(key))
        if selected:
            data = data[data[column].isin(selected)]
    return data


def _comparison_frame(frame: pd.DataFrame, selected: pd.DataFrame, filters: dict[str, str | None]) -> pd.DataFrame:
    if _values(filters.get("supervisor")) or _values(filters.get("field_force_manager")):
        region_values = _sorted_unique(selected["region"]) if not selected.empty else []
        scoped_filters = {key: value for key, value in filters.items() if key not in {"supervisor", "field_force_manager", "region"}}
        data = frame[frame["region"].isin(region_values)] if region_values else frame
        return _apply_filters(data, scoped_filters)
    return _apply_filters(frame, filters)


def _trend_frame(frame: pd.DataFrame, selected: pd.DataFrame, filters: dict[str, str | None]) -> pd.DataFrame:
    if _values(filters.get("supervisor")) or _values(filters.get("field_force_manager")):
        region_values = _sorted_unique(selected["region"]) if not selected.empty else []
        scoped_filters = {key: value for key, value in filters.items() if key not in {"supervisor", "field_force_manager", "region"}}
        data = frame[frame["region"].isin(region_values)] if region_values else frame
        return _apply_filters(data, scoped_filters)
    return _apply_filters(frame, filters)


def _same_period_previous_year(frame: pd.DataFrame, selected: pd.DataFrame, year: int) -> pd.DataFrame:
    months = sorted(selected["month"].unique().tolist()) if not selected.empty else []
    if not months:
        months = [int(frame["month"].max())]
    return frame[(frame["year"] == year - 1) & (frame["month"].isin(months))]


def _top_table(current: pd.DataFrame, previous: pd.DataFrame, group_col: str, name_key: str, extra: tuple[str, ...] = ()) -> list[dict[str, Any]]:
    if current.empty:
        return []
    aggregate = current.groupby(group_col, dropna=False).agg(
        quti_plan=("quti_plan", "sum"),
        quti_fact=("quti_fact", "sum"),
        uzs_plan=("uzs_plan", "sum"),
        uzs_fact=("uzs_fact", "sum"),
    )
    previous_aggregate = previous.groupby(group_col, dropna=False).agg(
        previous_quti=("quti_fact", "sum"),
        previous_uzs=("uzs_fact", "sum"),
    )
    aggregate = aggregate.join(previous_aggregate, how="left").fillna(0)
    total_quti = float(aggregate["quti_fact"].sum())
    total_uzs = float(aggregate["uzs_fact"].sum())
    aggregate = aggregate.sort_values("uzs_fact", ascending=False).head(30)

    rows: list[dict[str, Any]] = []
    for index, row in aggregate.iterrows():
        matching = current[current[group_col] == index]
        item: dict[str, Any] = {
            name_key: str(index),
            "quti_plan": round(float(row["quti_plan"])),
            "quti_fact": round(float(row["quti_fact"])),
            "uzs_plan": round(float(row["uzs_plan"])),
            "uzs_fact": round(float(row["uzs_fact"])),
            "achievement_quti": _percent(row["quti_fact"], row["quti_plan"]),
            "achievement_uzs": _percent(row["uzs_fact"], row["uzs_plan"]),
            "quti_ppg": _growth(row["quti_fact"], row["previous_quti"]),
            "uzs_ppg": _growth(row["uzs_fact"], row["previous_uzs"]),
            "share_quti": _percent(row["quti_fact"], total_quti),
            "share_uzs": _percent(row["uzs_fact"], total_uzs),
            "status": _status(_percent(row["quti_fact"], row["quti_plan"])),
        }
        for column in extra:
            modes = matching[column].dropna().astype(str).unique().tolist() if not matching.empty else []
            item[column] = ", ".join(sorted(modes)[:4]) if modes else "-"
        rows.append(item)
    return rows


def _field_force_table(current: pd.DataFrame, previous: pd.DataFrame) -> list[dict[str, Any]]:
    names = [
        name
        for name in _sorted_unique(current["supervisor"])
        if any(hint in name.lower() for hint in FIELD_FORCE_HINTS)
    ]
    if not names:
        return _top_table(current, previous, "supervisor", "field_force_manager", extra=("group",))
    return _top_table(
        current[current["supervisor"].isin(names)],
        previous[previous["supervisor"].isin(names)],
        "supervisor",
        "field_force_manager",
        extra=("group",),
    )


def _monthly_trend(frame: pd.DataFrame, year: int) -> list[dict[str, Any]]:
    current = frame[frame["year"] == year].groupby("month").agg(
        quti_fact=("quti_fact", "sum"),
        uzs_fact=("uzs_fact", "sum"),
    )
    previous = frame[frame["year"] == year - 1].groupby("month").agg(
        previous_quti=("quti_fact", "sum"),
        previous_uzs=("uzs_fact", "sum"),
    )
    rows = []
    for month in range(1, 13):
        quti = float(current["quti_fact"].get(month, 0)) if not current.empty else 0
        uzs = float(current["uzs_fact"].get(month, 0)) if not current.empty else 0
        prev_quti = float(previous["previous_quti"].get(month, 0)) if not previous.empty else 0
        prev_uzs = float(previous["previous_uzs"].get(month, 0)) if not previous.empty else 0
        rows.append(
            {
                "month": datetime(2000, month, 1).strftime("%b"),
                "quti_fact": round(quti),
                "uzs_fact": round(uzs),
                "quti_ppg": _growth(quti, prev_quti),
                "uzs_ppg": _growth(uzs, prev_uzs),
            }
        )
    return rows


def _filter_options(frame: pd.DataFrame) -> dict[str, list[str]]:
    options = {
        "group": _sorted_unique(frame["group"]),
        "region": _sorted_unique(frame["region"]),
        "city": _sorted_unique(frame["city"]),
        "supervisor": [
            name for name in _sorted_unique(frame["supervisor"]) if any(hint in name.lower() for hint in SUPERVISOR_HINTS)
        ],
        "field_force_manager": [
            name for name in _sorted_unique(frame["supervisor"]) if any(hint in name.lower() for hint in FIELD_FORCE_HINTS)
        ],
        "marketing_manager": _sorted_unique(frame["marketing_manager"]),
        "product_manager": _sorted_unique(frame["product_manager"]),
        "brand": _sorted_unique(frame["brand"]),
        "sku": _sorted_unique(frame["sku"]),
        "type": _sorted_unique(frame["type"]),
        "rx_otc": _sorted_unique(frame["rx_otc"]),
        "tylolfen": _sorted_unique(frame["tylolfen"]),
        "country": _sorted_unique(frame["country"]),
    }
    if not options["field_force_manager"]:
        options["field_force_manager"] = options["supervisor"]
    if not options["supervisor"]:
        options["supervisor"] = _sorted_unique(frame["supervisor"])
    return options


def _period_options(frame: pd.DataFrame) -> dict[str, Any]:
    return {
        "years": [str(year) for year in sorted(frame["year"].unique(), reverse=True)],
        "months": [{"value": f"{month:02d}", "label": datetime(2000, month, 1).strftime("%B")} for month in range(1, 13)],
        "quarters": ["Q1", "Q2", "Q3", "Q4"],
        "default": {
            "year": str(int(frame["year"].max())),
            "month": f"{int(frame[frame['year'] == frame['year'].max()]['month'].max()):02d}",
            "quarter": "All",
        },
    }


def _totals(frame: pd.DataFrame) -> dict[str, float]:
    return {
        "quti_plan": float(frame["quti_plan"].sum()) if not frame.empty else 0,
        "quti_fact": float(frame["quti_fact"].sum()) if not frame.empty else 0,
        "uzs_plan": float(frame["uzs_plan"].sum()) if not frame.empty else 0,
        "uzs_fact": float(frame["uzs_fact"].sum()) if not frame.empty else 0,
    }


def _percent(numerator: float, denominator: float) -> float:
    return round((float(numerator) / float(denominator) * 100), 1) if denominator else 0


def _growth(current: float, previous: float) -> float:
    return round(((float(current) - float(previous)) / float(previous) * 100), 1) if previous else 0


def _status(achievement: float) -> str:
    if achievement >= 105:
        return "Overperforming"
    if achievement >= 95:
        return "On Track"
    if achievement >= 85:
        return "Below Plan"
    return "Critical"


def _summary(quti_achievement: float, uzs_achievement: float, quti_ppg: float) -> str:
    direction = "growth remains positive" if quti_ppg >= 0 else "growth is under pressure"
    return f"Portfolio achievement is {quti_achievement:.1f}% in packs and {uzs_achievement:.1f}% in UZS; {direction} versus the same period last year."


def _values(value: str | None) -> list[str]:
    if not value or value == "All":
        return []
    return [part for part in str(value).split(",") if part and part != "All"]


def _first(value: str | None) -> str | None:
    values = _values(value)
    return values[0] if values else None


def _sorted_unique(series: pd.Series) -> list[str]:
    return sorted([str(value) for value in series.dropna().unique() if str(value) and str(value) != "nan"])


def _empty_response(message: str) -> dict[str, Any]:
    return {
        "kpis": {
            "quti_plan": 0,
            "quti_fact": 0,
            "uzs_plan": 0,
            "uzs_fact": 0,
            "achievement_quti": 0,
            "achievement_uzs": 0,
            "ppg_quti": 0,
            "ppg_uzs": 0,
            "share_quti": 0,
            "share_uzs": 0,
            "quti_change": 0,
            "uzs_change": 0,
        },
        "pulse": {"summary": message},
        "charts": {"performance_trend": [], "quti_growth": [], "uzs_growth": []},
        "tables": {
            "brands": [],
            "skus": [],
            "regions": [],
            "groups": [],
            "marketing_managers": [],
            "field_force_managers": [],
            "product_managers": [],
        },
        "filter_options": {},
        "period_options": {"years": [], "months": [], "quarters": [], "default": {}},
        "metadata": {"filename": None, "country": "Uzbekistan", "rows": 0, "selected_rows": 0, "message": message},
    }
