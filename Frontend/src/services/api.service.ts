import axios from "axios";
import { API_BASE } from "../config";

// Axios instance configured to talk directly to the Flask API
// Backend responses are standardized as: { data, error }
const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
  withCredentials: false,
});

// Response interceptor: unwraps { data, error } and throws on error
api.interceptors.response.use(
  (response) => {
    const payload = response?.data;
    if (payload && typeof payload === "object" && "error" in payload) {
      if (payload.error) {
        return Promise.reject(new Error(String(payload.error)));
      }
      return payload.data;
    }
    // Fallback: return raw data if payload isn't in the standard shape
    return response.data;
  },
  (error) => {
    if (error.response) {
      console.error(
        "API Error Response:",
        error.response.status,
        error.response.data
      );
      const serverPayload = error.response.data;
      if (
        serverPayload &&
        typeof serverPayload === "object" &&
        "error" in serverPayload
      ) {
        return Promise.reject(
          new Error(
            String(serverPayload.error || `HTTP ${error.response.status}`)
          )
        );
      }
      return Promise.reject(new Error(`HTTP ${error.response.status}`));
    } else if (error.request) {
      console.error("API No Response (network/connectivity)", error.request);
      return Promise.reject(
        new Error("No response from server. Check connectivity / CORS.")
      );
    } else {
      console.error("API Error Message:", error.message);
      return Promise.reject(new Error(error.message || "Unknown client error"));
    }
  }
);

export default api;
