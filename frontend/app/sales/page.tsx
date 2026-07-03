import DashboardLayout from "@/components/layout/DashboardLayout";

export default function SalesPage() {
  return (
    <DashboardLayout>
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-slate-900 mb-4">Sales Intelligence</h1>
          <p className="text-2xl text-slate-500">Coming Soon</p>
          <p className="mt-4 text-slate-400">Мы работаем над этой вкладкой</p>
        </div>
      </div>
    </DashboardLayout>
  );
}