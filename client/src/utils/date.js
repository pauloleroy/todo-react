// utils/date.js
export function getMesAtual() {
  const hoje = new Date();
  // Garante que é o primeiro dia do mês
  const mesAtual = new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  // Retorna em formato YYYY-MM-DD
  return mesAtual.toISOString().slice(0, 10);
}
// utils/date.js
export function formatMesRef(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d)) return value;
  const ano = d.getFullYear();
  const mes = String(d.getMonth() + 1).padStart(2, "0");
  return `${ano}-${mes}`; // YYYY-MM
}


export function formatVencimento(value) {
  if (!value) return "";
  return value.slice(0, 10); // pega apenas YYYY-MM-DD
}