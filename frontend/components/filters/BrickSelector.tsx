"use client";

const bricks = [
  "All Bricks",
  "Tashkent City",
  "Chilanzar",
  "Yunusabad",
  "Mirzo Ulugbek",
  "Karshi",
  "Shahrisabz",
  "Samarkand City",
  "Kattakurgan",
  "Bukhara City",
  "Gijduvan",
];

export default function BrickSelector() {
  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-slate-600">
        Brick
      </span>

      <select className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium shadow-sm hover:border-blue-500">

        {bricks.map((brick) => (
          <option key={brick} value={brick}>
            {brick}
          </option>
        ))}

      </select>
    </div>
  );
}