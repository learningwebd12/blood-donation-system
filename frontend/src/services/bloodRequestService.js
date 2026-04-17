import API from "../api/api";

// Fetch all requests
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

// Donor marks donated
export const markAsDonated = (requestId) => {
  return API.patch(`/blood-request/mark-donated/${requestId}`);
};

// Requester confirms blood received
export const confirmBloodReceived = (requestId) => {
  return API.patch(`/blood-request/confirm-received/${requestId}`);
};

// Donor completed history
export const getMyAcceptedRequests = () => {
  return API.get("/blood-request/my-accepted");
};

// Requester own requests
export const getMyRequests = () => {
  return API.get("/blood-request/my-requests");
};
