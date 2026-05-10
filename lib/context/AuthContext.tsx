"use client";

import type { PembeliUser } from "@/lib/types";
import React, { createContext, useCallback, useContext, useState } from "react";

interface AuthContextType {
  user: PembeliUser | null;
  setUser: (user: PembeliUser | null) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<PembeliUser | null>(null);
  const [loading, setLoading] = useState(false);

  const logout = useCallback(() => {
    setUser(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("sk_current_user");
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
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
