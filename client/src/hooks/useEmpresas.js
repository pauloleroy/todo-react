// src/hooks/useEmpresas.js
import { useState, useEffect } from "react";
import { apiFetch } from "../utils/api.js";

export function useEmpresas() {
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEmpresas = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch("/empresas"); // apiFetch já envia o token
      if (data.success) {
        setEmpresas(data.data);
      } else {
        setError(data.message || "Erro ao buscar empresas");
      }
    } catch (err) {
      setError(err.message || "Erro ao buscar empresas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmpresas();
  }, []);

  return { empresas, loading, error, refresh: fetchEmpresas };
}

