import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Flat } from "../types/flat";

type FlatContextType = {
  flats: Flat[];
  currentFlatId: string | null;
  currentFlat: Flat | null;
  createFlat: (name: string, members?: string[]) => void;
  joinFlat: (code: string) => boolean;
  leaveFlat: () => void;
  isHydrated: boolean;
};

const STORAGE_KEY = "cimerat.flat.state";

const FlatContext = createContext<FlatContextType | undefined>(undefined);

function randomCode() {
  const n = Math.floor(100 + Math.random() * 900);
  return `CIM-${n}`;
}

const seededFlat: Flat = {
  id: "flat-seed-1",
  name: "Dorm 12A",
  code: "CIM-123",
  members: ["Arber", "Mark", "Driton"],
  createdAt: new Date().toISOString(),
};

type PersistedFlatState = {
  flats: Flat[];
  currentFlatId: string | null;
};

export function FlatProvider({ children }: { children: React.ReactNode }) {
  const [flats, setFlats] = useState<Flat[]>([seededFlat]);
  const [currentFlatId, setCurrentFlatId] = useState<string | null>(seededFlat.id);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load once
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (raw) {
          const parsed = JSON.parse(raw) as PersistedFlatState;

          if (Array.isArray(parsed.flats) && typeof parsed.currentFlatId !== "undefined") {
            setFlats(parsed.flats.length > 0 ? parsed.flats : [seededFlat]);
            setCurrentFlatId(parsed.currentFlatId ?? null);
          }
        }
      } catch {
        // ignore
      } finally {
        if (mounted) setIsHydrated(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Persist on change (after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    const state: PersistedFlatState = { flats, currentFlatId };
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [flats, currentFlatId, isHydrated]);

  const currentFlat = useMemo(() => {
    return flats.find((f) => f.id === currentFlatId) ?? null;
  }, [flats, currentFlatId]);

  function createFlat(name: string, members: string[] = ["Arber", "Mark", "Driton"]) {
    const newFlat: Flat = {
      id: `flat-${Date.now()}`,
      name: name.trim() || "My Flat",
      code: randomCode(),
      members,
      createdAt: new Date().toISOString(),
    };

    setFlats((prev) => [newFlat, ...prev]);
    setCurrentFlatId(newFlat.id);
  }

  function joinFlat(code: string) {
    const clean = code.trim().toUpperCase();
    const match = flats.find((f) => f.code.toUpperCase() === clean);
    if (!match) return false;
    setCurrentFlatId(match.id);
    return true;
  }

  function leaveFlat() {
    setCurrentFlatId(null);
  }

  const value = useMemo(
    () => ({
      flats,
      currentFlatId,
      currentFlat,
      createFlat,
      joinFlat,
      leaveFlat,
      isHydrated,
    }),
    [flats, currentFlatId, currentFlat, isHydrated]
  );

  return <FlatContext.Provider value={value}>{children}</FlatContext.Provider>;
}

export function useFlat() {
  const ctx = useContext(FlatContext);
  if (!ctx) throw new Error("useFlat must be used within FlatProvider");
  return ctx;
}
