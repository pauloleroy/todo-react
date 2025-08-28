import { useState } from "react";
import Header from "./components/Header";
import Cards from "./components/Cards";
import ModalNovaTarefa from "./components/ModalNovaTarefa";
import FiltroTarefas from "./components/FiltroTarefas";
import FiltroStatus from "./components/FiltroStatus";
import { todasTarefas } from "./data/fakeDB";
import TabelaTarefas from "./components/TabelaTarefas";

function App() {
  // Filtros de empresa e tarefa
  const [filtros, setFiltros] = useState({ empresa: "", tarefa: "" });

  // Filtros de status
  const [statusSelecionados, setStatusSelecionados] = useState(["Em aberto", "Urgente"]);

  // Responsáveis
  const [responsavelAtivo, setResponsavelAtivo] = useState(null); // null = todos

  // Filtro das tarefas
  const tarefasFiltradas = todasTarefas.filter((t) => {
    const statusOk = statusSelecionados.includes(t.status);
    const empresaOk = !filtros.empresa || t.empresa.toLowerCase().includes(filtros.empresa.toLowerCase());
    const tarefaOk = !filtros.tarefa || t.tarefa.toLowerCase().includes(filtros.tarefa.toLowerCase());
    const responsavelOk = !responsavelAtivo || t.responsavel === responsavelAtivo;
    return statusOk && empresaOk && tarefaOk && responsavelOk;
  });

  // Limpar filtros (status e empresa)
  const limparFiltros = () => {
    setFiltros({ empresa: "", tarefa: "" });
    setStatusSelecionados(["Em aberto", "Urgente"]); // padrão inicial
  };
  console.log("[App] filtros:", filtros);
  console.log("[App] statusSelecionados:", statusSelecionados);
  console.log("[App] responsavelAtivo:", responsavelAtivo);
  console.log("[App] tarefasFiltradas length:", tarefasFiltradas.length);
  console.log("[App] tarefasFiltradas sample:", tarefasFiltradas.slice(0, 2));


  return (
    <div className="bg-[#181818] min-h-screen text-white">
      <Header
        responsavelAtivo={responsavelAtivo}
        setResponsavelAtivo={setResponsavelAtivo}
      />
      
      <Cards tarefas={todasTarefas} responsavelAtivo={responsavelAtivo} />

      {/* Controles */}
      <div className="flex max-w-7xl items-center mx-auto py-4 justify-between gap-4 flex-wrap">
        <ModalNovaTarefa />
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
        <TabelaTarefas tarefas={tarefasFiltradas} />
      </div>
    </div>
  );
}

export default App;
