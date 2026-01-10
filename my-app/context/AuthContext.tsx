import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authService } from "../services/authService";

type AuthContextType = {
  user: any;
  loading: boolean;
  login: (data: { phone: string; password: string }) => Promise<any>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // App start auth check
  useEffect(() => {
    const initAuth = async () => {
      try {
        const res = await authService.isAuthenticated();
        if (res?.authenticated) {
          setUser(res.user);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: { phone: string; password: string }) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {  // ✅ Check res.data exists
      setUser(res.data.user);
      await AsyncStorage.setItem("showLoginToast", "true");
    }
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};