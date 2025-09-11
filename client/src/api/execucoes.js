// client/src/api/execucoes.js
import { apiFetch } from "../utils/api.js";

export const fetchExecucoes = (mesAtual) =>
  apiFetch("/execucoes/render", {
    method: "POST",
    body: JSON.stringify({ mesAtual }),
  });

export const postTarefaAvulsa = (tarefa) =>
  apiFetch("/execucoes/avulsa", {
    method: "POST",
    body: JSON.stringify(tarefa),
  });

export const gerarExecucoesMensal = (mesNovo) =>
  apiFetch("/execucoes/mensal", {
    method: "POST",
    body: JSON.stringify({ mesNovo }),
  });

export const patchExecucao = (id, data) =>
  apiFetch(`/execucoes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });

// Empresas e Pessoas
export const fetchEmpresas = () => apiFetch("/empresas");
export const fetchPessoas = () => apiFetch("/pessoas");

// Tarefas
export const fetchTarefas = (mes) =>
  apiFetch(`/tarefas?mesAtual=${mes}`);
