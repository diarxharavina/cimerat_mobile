import { createContext, useContext, useMemo, useState } from "react";
import type { Flat } from "../types/flat";

type FlatContextType = {
  flats: Flat[];
  currentFlatId: string | null;
  currentFlat: Flat | null;
  createFlat: (name: string) => void;
  joinFlat: (code: string) => void;
  leaveFlat: () => void;
};

const seededFlat: Flat = {
  id: "flat-dorm-12a",
  name: "Dorm 12A",
  code: "CIM-123",
  members: ["Arber", "Mark", "Driton"],
  createdAt: "2026-02-01T12:00:00.000Z",
};

const FlatContext = createContext<FlatContextType | undefined>(undefined);

function makeFlatCode() {
  return `CIM-${Math.floor(100 + Math.random() * 900)}`;
}

export function FlatProvider({ children }: { children: React.ReactNode }) {
  const [flats, setFlats] = useState<Flat[]>([seededFlat]);
  const [currentFlatId, setCurrentFlatId] = useState<string | null>(seededFlat.id);
  const currentFlat = flats.find((flat) => flat.id === currentFlatId) ?? null;

  function createFlat(name: string) {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const newFlat: Flat = {
      id: `flat-${Date.now()}`,
      name: trimmedName,
      code: makeFlatCode(),
      members: ["Arber", "Mark", "Driton"],
      createdAt: new Date().toISOString(),
    };

    setFlats((prev) => [newFlat, ...prev]);
    setCurrentFlatId(newFlat.id);
  }

  function joinFlat(code: string) {
    const normalizedCode = code.trim().toUpperCase();
    if (!normalizedCode) return;

    const found = flats.find((flat) => flat.code.toUpperCase() === normalizedCode);
    if (found) {
      setCurrentFlatId(found.id);
    }
  }

  function leaveFlat() {
    setCurrentFlatId(null);
  }

  const value = useMemo(
    () => ({ flats, currentFlatId, currentFlat, createFlat, joinFlat, leaveFlat }),
    [flats, currentFlatId, currentFlat]
  );

  return <FlatContext.Provider value={value}>{children}</FlatContext.Provider>;
}

export function useFlat() {
  const context = useContext(FlatContext);
  if (!context) {
    throw new Error("useFlat must be used within FlatProvider");
  }
  return context;
}
