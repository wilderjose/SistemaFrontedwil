import axios from "axios";

// Detecta automáticamente si la app corre en tu PC (development) o en internet (production)
const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";

const api = axios.create({
  // Si estás en tu PC usa localhost, si estás en internet usa tu backend de Render
  baseURL: isLocal 
    ? "http://127.0.0.1:8000/api/" 
    : "https://hotel-backend-zzae.onrender.com/api/",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  console.log("TOKEN:", token);

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default api;