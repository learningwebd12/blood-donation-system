import API from "../api/api";

export const getDashboardStats = () => {
  return API.get("/admin/dashboard");
};

export const getAllUsers = (params = {}) => {
  return API.get("/admin/users", { params });
};

export const deleteUser = (id) => {
  return API.delete(`/admin/users/${id}`);
};

export const getAllAdminRequests = (params = {}) => {
  return API.get("/admin/requests", { params });
};

export const deleteRequest = (id) => {
  return API.delete(`/admin/requests/${id}`);
};
