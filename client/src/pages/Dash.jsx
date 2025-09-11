import { useState } from "react";
import Header from "../components/Header";
import Cards from "../components/Cards";
import ModalNovaTarefa from "../components/ModalNovaTarefa";
import FiltroTarefas from "../components/FiltroTarefas";
import FiltroStatus from "../components/FiltroStatus";
import TabelaTarefas from "../components/TabelaTarefas";
import { Toaster } from "react-hot-toast";
import { useExecucoes } from "../hooks/useExecucoes";
import { getMesAtual } from "../utils/date";
import GerarMesAdmin from "../components/GerarMesAdmin";

function Dash() {
  const mesAtual = getMesAtual(); // ajustar mês atual
  const { execucoes, loading, refresh } = useExecucoes(mesAtual);

  // Filtros
  const [filtros, setFiltros] = useState({ empresa: "", tarefa: "" });
  const [statusSelecionados, setStatusSelecionados] = useState(["Em aberto", "Urgente"]);
  const [responsavelAtivo, setResponsavelAtivo] = useState(null); // null = todos

  // Filtra execuções
  const tarefasFiltradas = execucoes.filter((t) => {
    const statusOk = statusSelecionados.includes(t.status);
    const empresaOk = !filtros.empresa || t.empresa.toLowerCase().includes(filtros.empresa.toLowerCase());
    const tarefaOk = !filtros.tarefa || t.tarefa.toLowerCase().includes(filtros.tarefa.toLowerCase());
    const responsavelOk = !responsavelAtivo || t.responsavel === responsavelAtivo;
    return statusOk && empresaOk && tarefaOk && responsavelOk;
  });

  const limparFiltros = () => {
    setFiltros({ empresa: "", tarefa: "" });
    setStatusSelecionados(["Em aberto", "Urgente"]);
  };

  return (
    <div className="bg-[#181818] min-h-screen text-white">
      <Toaster position="top-right" />

      <Header responsavelAtivo={responsavelAtivo} setResponsavelAtivo={setResponsavelAtivo} />
      <Cards tarefas={execucoes} responsavelAtivo={responsavelAtivo} />

      {/* Controles */}
      <div className="flex max-w-7xl items-center mx-auto py-4 justify-between gap-4 flex-wrap">
        <ModalNovaTarefa refresh={refresh} />
        <FiltroStatus statusAtivos={statusSelecionados} onStatusChange={setStatusSelecionados} />
        <FiltroTarefas
          placeholderEmpresa="Filtre por empresa"
          placeholderTarefa="Filtre por tarefa"
          onFilter={setFiltros}
          filtrosExterno={filtros}
        />
        <button
          onClick={limparFiltros}
          className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
        >
          Limpar filtros
        </button>
      </div>

      {/* Tabela de tarefas */}
      <div className="max-w-7xl mx-auto mt-6">
        {loading ? (
          <p>Carregando tarefas...</p>
        ) : (
          <TabelaTarefas tarefas={tarefasFiltradas} refresh={refresh} />
        )}
      </div>
      
      {/* Gerar mes admin */}
      <div className="max-w-7xl mx-auto mt-6">
        <GerarMesAdmin 
          role={localStorage.getItem("role")} 
          refresh={refresh} 
          execucoes={execucoes} // <-- passa aqui
        />
      </div>

    </div>
  );
}

export default Dash;
