import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// ✅ REGISTER
export const registerUser = (data) => API.post("/auth/register", data);

// ✅ LOGIN
export const loginUser = (data) => API.post("/auth/login", data);

// ✅ GET PROFILE (THIS WAS MISSING)
export const getProfile = () => API.get("/profile/me");

// ✅ LOGOUT
export const logoutUser = () => {
  localStorage.removeItem("token");
};
