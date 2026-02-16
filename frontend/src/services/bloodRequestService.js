import API from "../api/api"; // your axios instance

// Fetch all requests (optionally filtered by lat, lon, province)
export const getAllRequests = (lat, lon, province) => {
  const params = {};
  if (lat) params.lat = lat;
  if (lon) params.lon = lon;
  if (province) params.province = province;

  return API.get("/blood-request/all", { params });
};

// Receiver creates a new request
export const createRequest = (requestData) => {
  return API.post("/blood-request/create", requestData);
};

// Donor accepts a request
export const acceptRequest = (requestId) => {
  return API.patch(`/blood-request/accept/${requestId}`);
};

// Donor completes a request
export const completeRequest = (requestId) => {
  return API.patch(`/blood-request/complete/${requestId}`);
};
