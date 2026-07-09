"use client";

export type DemoRole = "admin" | "user";

export type DemoUser = {
  id: string;
  login: string;
  full_name?: string;
  role: DemoRole;
  demo?: boolean;
};

const STORAGE_KEY = "pharmascope-user";

const DEMO_USERS: Array<DemoUser & { password: string }> = [
  {
    id: "demo-admin",
    login: "admin@pharmascope.local",
    password: "admin123",
    full_name: "Demo Admin",
    role: "admin",
    demo: true,
  },
  {
    id: "demo-user",
    login: "user@pharmascope.local",
    password: "user123",
    full_name: "Demo User",
    role: "user",
    demo: true,
  },
];

const LOGIN_ALIASES: Record<string, string> = {
  admin: "admin@pharmascope.local",
  user: "user@pharmascope.local",
};

function normalizeLogin(login: string) {
  const trimmed = login.trim().toLowerCase();
  return LOGIN_ALIASES[trimmed] ?? trimmed;
}

export function loginDemoUser(login: string, password: string): DemoUser | null {
  const normalized = normalizeLogin(login);
  const cleanPassword = password.trim();
  const user = DEMO_USERS.find(
    (item) => item.login.toLowerCase() === normalized && item.password === cleanPassword
  );
  if (!user) return null;
  const { password: _password, ...safeUser } = user;
  return safeUser;
}

export function readCurrentUser(): DemoUser | null {
  if (typeof window === "undefined") return null;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function saveCurrentUser(user: DemoUser) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("pharmascope-user-change"));
}

export function logoutCurrentUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new Event("pharmascope-user-change"));
}

export function isRestrictedRoute(pathname: string) {
  return pathname.startsWith("/data") || pathname.startsWith("/admin");
}

export function canAccessRoute(user: DemoUser | null, pathname: string) {
  if (!user) return pathname === "/" || pathname === "/login";
  if (user.role === "admin") return true;
  return !isRestrictedRoute(pathname);
}
