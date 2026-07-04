import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/market">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          PharmaScope
        </h1>

        <p className="text-xs text-slate-400">
          Market Intelligence Platform
        </p>
      </div>
    </Link>
  );
}
