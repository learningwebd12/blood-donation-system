// src/services/bloodRequestService.js
import API from "./api";

// Get all blood requests with optional lat/lon and province filter
export const getAllRequests = (lat = null, lon = null, province = null) => {
  let url = "/blood-request/all?";

  if (lat && lon) url += `lat=${lat}&lon=${lon}&`;
  if (province) url += `province=${province}`;

  return API.get(url);
};

// Create a new blood request
export const createRequest = (data) => API.post("/blood-request/create", data);
