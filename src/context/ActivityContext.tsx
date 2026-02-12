import { createContext, useContext, useMemo, useState } from "react";
import type { ActivityEvent } from "../types/activity";

type LogEventInput = Omit<ActivityEvent, "id" | "createdAt"> &
  Partial<Pick<ActivityEvent, "createdAt">>;

type ActivityContextType = {
  events: ActivityEvent[];
  logEvent: (event: LogEventInput) => void;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<ActivityEvent[]>([]);

  function logEvent(event: LogEventInput) {
    const nextEvent: ActivityEvent = {
      id: `activity-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: event.createdAt ?? new Date().toISOString(),
      ...event,
    };

    setEvents((prev) => [nextEvent, ...prev]);
  }

  const value = useMemo(() => ({ events, logEvent }), [events]);

  return <ActivityContext.Provider value={value}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivity must be used within ActivityProvider");
  }
  return context;
}
