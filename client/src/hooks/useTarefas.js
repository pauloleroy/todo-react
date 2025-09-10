import { useState, useEffect, useMemo } from "react";
import { getMesAtual } from "../utils/date";
const API_BASE = import.meta.env.VITE_API_URL;

export function useTarefas(mes = getMesAtual()) {
  const [tarefas, setTarefas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTarefas = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/tarefas?mesAtual=${mes}`);
      const data = await res.json();
      if (data.success) setTarefas(data.data);
      else setError(data.message || "Erro ao buscar tarefas");
    } catch (err) {
      setError(err.message || "Erro ao buscar tarefas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTarefas(); }, [mes]);

  // 👉 Lista única de tarefas para dropdown
  const tarefasUnicas = useMemo(() => {
    return tarefas
      .map(t => t.nome)  // ✅ agora usa o campo correto retornado pela API
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
