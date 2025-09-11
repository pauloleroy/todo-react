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

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Erro na requisição");
  return data;
}
