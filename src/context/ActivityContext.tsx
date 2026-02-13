import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ActivityEvent } from "../types/activity";

type LogEventInput = Omit<ActivityEvent, "id" | "createdAt"> &
  Partial<Pick<ActivityEvent, "createdAt">>;

type ActivityContextType = {
  events: ActivityEvent[];
  logEvent: (event: LogEventInput) => void;
  isHydrated: boolean;
};

const STORAGE_KEY = "cimerat.activity.state";

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load once
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (raw) {
          const parsed = JSON.parse(raw) as ActivityEvent[];
          if (Array.isArray(parsed)) {
            // Basic sanity check
            if (parsed.length === 0 || (parsed[0] && typeof parsed[0].id === "string")) {
              setEvents(parsed);
            }
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
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(events)).catch(() => {});
  }, [events, isHydrated]);

  function logEvent(event: LogEventInput) {
    const nextEvent: ActivityEvent = {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: event.createdAt ?? new Date().toISOString(),
      ...event,
    };

    setEvents((prev) => [nextEvent, ...prev]);
  }

  const value = useMemo(() => ({ events, logEvent, isHydrated }), [events, isHydrated]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) throw new Error("useActivity must be used within ActivityProvider");
  return context;
}
