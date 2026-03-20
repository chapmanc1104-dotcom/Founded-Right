import { useState, useEffect } from "react";

export function useLocalChecklist() {
  const [completedItems, setCompletedItems] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem("bizlaunch_checklist");
      return stored ? new Set(JSON.parse(stored)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem("bizlaunch_checklist", JSON.stringify(Array.from(completedItems)));
  }, [completedItems]);

  const toggleItem = (id: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const resetChecklist = () => setCompletedItems(new Set());

  return {
    completedItems,
    toggleItem,
    resetChecklist,
  };
}
