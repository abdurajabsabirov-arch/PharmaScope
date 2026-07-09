"use client";

import { useState } from "react";
import { loginUser } from "@/app/dashboard/lib/api";
import { loginDemoUser, saveCurrentUser } from "@/lib/demoAuth";

export default function Home() {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    const cleanLogin = login.trim();
    const cleanPassword = password.trim();

    if (!cleanLogin || !cleanPassword) {
      setError("Enter login and password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const demoUser = loginDemoUser(cleanLogin, cleanPassword);
      if (demoUser) {
        saveCurrentUser(demoUser);
        window.location.assign("/market");
        return;
      }

      const response = await loginUser({ login: cleanLogin, password: cleanPassword });
      saveCurrentUser(response.user);
      window.location.assign("/market");
    } catch (error) {
      if (error instanceof TypeError) {
        setError("Cannot reach the backend. Start it with: npm run backend:dev");
        return;
      }
      setError("Invalid login or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen bg-slate-100">
      <div className="hidden w-1/2 flex-col justify-center bg-slate-900 px-20 text-white lg:flex">
        <h1 className="text-6xl font-bold">PharmaScope</h1>

        <p className="mt-6 text-xl leading-9 text-slate-300">
          Pharmaceutical
          <br />
          Market Intelligence Platform
        </p>

        <div className="mt-16 space-y-5 text-slate-400">
          <p>Market Intelligence</p>
          <p>Data Management</p>
          <p>User Roles</p>
          <p>AI Insights</p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-md rounded-2xl bg-white p-10 shadow-xl">
          <h2 className="text-3xl font-bold text-slate-900">Sign In</h2>

          <p className="mt-2 text-slate-500">Welcome to PharmaScope</p>

          <div className="mt-8 space-y-4">
            <input
              value={login}
              onChange={(event) => setLogin(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleLogin();
              }}
              type="text"
              placeholder="Login"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") handleLogin();
              }}
              type="password"
              placeholder="Password"
              className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
            />

            <button
              onClick={handleLogin}
              disabled={!login || !password || loading}
              className="w-full rounded-lg bg-slate-900 py-3 font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {error && (
              <div className="rounded-lg border border-rose-100 bg-rose-50 p-3 text-sm font-medium text-rose-700">
                {error}
              </div>
            )}

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
              <p className="font-bold text-slate-900">Demo credentials</p>
              <p className="mt-1">Admin: admin@pharmascope.local / admin123</p>
              <p>User: user@pharmascope.local / user123</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
