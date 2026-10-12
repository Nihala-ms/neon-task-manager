import axios from "axios";
import { getBrowserId } from "./utils/browserId";

const API = axios.create({
  baseURL: "https://neon-task-manager-orcin.vercel.app/api",
});

API.interceptors.request.use((config) => {
  config.headers["x-browser-id"] = getBrowserId();
  return config;
});

export default API;