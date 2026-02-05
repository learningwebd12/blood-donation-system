import { createContext, useContext, useEffect, useState } from "react";
import { getProfile, logoutUser } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
