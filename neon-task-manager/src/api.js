
import axios from "axios";

const API = axios.create({
  baseURL: "https://neon-task-manager-8j5mv22um-nihala-ms-projects.vercel.app/api",
});

export default API;
