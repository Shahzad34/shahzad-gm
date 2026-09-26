import axios from "axios";
import { getAdminToken, setAdminToken, clearAdminToken } from "./adminAuth.js";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL,
  timeout: 10000,
});

/* ------------------------------------------------------------------ *
 * Auth plumbing
 *
 * The admin token is attached to every request; public routes simply
 * ignore the extra header. A 401 anywhere except the login call means the
 * token is missing, malformed or expired, so it is dropped and an event is
 * dispatched — the admin layout turns that into a redirect to /admin/login.
 * ------------------------------------------------------------------ */

api.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isLoginCall = (error.config?.url || "").includes("/admin/login");
    if (error.response?.status === 401 && !isLoginCall) {
      clearAdminToken();
      window.dispatchEvent(new CustomEvent("admin:unauthorized"));
    }
    return Promise.reject(error);
  }
);

/** Pulls a usable error message off an axios rejection. */
export function errorMessage(err, fallback = "Something went wrong.") {
  return err?.response?.data?.message || fallback;
}

/* ---------------- Public ---------------- */

export async function sendContactMessage(payload) {
  const { data } = await api.post("/contact", payload);
  return data;
}

export async function fetchProjects() {
  const { data } = await api.get("/projects");
  return data.data ?? [];
}

export async function fetchSkills() {
  const { data } = await api.get("/skills");
  return data.data ?? [];
}

/* ---------------- Admin ---------------- */

export async function adminLogin(credentials) {
  const { data } = await api.post("/admin/login", credentials);
  setAdminToken(data.token);
  return data;
}

/* ---- Contact messages ---- */

export async function fetchMessages() {
  const { data } = await api.get("/contact");
  return data.data ?? [];
}

export async function setMessageRead(id, read) {
  const { data } = await api.patch(`/contact/${id}/read`, { read });
  return data.data;
}

export async function deleteMessage(id) {
  const { data } = await api.delete(`/contact/${id}`);
  return data;
}

/* ---- Projects ---- */

export async function createProject(payload) {
  const { data } = await api.post("/projects", payload);
  return data.data;
}

export async function updateProject(id, payload) {
  const { data } = await api.put(`/projects/${id}`, payload);
  return data.data;
}

export async function deleteProject(id) {
  const { data } = await api.delete(`/projects/${id}`);
  return data;
}

/* ---- Skills ---- */

export async function createSkill(payload) {
  const { data } = await api.post("/skills", payload);
  return data.data;
}

export async function updateSkill(id, payload) {
  const { data } = await api.put(`/skills/${id}`, payload);
  return data.data;
}

export async function deleteSkill(id) {
  const { data } = await api.delete(`/skills/${id}`);
  return data;
}
