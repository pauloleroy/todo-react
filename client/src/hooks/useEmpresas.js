import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/empresas`);
      const data = await res.json();
      if (data.success) setEmpresas(data.data);
      else setError(data.message);
    } catch (err) {
      setError(err.message || "Erro ao buscar empresas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmpresas(); }, []);

  return { empresas, loading, error, refresh: fetchEmpresas };
}
