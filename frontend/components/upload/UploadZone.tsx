"use client";

export default function UploadZone() {
  return (
    <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">

      <h2 className="text-2xl font-semibold text-slate-900">
        Upload Data
      </h2>

      <p className="mt-3 text-slate-500">
        Drag & Drop IQVIA, Secondary Sales or Reference Price files here
      </p>

      <button className="mt-8 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
        Select File
      </button>

    </div>
  );
}