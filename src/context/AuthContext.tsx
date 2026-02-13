import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

export type UserName = "Arber" | "Mark" | "Driton";

type AuthContextType = {
  currentUser: UserName;
  setCurrentUser: (user: UserName) => void;
  isHydrated: boolean; // true after we load from storage
};

const STORAGE_KEY = "cimerat.auth.currentUser";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUserState] = useState<UserName>("Driton");
  const [isHydrated, setIsHydrated] = useState(false);

  // Load once on app start
  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (!mounted) return;

        if (stored === "Arber" || stored === "Mark" || stored === "Driton") {
          setCurrentUserState(stored);
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
    AsyncStorage.setItem(STORAGE_KEY, currentUser).catch(() => {});
  }, [currentUser, isHydrated]);

  const value = useMemo(
    () => ({
      currentUser,
      setCurrentUser: setCurrentUserState,
      isHydrated,
    }),
    [currentUser, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
