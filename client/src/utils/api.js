// src/utils/api.js
const API_BASE = import.meta.env.VITE_API_URL;

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : undefined,
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    cache: "no-store", // força sempre buscar do servidor
  });

  // Se não autorizado, limpa token e redireciona para login
  if (res.status === 401) {
    localStorage.removeItem("token");
    window.location.href = "/login";
    return;
  }

  const data = await res.json();

  // Lança erro caso não seja ok (não 401)
  if (!res.ok) throw new Error(data.message || "Erro na requisição");

  return data;
}
