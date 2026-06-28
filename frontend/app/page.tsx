export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 flex">
      {/* Левая часть */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 text-white flex-col justify-center px-20">
        <h1 className="text-6xl font-bold">PharmaScope</h1>

        <p className="mt-6 text-xl text-slate-300 leading-9">
          AI-powered Pharmaceutical
          <br />
          Market Intelligence Platform
        </p>

        <div className="mt-16 space-y-5 text-slate-400">
          <p>✓ Executive Dashboards</p>
          <p>✓ Market Explorer</p>
          <p>✓ Competitive Intelligence</p>
          <p>✓ AI Insights</p>
        </div>
      </div>

      {/* Правая часть */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">

          <h2 className="text-3xl font-bold text-slate-900">
            Sign In
          </h2>

          <p className="text-slate-500 mt-2">
            Welcome to PharmaScope
          </p>

          <div className="mt-8 space-y-4">

            <input
              type="email"
              placeholder="Email"
              className="w-full border rounded-lg p-3"
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full border rounded-lg p-3"
            />

            <button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-lg py-3 font-medium"
            >
              Sign In
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}