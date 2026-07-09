"use client";

import { AlertTriangle, CheckCircle, ShieldAlert, Target, TrendingUp } from "lucide-react";
import { type PerformanceCockpitData } from "@/app/dashboard/lib/api";
import { useLanguage } from "@/lib/i18n";

type Severity = "Critical" | "High" | "Medium" | "Opportunity";

type ActionRow = {
  object: string;
  reason: string;
  action: string;
  severity: Severity;
};

const fallbackRowsEn: ActionRow[] = [
  {
    object: "TylolFen",
    reason: "High share but low achievement, 47.6%",
    action: "Build recovery plan, review price and promo execution",
    severity: "Critical",
  },
  {
    object: "Farg'ona vil.",
    reason: "Weak regional execution, 72.2% UZS achievement",
    action: "Regional review with field force and distributor check",
    severity: "High",
  },
  {
    object: "Anzibel",
    reason: "Increasing plan gap and negative PPG",
    action: "Check demand, stock availability and trade activity",
    severity: "Medium",
  },
  {
    object: "Qoraqalpog'iston",
    reason: "Very low UZS achievement, 58.3%",
    action: "Distributor support and activation plan",
    severity: "High",
  },
  {
    object: "Coronim",
    reason: "Strong growth but small base",
    action: "Scale demand and availability",
    severity: "Opportunity",
  },
];

const fallbackRowsUz: ActionRow[] = [
  {
    object: "TylolFen",
    reason: "Ulushi yuqori, ammo bajarilishi past, 47.6%",
    action: "Tiklanish rejasini tuzing, narx va promo ijrosini ko'rib chiqing",
    severity: "Critical",
  },
  {
    object: "Farg'ona vil.",
    reason: "Hududiy ijro zaif, 72.2% UZS bajarilishi",
    action: "Maydon guruhi va distribyutor tekshiruvi bilan hududiy ko'rib chiqish",
    severity: "High",
  },
  {
    object: "Anzibel",
    reason: "Reja farqi o'smoqda va PPG manfiy",
    action: "Talab, zaxira mavjudligi va savdo faolligini tekshiring",
    severity: "Medium",
  },
  {
    object: "Qoraqalpog'iston",
    reason: "UZS bajarilishi juda past, 58.3%",
    action: "Distribyutorni qo'llab-quvvatlash va faollashtirish rejasi",
    severity: "High",
  },
  {
    object: "Coronim",
    reason: "Kuchli o'sish, ammo kichik baza",
    action: "Talab va mavjudlikni kengaytiring",
    severity: "Opportunity",
  },
];

export default function ActionPriorityList({ data }: { data: PerformanceCockpitData }) {
  const { isUz } = useLanguage();
  const rows = buildRows(data, isUz);
  const labels = actionPriorityLabels(isUz);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <ShieldAlert size={19} />
        </span>
        <div>
          <h2 className="text-sm font-black text-slate-950">{labels.title}</h2>
          <p className="text-xs font-semibold text-slate-500">{labels.subtitle}</p>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] text-left text-xs">
          <thead className="border-b border-slate-200 text-slate-500">
            <tr>
              <th className="py-2">{labels.priority}</th>
              <th className="py-2">{labels.object}</th>
              <th className="py-2">{labels.reason}</th>
              <th className="py-2">{labels.recommendedAction}</th>
              <th className="py-2 text-right">{labels.severity}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const Icon = severityIcon(row.severity);
              return (
                <tr key={`${row.object}-${index}`} className="border-b border-slate-100 last:border-0">
                  <td className="py-3 font-black text-slate-900">{index + 1}</td>
                  <td className="py-3 font-bold text-slate-950">{row.object}</td>
                  <td className="max-w-[260px] py-3 text-slate-600">{row.reason}</td>
                  <td className="max-w-[340px] py-3 font-semibold text-slate-700">{row.action}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-black ${severityClass(row.severity)}`}>
                      <Icon size={13} />
                      {severityLabel(row.severity, isUz)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function actionPriorityLabels(isUz: boolean) {
  return isUz
    ? {
        title: "Amal ustuvorligi ro'yxati",
        subtitle: "Reja farqi, bajarilish va o'sish xavfi asosida tavsiya etilgan boshqaruv harakatlari.",
        priority: "Ustuvorlik",
        object: "Obyekt",
        reason: "Sabab",
        recommendedAction: "Tavsiya etilgan harakat",
        severity: "Jiddiylik",
      }
    : {
        title: "Action Priority List",
        subtitle: "Recommended management actions based on plan gap, achievement and growth risk.",
        priority: "Priority",
        object: "Object",
        reason: "Reason",
        recommendedAction: "Recommended Action",
        severity: "Severity",
      };
}

function severityLabel(severity: Severity, isUz: boolean) {
  if (isUz) {
    if (severity === "Critical") return "Tanqidiy";
    if (severity === "High") return "Yuqori";
    if (severity === "Medium") return "O'rta";
    return "Imkoniyat";
  }

  return severity;
}

function buildRows(data: PerformanceCockpitData, isUz: boolean): ActionRow[] {
  if (!data.metadata.rows) return isUz ? fallbackRowsUz : fallbackRowsEn;
  const weakBrand = data.pulse.weak_brand;
  const weakRegion = data.pulse.weak_region;
  const opportunity = data.pulse.best_brand;
  const rows: ActionRow[] = [];

  if (weakBrand?.brand) {
    rows.push({
      object: weakBrand.brand,
      reason: isUz
        ? `Quti bajarilishi past, ${weakBrand.achievement_quti}%`
        : `Low packs achievement, ${weakBrand.achievement_quti}%`,
      action: isUz
        ? "Tiklanish rejasini tuzing, narx va promo ijrosini ko'rib chiqing"
        : "Build recovery plan, review price and promo execution",
      severity: weakBrand.achievement_quti < 70 ? "Critical" : "High",
    });
  }

  if (weakRegion?.region) {
    rows.push({
      object: weakRegion.region,
      reason: isUz
        ? `Hududiy ijro zaif, ${weakRegion.achievement_uzs}% UZS bajarilishi`
        : `Weak regional execution, ${weakRegion.achievement_uzs}% UZS achievement`,
      action: isUz
        ? "Maydon guruhi va distribyutor tekshiruvi bilan hududiy ko'rib chiqish"
        : "Regional review with field force and distributor check",
      severity: weakRegion.achievement_uzs < 75 ? "High" : "Medium",
    });
  }

  data.tables.brands
    .filter((row) => row.uzs_ppg < 0 || row.achievement_uzs < 90)
    .slice(0, 2)
    .forEach((row) => {
      rows.push({
        object: row.brand ?? (isUz ? "Brend" : "Brand"),
        reason: isUz
          ? `Reja xavfi: ${row.achievement_uzs}% UZS bajarilishi va ${row.uzs_ppg}% PPG`
          : `Plan risk with ${row.achievement_uzs}% UZS achievement and ${row.uzs_ppg}% PPG`,
        action: isUz
          ? "Talab, zaxira mavjudligi va savdo faolligini tekshiring"
          : "Check demand, stock availability and trade activity",
        severity: row.achievement_uzs < 80 ? "High" : "Medium",
      });
    });

  if (opportunity?.brand) {
    rows.push({
      object: opportunity.brand,
      reason: isUz
        ? `Kuchli o'sish drayveri: ${opportunity.uzs_ppg}% UZS PPG`
        : `Strong growth driver with ${opportunity.uzs_ppg}% UZS PPG`,
      action: isUz ? "Talab va mavjudlikni kengaytiring" : "Scale demand and availability",
      severity: "Opportunity",
    });
  }

  return rows.length ? rows.slice(0, 5) : isUz ? fallbackRowsUz : fallbackRowsEn;
}

function severityClass(severity: Severity) {
  if (severity === "Critical") return "bg-rose-50 text-rose-700";
  if (severity === "High") return "bg-orange-50 text-orange-700";
  if (severity === "Medium") return "bg-amber-50 text-amber-700";
  return "bg-emerald-50 text-emerald-700";
}

function severityIcon(severity: Severity) {
  if (severity === "Critical") return AlertTriangle;
  if (severity === "High") return Target;
  if (severity === "Medium") return ShieldAlert;
  if (severity === "Opportunity") return TrendingUp;
  return CheckCircle;
}
