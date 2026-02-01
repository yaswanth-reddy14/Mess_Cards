import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "import.meta.env.VITE_API_URL",
});

// ---------- REQUEST INTERCEPTOR ----------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // show loading toast ONLY if request is slow
    config._toastTimer = setTimeout(() => {
      config._loadingToast = toast.loading("Loading...");
    }, 400);

    return config;
  },
  (error) => Promise.reject(error)
);

// ---------- RESPONSE INTERCEPTOR ----------
api.interceptors.response.use(
  (response) => {
    clearTimeout(response.config._toastTimer);

    if (response.config._loadingToast) {
      toast.dismiss(response.config._loadingToast);
    }

    return response;
  },
  (error) => {
    const config = error.config || {};

    clearTimeout(config._toastTimer);

    if (config._loadingToast) {
      toast.dismiss(config._loadingToast);
    }

    // Handle auth expiry cleanly
    if (error.response?.status === 401) {
      toast.error("Session expired. Please login again.");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      window.location.href = "/login";
    } else {
      toast.error(
        error.response?.data?.detail || "Something went wrong"
      );
    }

    return Promise.reject(error);
  }
);

export default api;
