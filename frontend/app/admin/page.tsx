"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import { useState } from "react";

export default function AdminPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file) return alert("Выберите файл Excel");

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/upload/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      alert("✅ " + data.message);
    } catch (e) {
      alert("Ошибка загрузки");
    }
    setUploading(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold mb-8">Админ панель</h1>

        <div className="bg-white rounded-3xl p-12 border shadow-sm">
          <h2 className="text-2xl mb-8">Загрузка IQVIA файла</h2>
          
          <label className="block border-2 border-dashed border-slate-300 rounded-3xl p-12 text-center cursor-pointer hover:border-blue-400 transition">
            <input 
              type="file" 
              accept=".xlsx,.xls,.csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />
            <p className="text-lg">Нажмите или перетащите файл Excel</p>
            <p className="text-sm text-slate-500 mt-2">
              {file ? file.name : "Файл не выбран"}
            </p>
          </label>

          <button 
            onClick={handleUpload}
            disabled={!file || uploading}
            className="mt-8 w-full bg-blue-600 text-white py-4 rounded-2xl font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? "Загрузка..." : "Загрузить файл в систему"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}