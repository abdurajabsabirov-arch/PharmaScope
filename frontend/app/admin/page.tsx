"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { uploadIQVIAFile } from "@/app/dashboard/lib/api";
import { useState } from "react";

export default function AdminPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) {
      setError("Choose an Excel or CSV file first.");
      return;
    }

    setUploading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await uploadIQVIAFile(file);
      const rows = response.dashboard?.metadata?.rows ?? 0;
      setMessage(`Uploaded ${response.filename}. Dashboard refreshed from ${rows.toLocaleString()} rows.`);
    } catch {
      setError("Upload failed. Make sure the backend is running and the file format is supported.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>

        <div className="bg-white rounded-3xl p-12 border shadow-sm">
          <h2 className="text-2xl mb-8">Upload IQVIA File</h2>

          <label className="block border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center cursor-pointer hover:border-blue-400 transition">
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="hidden"
            />
            <p className="text-lg">Click or drag an Excel/CSV file here</p>
            <p className="text-sm text-slate-500 mt-2">
              {file ? file.name : "No file selected"}
            </p>
          </label>

          <button
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Upload and refresh dashboard"}
          </button>

          {message && (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-emerald-700">
              {message}
            </div>
          )}

          {error && (
            <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50 p-4 text-rose-700">
              {error}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
