"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { createUser, fetchUsers, type UserInfo } from "@/app/dashboard/lib/api";
import { useLanguage } from "@/lib/i18n";

export default function AdminPage() {
  const { isRu } = useLanguage();
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [newUser, setNewUser] = useState({ full_name: "", login: "", password: "", role: "user" as "admin" | "user" });
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    try {
      const response = await fetchUsers();
      setUsers(response.users ?? []);
    } catch {
      setError(isRu ? "Не удалось загрузить пользователей." : "Could not load users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async () => {
    setBusy(true);
    setMessage(null);
    setError(null);

    try {
      await createUser(newUser);
      setMessage(isRu ? `Пользователь ${newUser.login} создан.` : `User ${newUser.login} created.`);
      setNewUser({ full_name: "", login: "", password: "", role: "user" });
      await loadUsers();
    } catch {
      setError(isRu ? "Не удалось создать пользователя. Проверьте логин и пароль." : "Could not create user. Login may already exist or password is too short.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{isRu ? "Администрирование" : "Administration"}</h1>
          <p className="mt-2 text-sm text-slate-500">
            {isRu ? "Создание пользователей и назначение ролей доступа." : "Create users and assign access roles."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900">{isRu ? "Пользователи и роли" : "Users & Roles"}</h2>
          <p className="mt-1 text-sm text-slate-500">
            {isRu ? "Администраторы управляют файлами и пользователями. Обычные пользователи работают с аналитикой." : "Admins manage files and users. Standard users work with analytics."}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_1fr_150px_140px]">
            <input
              value={newUser.full_name}
              onChange={(event) => setNewUser((current) => ({ ...current, full_name: event.target.value }))}
              placeholder={isRu ? "Имя и фамилия" : "Full name"}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
            <input
              value={newUser.login}
              onChange={(event) => setNewUser((current) => ({ ...current, login: event.target.value }))}
              placeholder={isRu ? "Логин" : "Login"}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
            <input
              value={newUser.password}
              onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))}
              placeholder={isRu ? "Пароль" : "Password"}
              type="password"
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-blue-500"
            />
            <select
              value={newUser.role}
              onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value as "admin" | "user" }))}
              className="h-11 rounded-lg border border-slate-200 px-3 text-sm font-semibold outline-none focus:border-blue-500"
            >
              <option value="user">{isRu ? "Пользователь" : "User"}</option>
              <option value="admin">{isRu ? "Администратор" : "Admin"}</option>
            </select>
            <button
              onClick={handleCreateUser}
              disabled={busy || !newUser.login || !newUser.password}
              className="h-11 rounded-lg bg-slate-900 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isRu ? "Добавить" : "Add user"}
            </button>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-500">
                  <th className="pb-3">{isRu ? "Имя" : "Name"}</th>
                  <th className="pb-3">{isRu ? "Логин" : "Login"}</th>
                  <th className="pb-3">{isRu ? "Роль" : "Role"}</th>
                  <th className="pb-3">{isRu ? "Создан" : "Created"}</th>
                  <th className="pb-3">{isRu ? "Статус" : "Status"}</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-100 last:border-0">
                    <td className="py-3 font-semibold text-slate-900">{user.full_name ?? user.login}</td>
                    <td className="py-3 font-semibold text-slate-900">{user.login}</td>
                    <td className="py-3 text-slate-600">{user.role === "admin" && isRu ? "Администратор" : user.role === "user" && isRu ? "Пользователь" : user.role}</td>
                    <td className="py-3 text-slate-600">{user.created_at ? user.created_at.replace("T", " ") : "-"}</td>
                    <td className="py-3 text-slate-600">{user.active ? (isRu ? "Активен" : "Active") : (isRu ? "Отключен" : "Disabled")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!users.length && <div className="py-8 text-center text-sm text-slate-500">{isRu ? "Пользователи еще не созданы." : "No users created yet."}</div>}
          </div>
        </div>

        {message && <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">{message}</div>}
        {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm font-medium text-rose-700">{error}</div>}
      </div>
    </DashboardLayout>
  );
}
