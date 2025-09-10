// hooks/usePessoas.js
import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_URL;

export function usePessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPessoas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/pessoas`);
      const data = await res.json();
      if (data.success) setPessoas(data.data);
      else setError(data.message);
    } catch (err) {
      setError(err.message || "Erro ao buscar pessoas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPessoas(); }, []);

  return { pessoas, loading, error, refresh: fetchPessoas };
}
