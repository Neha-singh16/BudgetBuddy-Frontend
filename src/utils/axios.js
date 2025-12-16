import axios from "axios";

// Normalize to avoid trailing slashes that cause double-slash requests and redirects
const baseURL = (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000").replace(/\/+$/, "");
axios.defaults.baseURL = baseURL;
axios.defaults.withCredentials = true;

