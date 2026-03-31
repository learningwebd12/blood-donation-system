import API from "../api/api";

export const getAllContactMessages = () => {
  return API.get("/contact");
};

export const deleteContactMessage = (id) => {
  return API.delete(`/contact/${id}`);
};
