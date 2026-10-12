
import axios from "axios";

const API = axios.create({
  baseURL: "https://neon-task-manager-orcin.vercel.app/api",
});

export default API;
