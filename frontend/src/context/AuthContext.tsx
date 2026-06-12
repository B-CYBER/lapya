import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type AuthValue = ReturnType<typeof useAuth>;

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const value = useAuth();
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used inside <AuthProvider>");
  }
  return ctx;
}
