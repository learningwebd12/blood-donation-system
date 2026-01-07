import { useRouter } from 'expo-router';
import { authService } from '../services/authService';
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Check auth on app start
  useEffect(() => {
    const initAuth = async () => {
      const res = await authService.isAuthenticated();
      if (res.authenticated) setUser(res.user);
      setLoading(false);
    };
    initAuth();
  }, []);

  // Login function
  const login = async (credentials: { phone: string; password: string }) => {
    const res = await authService.login(credentials);
    if (res.success) {
      setUser(res.data.user); // ✅ update context immediately
      await AsyncStorage.setItem('showLoginToast', 'true');
      router.replace('/home'); // redirect to home
    }
    return res;
  };

  // Logout function
  const logout = async () => {
    await authService.logout();
    setUser(null); // clear context
    router.replace('/auth/login'); // redirect to login
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
