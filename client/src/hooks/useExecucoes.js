import { useState, useEffect, useCallback } from "react";
import {
  fetchExecucoes,
  postTarefaAvulsa,
  gerarExecucoesMensal,
  patchExecucao
} from "../api/execucoes";

// Hook principal para pegar execuções do mês
export function useExecucoes(mesAtual) {
  const [execucoes, setExecucoes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchExecucoes(mesAtual);
      console.log("Dados recebidos do backend:", data);
      if (data.success) setExecucoes(data.data);
      else setError(data.message || "Erro ao buscar execuções");
    } catch (err) {
      setError(err.message || "Erro inesperado");
    } finally {
      setLoading(false);
    }
  }, [mesAtual]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return { execucoes, loading, error, refresh: fetchData };
}

// Hook para atualizar execução individual
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

// Hook para criar tarefa avulsa
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

// Hook para gerar execuções do mês
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
