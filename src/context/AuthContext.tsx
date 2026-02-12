import { createContext, useContext, useState } from "react";

export type AuthUser = "Arber" | "Mark" | "Driton";

type AuthContextType = {
  currentUser: AuthUser;
  setCurrentUser: (user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<AuthUser>("Driton");

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
