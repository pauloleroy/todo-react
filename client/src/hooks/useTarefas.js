// src/hooks/useTarefas.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { getMesAtual } from "../utils/date";
import { apiFetch } from "../utils/api.js";

export function useTarefas(mes = getMesAtual()) {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTarefas = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiFetch(`/tarefas?mesAtual=${mes}`);
      if (data.success) {
        setTarefas(data.data);
      } else {
        setError(data.message || "Erro ao buscar tarefas");
      }
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, [mes]);

  useEffect(() => {
    fetchTarefas();
  }, [fetchTarefas]);

  // Lista única de tarefas para dropdown
  const tarefasUnicas = useMemo(() => {
    return tarefas
      .map(t => t.nome)
      .sort((a, b) => a.localeCompare(b));
  }, [tarefas]);

  return { 
    tarefas,        // objetos { nome }
    tarefasUnicas,  // nomes únicos para dropdown
    loading,
    error,
    refresh: fetchTarefas
  };
}
