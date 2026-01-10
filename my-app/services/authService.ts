import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api/auth";

export const authService = {
  async login(credentials: { phone: string; password: string }) {
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data = await res.json();

      if (!res.ok) {
        return {
          success: false,
          message: data.message || "Login failed",
        };
      }

      // ✅ Save token and user to AsyncStorage
      await AsyncStorage.setItem("token", data.token);
      await AsyncStorage.setItem("user", JSON.stringify(data.user));

      return {
        success: true,
        data: {
          token: data.token,
          user: data.user,
        },
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Network error",
      };
    }
  },

  async isAuthenticated() {
    try {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (!token || !userStr) {
        return { authenticated: false };
      }

      const user = JSON.parse(userStr);

      return {
        authenticated: true,
        user,
      };
    } catch (error) {
      return { authenticated: false };
    }
  },

  async logout() {
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("user");
      await AsyncStorage.removeItem("showLoginToast");
    } catch (error) {
      console.error("Logout error:", error);
    }
  },
};