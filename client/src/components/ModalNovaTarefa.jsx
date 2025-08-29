import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { todasTarefas, responsaveis } from "../data/fakeDB";
import toast from "react-hot-toast";

export default function ModalNovaTarefa() {
  const [isOpen, setIsOpen] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [tarefa, setTarefa] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [mesRef, setMesRef] = useState(""); // obrigatório
  const [obs, setObs] = useState("");       // opcional

  // Arrays únicos
  const empresasUnicas = [...new Set(todasTarefas.map(t => t.empresa))];
  const tarefasUnicas = [...new Set(todasTarefas.map(t => t.tarefa))];

  const [empresasFiltradas, setEmpresasFiltradas] = useState(empresasUnicas);
  const [tarefasFiltradas, setTarefasFiltradas] = useState(tarefasUnicas);

  const handleEmpresaChange = (e) => {
    const valor = e.target.value;
    setEmpresa(valor);
    setEmpresasFiltradas(
      empresasUnicas.filter(emp => emp.toLowerCase().includes(valor.toLowerCase()))
    );
  };

  const handleTarefaChange = (e) => {
    const valor = e.target.value;
    setTarefa(valor);
    setTarefasFiltradas(
      tarefasUnicas.filter(t => t.toLowerCase().includes(valor.toLowerCase()))
    );
  };

  const resetForm = () => {
    setEmpresa("");
    setTarefa("");
    setVencimento("");
    setResponsavel("");
    setMesRef("");
    setObs("");
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validação básica
    if (!empresa || !tarefa || !responsavel || !mesRef || !vencimento) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    // Validar mesRef (AAAA-MM)
    if (!/^\d{4}-\d{2}$/.test(mesRef)) {
      alert("Mês referência inválido! Use o formato AAAA-MM.");
      return;
    }

    // Validar vencimento
    const dataVenc = new Date(vencimento);
    if (isNaN(dataVenc.getTime())) {
      alert("Data de vencimento inválida!");
      return;
    }

    // Criar objeto da nova tarefa
    const novaTarefa = {
      empresa,
      tarefa,
      vencimento: dataVenc.toISOString().slice(0, 10), // YYYY-MM-DD
      responsavel,
      mesRef,
      obs,
      status: "Em aberto",
    };

    console.log("Nova tarefa:", novaTarefa);
    toast.success("Tarefa adicionada!", {
      duration: 3000,
      style: { background: "#22c55e", color: "#fff" },
    });

    // Resetar campos e fechar modal
    resetForm();
    setIsOpen(false);
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Nova Tarefa
      </button>

      <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <Dialog.Panel className="bg-gray-800 p-6 rounded-lg w-96">
          <Dialog.Title className="text-2xl text-white mb-4">Nova Tarefa</Dialog.Title>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
            {/* Input empresa */}
            <div className="relative">
              <input
                value={empresa}
                onChange={handleEmpresaChange}
                placeholder="Digite ou selecione a empresa"
                required
                className="p-2 rounded text-black w-full"
              />
              {empresa && empresasFiltradas.length > 0 && (
                <ul className="absolute bg-white text-black w-full rounded shadow-lg max-h-40 overflow-y-auto z-10">
                  {empresasFiltradas.map((emp) => (
                    <li
                      key={emp}
                      className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                      onClick={() => setEmpresa(emp)}
                    >
                      {emp}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Input tarefa */}
            <div className="relative">
              <input
                value={tarefa}
                onChange={handleTarefaChange}
                placeholder="Digite ou selecione a tarefa"
                required
                className="p-2 rounded text-black w-full"
              />
              {tarefa && tarefasFiltradas.length > 0 && (
                <ul className="absolute bg-white text-black w-full rounded shadow-lg max-h-40 overflow-y-auto z-10">
                  {tarefasFiltradas.map((t) => (
                    <li
                      key={t}
                      className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                      onClick={() => setTarefa(t)}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Input mês referência */}
            <input
              type="month"
              value={mesRef}
              onChange={(e) => setMesRef(e.target.value)}
              required
              placeholder="AAAA-MM"
              className="p-2 rounded text-black w-full"
            />

            {/* Input vencimento */}
            <input
              type="date"
              value={vencimento}
              onChange={(e) => setVencimento(e.target.value)}
              required
              className="p-2 rounded text-black w-full"
            />

            {/* Select responsável */}
            <select
              value={responsavel}
              onChange={(e) => setResponsavel(e.target.value)}
              required
              className="p-2 rounded text-black w-full"
            >
              <option value="">Selecione o responsável</option>
              {responsaveis.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>

            {/* Input obs opcional */}
            <input
              type="text"
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              placeholder="Observações (opcional)"
              className="p-2 rounded text-black w-full"
            />

            <div className="flex justify-end gap-2 mt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                Adicionar
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
