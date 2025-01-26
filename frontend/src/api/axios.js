import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000", 
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to attach JWT tokens
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 errors and refresh tokens
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        const response = await axios.post("http://127.0.0.1:8000/auth/jwt/refresh/", {
          refresh: refreshToken,
        });
        localStorage.setItem("access_token", response.data.access);
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${response.data.access}`;
        originalRequest.headers["Authorization"] = `Bearer ${response.data.access}`;
        return axiosInstance(originalRequest);
      } catch (err) {
        console.error("Token refresh failed:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/";
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
