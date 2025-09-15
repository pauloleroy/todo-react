// utils/date.js
export function getMesAtual() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}-01`; // primeiro dia do mês local
}

// utils/date.js
export function formatMesRef(value) {
  if (!value) return "";
  // assume value no formato YYYY-MM-DD
  const [ano, mes] = value.split("-");
  return `${ano}-${mes}`;
}



export function formatVencimento(value) {
  if (!value) return "";
  return value.slice(0, 10); // pega apenas YYYY-MM-DD
}