import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

// ⚠️ IMPORTANT: Replace with your actual backend URL
// For physical device: Use your computer's IP (find with ipconfig/ifconfig)
// For Android emulator: Use http://10.0.2.2:5000/api/auth
// For iOS simulator: Use http://localhost:5000/api/auth
const API_URL = "http://192.168.1.74:5000/api/auth";

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 second timeout
});

// Add token to requests automatically
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const authService = {
  // Register new user
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    bloodGroup?: string;
  }) => {
    try {
      const response = await apiClient.post("/register", userData);
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Register error:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  },

  // Login user
  login: async (credentials: { phone: string; password: string }) => {
    try {
      const response = await apiClient.post("/login", credentials);
      const { token, user } = response.data;

      // Store token and user data
      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("user", JSON.stringify(user));

      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Login error:", error.message);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  },

  // Logout user
  logout: async () => {
    try {
      console.log("🔴 Starting logout process...");
      
      // Try to call backend logout endpoint
      try {
        await apiClient.post("/logout");
        console.log("✅ Backend logout successful");
      } catch (backendError: any) {
        console.log("⚠️ Backend logout failed:", backendError.message);
        // Continue with local logout even if backend fails
      }

      // Clear AsyncStorage
      await AsyncStorage.multiRemove(["token", "user"]);
      console.log("✅ Local storage cleared");

      return { success: true, message: "Logged out successfully" };
    } catch (error: any) {
      console.error("❌ Logout error:", error.message);
      
      // Force clear storage even on error
      try {
        await AsyncStorage.clear();
      } catch (clearError) {
        console.error("Failed to clear storage:", clearError);
      }
      
      return { success: true, message: "Logged out locally" };
    }
  },

  // Check if user is authenticated
  isAuthenticated: async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const user = await AsyncStorage.getItem("user");
      
      if (!token || !user) {
        return { authenticated: false, user: null };
      }

      return { authenticated: true, user: JSON.parse(user) };
    } catch (error) {
      console.error("Auth check error:", error);
      return { authenticated: false, user: null };
    }
  },

  // Get current user
  getCurrentUser: async () => {
    try {
      const user = await AsyncStorage.getItem("user");
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Get user error:", error);
      return null;
    }
  },
};