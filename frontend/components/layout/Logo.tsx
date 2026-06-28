import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/executive">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          PharmaScope
        </h1>

        <p className="text-sm text-slate-400">
          Pharmaceutical Intelligence Platform
        </p>
      </div>
    </Link>
  );
}