export function calculatePlanGap(plan: number, fact: number) {
  return fact - plan;
}

export function calculateAchievement(plan: number, fact: number) {
  if (!plan) return 0;
  return (fact / plan) * 100;
}

export function calculateRequiredRunRate(plan: number, fact: number) {
  if (!fact) return 0;
  return ((plan / fact) - 1) * 100;
}

export function formatCompactUZS(value: number) {
  const absolute = Math.abs(value);
  const sign = value < 0 ? "-" : value > 0 ? "+" : "";
  if (absolute >= 1_000_000_000) return `${sign}${(absolute / 1_000_000_000).toFixed(2)}B`;
  if (absolute >= 1_000_000) return `${sign}${(absolute / 1_000_000).toFixed(1)}M`;
  if (absolute >= 1_000) return `${sign}${(absolute / 1_000).toFixed(0)}K`;
  return `${sign}${Math.round(absolute)}`;
}

export function getStatusColor(value: number, type: "gap" | "forecast" | "runRate" | "achievement" | "growth") {
  if (type === "gap" || type === "growth") return value >= 0 ? "green" : "red";
  if (type === "forecast" || type === "achievement") {
    if (value >= 100) return "green";
    if (value >= 90) return "amber";
    return "red";
  }
  if (type === "runRate") {
    if (value > 15) return "red";
    if (value >= 5) return "amber";
    return "green";
  }
  return "amber";
}
