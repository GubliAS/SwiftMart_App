import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  token: string | null;
  role: string | null;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getRoleFromToken(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded: any = jwtDecode(token);
    // Adjust this if your JWT uses a different claim for role
    return decoded.role || decoded.roles?.[0] || null;
  } catch {
    return null;
  }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    SecureStore.getItemAsync("token").then((storedToken) => {
      setToken(storedToken);
      setRole(getRoleFromToken(storedToken));
    });
  }, []);

  const login = async (newToken: string) => {
    await SecureStore.setItemAsync("token", newToken);
    setToken(newToken);
    setRole(getRoleFromToken(newToken));
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync("token");
    setToken(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ token, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}; 