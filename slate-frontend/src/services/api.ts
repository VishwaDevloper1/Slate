import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD 
    ? "https://slate-14ju.onrender.com" // 👈 Inserted your live Render link here!
    : "http://localhost:8000", 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;