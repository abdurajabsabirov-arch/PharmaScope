"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";

export type DraggableKpiItem = {
  id: string;
  content: ReactNode;
};

type DraggableKpiGridProps = {
  items: DraggableKpiItem[];
  storageKey: string;
  className: string;
};

export default function DraggableKpiGrid({ items, storageKey, className }: DraggableKpiGridProps) {
  const defaultOrder = useMemo(() => items.map((item) => item.id), [items]);
  const [order, setOrder] = useState<string[]>(defaultOrder);
  const [draggedId, setDraggedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (!saved) {
        setOrder(defaultOrder);
        return;
      }
      const parsed = JSON.parse(saved) as string[];
      setOrder([...parsed.filter((id) => defaultOrder.includes(id)), ...defaultOrder.filter((id) => !parsed.includes(id))]);
    } catch {
      setOrder(defaultOrder);
    }
  }, [defaultOrder.join("|"), storageKey]);

  const orderedItems = useMemo(() => {
    const byId = new Map(items.map((item) => [item.id, item]));
    return order.map((id) => byId.get(id)).filter(Boolean) as DraggableKpiItem[];
  }, [items, order]);

  const moveItem = (targetId: string) => {
    if (!draggedId || draggedId === targetId) return;
    setOrder((current) => {
      const next = [...current];
      const from = next.indexOf(draggedId);
      const to = next.indexOf(targetId);
      if (from < 0 || to < 0) return current;
      next.splice(from, 1);
      next.splice(to, 0, draggedId);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {
        // Local storage is optional; drag ordering still works for this session.
      }
      return next;
    });
  };

  return (
    <div className={className}>
      {orderedItems.map((item) => (
        <div
          key={item.id}
          draggable
          onDragStart={() => setDraggedId(item.id)}
          onDragOver={(event) => {
            event.preventDefault();
            moveItem(item.id);
          }}
          onDragEnd={() => setDraggedId(null)}
          className={`cursor-grab active:cursor-grabbing ${draggedId === item.id ? "opacity-60" : ""}`}
          title="Drag to reorder"
        >
          {item.content}
        </div>
      ))}
    </div>
  );
}
