// client/src/hooks/useExecucoes.js
import { useState, useEffect, useCallback } from "react";
import { fetchExecucoes, patchExecucao, postTarefaAvulsa, gerarExecucoesMensal } from "../api/execucoes.js";

// Hook principal
export function useExecucoes(mesAtual) {
  const [execucoes, setExecucoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExecucoes(mesAtual);
      if (data.success) setExecucoes(data.data);
      else setError(data.message || "Erro ao buscar execuções");
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, [mesAtual]);

  useEffect(() => { refresh(); }, [refresh]);

  return { execucoes, loading, error, refresh };
}

// Hook para alterar execução
export function useUpdateExecucao() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateExecucao = async (id, data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await patchExecucao(id, data);
      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { updateExecucao, loading, error };
}

// Hook pra adicionar tarefa avulsa
export function useTarefaAvulsa() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addTarefa = async (tarefa) => {
    setLoading(true);
    setError(null);
    try {
      const res = await postTarefaAvulsa(tarefa);
      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { addTarefa, loading, error };
}

// Hook pra gerar execuções do mês
export function useGerarExecucoesMensal() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const gerarMes = async (mesNovo) => {
    setLoading(true);
    setError(null);
    try {
      const res = await gerarExecucoesMensal(mesNovo);
      if (!res.success) setError(res.message);
      return res;
    } catch (err) {
      setError(err.message);
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  };

  return { gerarMes, loading, error };
}
