import API from "../api/api";

// Complete profile
export const completeProfile = (data) => {
  return API.post("/profile/complete", data);
};

// Get current profile
export const getProfile = () => {
  return API.get("/profile/me");
};

// Get provinces & districts
export const getLocationData = () => {
  return API.get("/profile/locations");
};
