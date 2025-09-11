import { useState } from "react";
import { useGerarExecucoesMensal } from "../hooks/useExecucoes";
import toast from "react-hot-toast";

function GerarMesAdmin({ role, refresh, execucoes }) {
  const [mes, setMes] = useState("");
  const { gerarMes, loading } = useGerarExecucoesMensal();

  if (role !== "admin") return null;

  const handleGerar = async () => {
    // valida formato YYYY-MM
    if (!/^\d{4}-\d{2}$/.test(mes)) {
      toast.error("Formato inválido! Use YYYY-MM");
      return;
    }

    const mesAtual = new Date();
    const mesSelecionado = new Date(`${mes}-01`);

    // validar mês passado
    if (
      mesSelecionado.getFullYear() < mesAtual.getFullYear() ||
      (mesSelecionado.getFullYear() === mesAtual.getFullYear() &&
        mesSelecionado.getMonth() < mesAtual.getMonth())
    ) {
      if (!window.confirm("Você está tentando gerar um mês passado. Tem certeza?")) return;
    }

    // validar duplicado
    const mesesExistentes = (execucoes || []).map(t => t.mes_ref.slice(0, 7));
    if (mesesExistentes.includes(mes)) {
      if (!window.confirm("Tarefas desse mês já existem. Quer gerar novamente?")) return;
    }

    const res = await gerarMes(`${mes}-01`);
    if (res.success) {
      toast.success(`Tarefas do mês ${mes} geradas!`);
      refresh();
      setMes("");
    } else {
      toast.error(res.message || "Erro ao gerar tarefas");
    }
  };

  return (
    <div className="max-w-7xl mx-auto mt-6 flex gap-2 items-center">
      <input
        type="month"
        value={mes}
        onChange={(e) => setMes(e.target.value)}
        className="p-2 rounded text-black"
        placeholder="YYYY-MM"
      />
      <button
        onClick={handleGerar}
        disabled={loading}
        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
      >
        {loading ? "Gerando..." : "Gerar mês"}
      </button>
    </div>
  );
}

export default GerarMesAdmin;
