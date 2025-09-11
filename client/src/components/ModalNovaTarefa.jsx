import { useState } from "react";
import { Dialog } from "@headlessui/react";
import toast from "react-hot-toast";
import { useEmpresas } from "../hooks/useEmpresas";
import { useTarefas } from "../hooks/useTarefas";
import { usePessoas } from "../hooks/usePessoas";
import { useTarefaAvulsa } from "../hooks/useExecucoes";
import { getMesAtual } from "../utils/date";

export default function ModalNovaTarefa() {
  const [isOpen, setIsOpen] = useState(false);
  const [empresa, setEmpresa] = useState("");
  const [tarefa, setTarefa] = useState("");
  const [vencimento, setVencimento] = useState("");
  const [responsavel, setResponsavel] = useState("");
  const [obs, setObs] = useState("");

  const { empresas } = useEmpresas(); // hook correto para empresas
  const { tarefasUnicas } = useTarefas(); // hook tarefas
  const { pessoas } = usePessoas();
  const { addTarefa, loading } = useTarefaAvulsa();

  const [empresaFocus, setEmpresaFocus] = useState(false);
  const [tarefaFocus, setTarefaFocus] = useState(false);

  const resetForm = () => {
    setEmpresa("");
    setTarefa("");
    setVencimento("");
    setResponsavel("");
    setObs("");
  };

  const handleClose = () => {
    resetForm();
    setIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!empresa || !tarefa || !responsavel || !vencimento) {
      toast.error("Preencha todos os campos obrigatórios!");
      return;
    }

    const novaTarefa = {
      empresa_nome: empresa,
      tarefa_nome: tarefa,
      vencimento,
      responsavel_id: responsavel,
      mes_ref: getMesAtual(), // pega automaticamente o mês atual
      obs,
      status: "Em aberto"
    };

    const res = await addTarefa(novaTarefa);
    if (res.success) {
      toast.success("Tarefa adicionada!");
      handleClose();
      setTimeout(() => window.location.reload(), 200);
    } else {
      toast.error(res.message || "Erro ao adicionar tarefa");
    }
  };

  // Funções de seleção igual ao filtro
  const selectEmpresa = (valor) => {
    setEmpresa(valor);
    setEmpresaFocus(false);
  };

  const selectTarefa = (valor) => {
    setTarefa(valor);
    setTarefaFocus(false);
  };

  // Filtra as opções conforme input
  const filtroEmpresas = (empresas || []).filter(e =>
    e.nome.toLowerCase().includes(empresa.toLowerCase())
  );

  const filtroTarefas = (tarefasUnicas || []).filter(t =>
    t.toLowerCase().includes(tarefa.toLowerCase())
  );

  return (
    <div>
      <button
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        Nova Tarefa
      </button>

      <Dialog
        open={isOpen}
        onClose={handleClose}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      >
        <Dialog.Panel className="bg-gray-800 p-6 rounded-lg w-96">
          <Dialog.Title className="text-2xl text-white mb-4">Nova Tarefa</Dialog.Title>

          <form className="flex flex-col gap-3" onSubmit={handleSubmit}>

            {/* Empresa */}
            <div className="relative">
              <input
                value={empresa}
                onChange={e => setEmpresa(e.target.value)}
                onFocus={() => setEmpresaFocus(true)}
                onBlur={() => setTimeout(() => setEmpresaFocus(false), 150)}
                placeholder="Digite ou selecione a empresa"
                required
                className="p-2 rounded text-black w-full"
              />
              {empresaFocus && filtroEmpresas.length > 0 && (
                <ul className="absolute bg-white text-black w-full rounded shadow-lg max-h-40 overflow-y-auto z-10">
                  {filtroEmpresas.map(emp => (
                    <li
                      key={emp.id}
                      className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                      onMouseDown={() => selectEmpresa(emp.nome)}
                    >
                      {emp.nome}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Tarefa */}
            <div className="relative">
              <input
                value={tarefa}
                onChange={e => setTarefa(e.target.value)}
                onFocus={() => setTarefaFocus(true)}
                onBlur={() => setTimeout(() => setTarefaFocus(false), 150)}
                placeholder="Digite ou selecione a tarefa"
                required
                className="p-2 rounded text-black w-full"
              />
              {tarefaFocus && filtroTarefas.length > 0 && (
                <ul className="absolute bg-white text-black w-full rounded shadow-lg max-h-40 overflow-y-auto z-10">
                  {filtroTarefas.map(t => (
                    <li
                      key={t}
                      className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                      onMouseDown={() => selectTarefa(t)}
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Vencimento */}
            <input
              type="date"
              value={vencimento}
              onChange={e => setVencimento(e.target.value)}
              required
              className="p-2 rounded text-black w-full"
            />

            {/* Responsável */}
            <select
              value={responsavel}
              onChange={e => setResponsavel(e.target.value)}
              required
              className="p-2 rounded text-black w-full"
            >
              <option value="">Selecione o responsável</option>
              {pessoas.map(p => (
                <option key={p.id} value={p.id}>{p.nome}</option>
              ))}
            </select>

            {/* Observações */}
            <input
              type="text"
              value={obs}
              onChange={e => setObs(e.target.value)}
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
                disabled={loading}
                className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-600 text-white"
              >
                {loading ? "Salvando..." : "Adicionar"}
              </button>
            </div>

          </form>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
}
