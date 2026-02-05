// src/services/bloodRequestService.js
import API from "./api";

// Create a new blood request
export const createRequest = (data) => API.post("/blood-request/create", data);

// Get all blood requests
export const getAllRequests = () => API.get("/blood-request/all");
