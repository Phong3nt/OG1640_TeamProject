// src/utils/axios.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  console.log("Token in localStorage:", localStorage.getItem("token"));
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});

export default api;