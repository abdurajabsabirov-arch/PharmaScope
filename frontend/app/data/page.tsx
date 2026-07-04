"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  activateUpload,
  deleteUpload,
  fetchUploads,
  uploadMarketFile,
  type UploadFileInfo,
} from "@/app/dashboard/lib/api";
import { useLanguage } from "@/lib/i18n";

const countries = ["Uzbekistan", "Kazakhstan", "Kyrgyzstan", "Tajikistan", "Turkmenistan", "Azerbaijan", "Georgia", "Russia", "Other"];

const fileSizeFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function DataManagementPage() {
  const { isRu } = useLanguage();
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState("Uzbekistan");
  const [files, setFiles] = useState<UploadFileInfo[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadFiles = async () => {
    try {
      const response = await fetchUploads();
      setFiles(response.files ?? []);
    } catch {
      setError(isRu ? "Не удалось загрузить список файлов." : "Could not load uploaded files.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleUpload = async () => {
    if (!file) {
      setError(isRu ? "Сначала выберите Excel или CSV файл." : "Choose an Excel or CSV file first.");
      return;
    }

    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const response = await uploadMarketFile(file, country);
      const rows = response.dashboard?.metadata?.rows ?? 0;
      setMessage(isRu
        ? `Файл ${cleanMarketFilename(response.filename)} загружен. Активный рынок: ${country}. Строк: ${rows.toLocaleString()}.`
        : `Uploaded ${cleanMarketFilename(response.filename)}. Active market: ${country}. Rows: ${rows.toLocaleString()}.`);
      setFile(null);
      await loadFiles();
    } catch {
      setError(isRu ? "Загрузка не удалась. Проверьте формат файла и backend." : "Upload failed. Make sure the file is Excel/CSV and the backend is running.");
    } finally {
      setBusy(false);
    }
  };

  const handleActivate = async (fileId: string) => {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const response = await activateUpload(fileId);
      setMessage(isRu
        ? `Активный файл изменен на ${cleanMarketFilename(response.file?.filename) || "выбранный файл"}.`
        : `Active file changed to ${cleanMarketFilename(response.file?.filename) || "selected file"}.`);
      await loadFiles();
    } catch {
      setError(isRu ? "Не удалось выбрать файл." : "Could not activate this file.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (fileId: string, filename: string) => {
    const ok = confirm(isRu ? `Удалить ${cleanMarketFilename(filename)}?` : `Delete ${cleanMarketFilename(filename)}?`);
    if (!ok) return;

    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      await deleteUpload(fileId);
      setMessage(isRu ? "Файл удален." : "File deleted.");
      await loadFiles();
    } catch {
      setError(isRu ? "Не удалось удалить файл." : "Could not delete this file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout country={files.find((item) => item.active)?.country}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{isRu ? "Управление данными" : "Data Management"}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isRu ? "Загрузка файлов, выбор страны и активного источника аналитики." : "Upload market files, assign country, and choose the active file for analytics."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[420px_1fr]">
          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">{isRu ? "Загрузка файла" : "Upload File"}</h2>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">{isRu ? "Страна" : "Country"}</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none focus:border-blue-500"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="mt-5 block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-400">
              <input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="hidden" />
              <p className="text-sm font-semibold text-slate-900">{isRu ? "Выбрать Excel/CSV" : "Click to choose Excel/CSV"}</p>
              <p className="mt-2 text-xs text-slate-500">{file ? file.name : isRu ? "Файл не выбран" : "No file selected"}</p>
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || busy}
              className="mt-5 h-11 w-full rounded-lg bg-blue-600 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? (isRu ? "Обработка..." : "Processing...") : (isRu ? "Загрузить и сделать активным" : "Upload and set active")}
            </button>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">{isRu ? "Доступные файлы" : "Available Files"}</h2>
            <p className="mt-1 text-sm text-slate-500">{isRu ? "Выберите файл для Market Intelligence." : "Select which file powers Market Intelligence."}</p>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                    <th className="pb-3">{isRu ? "Статус" : "Status"}</th>
                    <th className="pb-3">{isRu ? "Файл" : "File"}</th>
                    <th className="pb-3">{isRu ? "Страна" : "Country"}</th>
                    <th className="pb-3">{isRu ? "Загружен" : "Uploaded"}</th>
                    <th className="pb-3 text-right">{isRu ? "Размер" : "Size"}</th>
                    <th className="pb-3 text-right">{isRu ? "Действия" : "Actions"}</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((item) => (
                    <tr key={item.id} className="border-b border-slate-100 last:border-0">
                      <td className="py-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                          {item.active ? (isRu ? "Активный" : "Active") : (isRu ? "Сохранен" : "Stored")}
                        </span>
                      </td>
                      <td className="max-w-[260px] truncate py-4 font-semibold text-slate-900" title={cleanMarketFilename(item.filename)}>{cleanMarketFilename(item.filename)}</td>
                      <td className="py-4 text-slate-600">{item.country}</td>
                      <td className="py-4 text-slate-600">{item.uploaded_at ? item.uploaded_at.replace("T", " ") : "-"}</td>
                      <td className="py-4 text-right text-slate-600">{fileSizeFormatter.format(item.size)}B</td>
                      <td className="py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleActivate(item.id)} disabled={busy || item.active} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            {isRu ? "Выбрать" : "Use"}
                          </button>
                          <button onClick={() => handleDelete(item.id, item.filename)} disabled={busy} className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">
                            {isRu ? "Удалить" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!files.length && <div className="py-10 text-center text-sm text-slate-500">{isRu ? "Файлы еще не загружены." : "No uploaded files yet."}</div>}
            </div>
          </div>
        </div>

        {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
      </div>
    </DashboardLayout>
  );
}

function cleanMarketFilename(filename?: string | null) {
  return (filename ?? "")
    .replace(/^iqvia[_-]?\d{8}_\d{6}_?/i, "")
    .replace(/^iqvia[_-]?/i, "")
    .replace(/^market[_-]?\d{8}_\d{6}_?/i, "");
}
