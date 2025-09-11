// src/hooks/usePessoas.js
import { useState, useEffect, useCallback } from "react";
import { apiFetch } from "../utils/api.js"; // envia token automaticamente

export function usePessoas() {
  const [pessoas, setPessoas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPessoas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/pessoas");
      if (data.success) {
        setPessoas(data.data);
      } else {
        setError(data.message || "Erro ao buscar pessoas");
      }
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPessoas();
  }, [fetchPessoas]);

  return { pessoas, loading, error, refresh: fetchPessoas };
}
