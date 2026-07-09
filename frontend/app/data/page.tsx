"use client";

import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  activateUpload,
  deleteUpload,
  fetchUploads,
  uploadMarketFile,
  type UploadDestination,
  type UploadFileInfo,
  type UploadSource,
  type UploadSummary,
} from "@/app/dashboard/lib/api";

const countries = [
  "Russia",
  "Azerbaijan",
  "Albania",
  "Belarus",
  "Bulgaria",
  "Bosnia and Herzegovina",
  "Germany",
  "Georgia",
  "Kazakhstan",
  "Kyrgyzstan",
  "Kosovo",
  "Macedonia",
  "Moldova",
  "Mongolia",
  "Serbia",
  "Turkmenistan",
  "Turkey",
  "Uzbekistan",
  "Ukraine",
  "Switzerland",
];

const destinationCards: Array<{
  value: UploadDestination;
  title: string;
  description: string;
}> = [
  {
    value: "market_intelligence",
    title: "Market Intelligence",
    description: "IQVIA market and competitor analytics",
  },
  {
    value: "performance_cockpit",
    title: "Performance Cockpit",
    description: "Plan/fact, PPG, region, brand, SKU and manager performance",
  },
];

const sourcesByDestination: Record<UploadDestination, Array<{ value: UploadSource; label: string }>> = {
  market_intelligence: [{ value: "iqvia", label: "Market Intelligence" }],
  performance_cockpit: [
    { value: "performance", label: "Performance Cockpit" },
    { value: "secondary_sales", label: "Performance Cockpit" },
  ],
};

const labels = {
  market_intelligence: "Market Intelligence",
  performance_cockpit: "Performance Cockpit",
  iqvia: "IQVIA Market Data",
  performance: "Commercial Performance Data",
  secondary_sales: "Secondary Sales / Plan-Fact Data",
};

const fileSizeFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export default function DataManagementPage() {
  const [file, setFile] = useState<File | null>(null);
  const [country, setCountry] = useState("Uzbekistan");
  const [destination, setDestination] = useState<UploadDestination | "">("market_intelligence");
  const [source, setSource] = useState<UploadSource | "">("iqvia");
  const [files, setFiles] = useState<UploadFileInfo[]>([]);
  const [summary, setSummary] = useState<UploadSummary | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sourceOptions = useMemo(
    () => (destination ? sourcesByDestination[destination] : []),
    [destination],
  );

  const loadFiles = async () => {
    try {
      const response = await fetchUploads();
      setFiles(response.files ?? []);
    } catch {
      setError("Could not load uploaded files.");
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const chooseDestination = (value: UploadDestination) => {
    setDestination(value);
    setSource(sourcesByDestination[value][0].value);
    setError(null);
  };

  const handleUpload = async () => {
    if (!destination) {
      setError("Please select data destination before uploading.");
      return;
    }
    if (!source) {
      setError("Please select file type before uploading.");
      return;
    }
    if (!file) {
      setError("Choose an Excel or CSV file first.");
      return;
    }

    setBusy(true);
    setMessage(null);
    setError(null);
    setSummary(null);

    try {
      const response = await uploadMarketFile(file, country, destination, source);
      setSummary(response.summary ?? null);
      setMessage(
        response.message ?? `${file.name} uploaded to ${labels[destination]}. Analytics refresh started in background.`,
      );
      setFile(null);
      await loadFiles();
    } catch (error) {
      if (error instanceof TypeError) {
        setError("Cannot reach backend. Run: npm run serve");
        return;
      }
      if (error instanceof Error && error.name === "TimeoutError") {
        setError("Upload timed out. Try a smaller file or restart the backend.");
        return;
      }
      setError(error instanceof Error ? error.message : "Upload failed. Check file format and backend status.");
    } finally {
      setBusy(false);
    }
  };

  const handleActivate = async (fileInfo: UploadFileInfo) => {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      const response = await activateUpload(fileInfo.id);
      setMessage(`Active ${labels[fileInfo.destination ?? "market_intelligence"]} file changed to ${cleanMarketFilename(response.file?.filename) || "selected file"}.`);
      await loadFiles();
    } catch {
      setError("Could not activate this file.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (fileId: string, filename: string) => {
    const ok = confirm(`Delete ${cleanMarketFilename(filename)}?`);
    if (!ok) return;

    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      await deleteUpload(fileId);
      setMessage("File deleted.");
      await loadFiles();
    } catch {
      setError("Could not delete this file.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout country={files.find((item) => item.active)?.country}>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Data Management</h1>
          <p className="mt-2 text-sm text-slate-500">
            Upload files and choose which analytical module will use the data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-[460px_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-900">Upload Excel File</h2>

            <div className="mt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Data Destination</p>
              <div className="mt-2 grid gap-3">
                {destinationCards.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    onClick={() => chooseDestination(item.value)}
                    className={`rounded-2xl border p-4 text-left transition ${
                      destination === item.value
                        ? "border-blue-500 bg-blue-50 shadow-sm"
                        : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                    }`}
                  >
                    <span className="block text-sm font-bold text-slate-900">{item.title}</span>
                    <span className="mt-1 block text-xs leading-relaxed text-slate-500">{item.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">File Type</span>
              <select
                value={source}
                onChange={(event) => setSource(event.target.value as UploadSource)}
                disabled={!destination}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              >
                {!destination && <option value="">Select data destination first</option>}
                {sourceOptions.map((item) => (
                  <option key={item.value} value={item.value}>{item.label}</option>
                ))}
              </select>
            </label>

            <label className="mt-5 block">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Country</span>
              <select
                value={country}
                onChange={(event) => setCountry(event.target.value)}
                className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 outline-none transition focus:border-blue-500"
              >
                {countries.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </label>

            <label className="mt-5 block cursor-pointer rounded-2xl border-2 border-dashed border-slate-300 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/40">
              <input type="file" accept=".xlsx,.xls,.csv" onChange={(event) => setFile(event.target.files?.[0] ?? null)} className="hidden" />
              <p className="text-sm font-semibold text-slate-900">Upload Excel File</p>
              <p className="mt-2 text-xs text-slate-500">{file ? file.name : "Click to choose Excel/CSV"}</p>
            </label>

            <button
              onClick={handleUpload}
              disabled={!file || busy}
              className="mt-5 h-11 w-full rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? "Processing..." : "Upload File"}
            </button>
          </div>

          <div className="space-y-6">
            <UploadSummaryCard summary={summary} />

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Available Files</h2>
              <p className="mt-1 text-sm text-slate-500">Stored files and their analytical destinations.</p>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[860px] text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="pb-3">Status</th>
                      <th className="pb-3">File</th>
                      <th className="pb-3">Destination</th>
                      <th className="pb-3">Type</th>
                      <th className="pb-3">Country</th>
                      <th className="pb-3 text-right">Size</th>
                      <th className="pb-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {files.map((item) => (
                      <tr key={item.id} className="border-b border-slate-100 last:border-0">
                        <td className="py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${item.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                            {item.active ? "Active" : "Stored"}
                          </span>
                        </td>
                        <td className="max-w-[240px] truncate py-4 font-semibold text-slate-900" title={cleanMarketFilename(item.filename)}>
                          {cleanMarketFilename(item.filename)}
                        </td>
                        <td className="py-4 text-slate-600">{labels[item.destination ?? "market_intelligence"]}</td>
                        <td className="py-4 text-slate-600">{labels[item.destination ?? "market_intelligence"]}</td>
                        <td className="py-4 text-slate-600">{item.country}</td>
                        <td className="py-4 text-right text-slate-600">{fileSizeFormatter.format(item.size)}B</td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleActivate(item)}
                              disabled={busy || item.active}
                              className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-300 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Use
                            </button>
                            <button
                              onClick={() => handleDelete(item.id, item.filename)}
                              disabled={busy}
                              className="rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {!files.length && <div className="py-10 text-center text-sm text-slate-500">No uploaded files yet.</div>}
              </div>
            </div>
          </div>
        </div>

        {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
      </div>
    </DashboardLayout>
  );
}

function UploadSummaryCard({ summary }: { summary: UploadSummary | null }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-slate-900">Upload Summary</h2>
      {!summary ? (
        <p className="mt-3 text-sm text-slate-500">Upload a file to see detected metadata.</p>
      ) : (
        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <SummaryItem label="Destination" value={labels[summary.destination]} />
          <SummaryItem label="Type" value={labels[summary.destination]} />
          <SummaryItem label="File name" value={summary.file_name} />
          <SummaryItem label="Status" value={summary.status} />
          <SummaryItem label="Rows" value={summary.rows.toLocaleString()} />
          <SummaryItem label="Columns" value={summary.columns.toLocaleString()} />
          <div className="sm:col-span-2">
            <SummaryItem label="Detected periods" value={summary.detected_periods.length ? summary.detected_periods.join(", ") : "Not detected"} />
          </div>
        </dl>
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2">
      <dt className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 truncate text-sm font-semibold text-slate-900" title={value}>{value}</dd>
    </div>
  );
}

function cleanMarketFilename(filename?: string | null) {
  return (filename ?? "")
    .replace(/^iqvia[_-]?\d{8}_\d{6}_?/i, "")
    .replace(/^iqvia[_-]?/i, "")
    .replace(/^market[_-]?\d{8}_\d{6}_?/i, "")
    .replace(/^performance[_-]?\d{8}_\d{6}_?/i, "");
}
