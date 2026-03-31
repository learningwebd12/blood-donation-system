import API from "../api/api";

export const sendContactMessage = (formData) => {
  return API.post("/contact", formData);
};
