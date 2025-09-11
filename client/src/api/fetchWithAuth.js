const API_BASE = import.meta.env.VITE_API_URL;

export async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();

  // Se 401, opcional: limpar token e forçar logout
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    throw new Error("Não autorizado. Faça login novamente.");
  }

  return data;
}
