const API_BASE = import.meta.env.VITE_API_URL; // Vite

export async function fetchExecucoes(mesAtual) {
  const res = await fetch(`${API_BASE}/execucoes/render`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesAtual }),
  });
  return res.json();
}

export async function postTarefaAvulsa(tarefa) {
  const res = await fetch(`${API_BASE}/execucoes/avulsa`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(tarefa),
  });
  return res.json();
}

export async function gerarExecucoesMensal(mesNovo) {
  const res = await fetch(`${API_BASE}/execucoes/mensal`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ mesNovo }),
  });
  return res.json();
}

export async function patchExecucao(id, data) {
  const res = await fetch(`${API_BASE}/execucoes/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}
