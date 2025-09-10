import { useState, useEffect } from "react";
import { useEmpresas } from "../hooks/useEmpresas";
import { useTarefas } from "../hooks/useTarefas";

export default function FiltroTarefas({
  placeholderEmpresa = "Selecione a empresa",
  placeholderTarefa = "Selecione a tarefa",
  onFilter,
  filtrosExterno
}) {
  const [empresaFocus, setEmpresaFocus] = useState(false);
  const [tarefaFocus, setTarefaFocus] = useState(false);

  // 👇 usa os hooks para pegar dados do back
  const { empresas } = useEmpresas();
  const { tarefas } = useTarefas();

  // Estados internos vinculados ao filtro externo
  const [empresa, setEmpresa] = useState(filtrosExterno?.empresa || "");
  const [tarefa, setTarefa] = useState(filtrosExterno?.tarefa || "");

  // Sincroniza quando filtros externos mudam
  useEffect(() => {
    setEmpresa(filtrosExterno?.empresa || "");
    setTarefa(filtrosExterno?.tarefa || "");
  }, [filtrosExterno?.empresa, filtrosExterno?.tarefa]);

  // Filtra as opções conforme input do usuário
  const filtroEmpresas = (empresas || []).filter(emp =>
    emp.nome.toLowerCase().includes(empresa.toLowerCase())
  );

  const filtroTarefas = (tarefas || []).filter(t =>
    t.nome.toLowerCase().includes(tarefa.toLowerCase())
  );

  const selectEmpresa = (valor) => {
    setEmpresa(valor);
    if (onFilter) onFilter({ empresa: valor, tarefa });
    setEmpresaFocus(false);
  };

  const selectTarefa = (valor) => {
    setTarefa(valor);
    if (onFilter) onFilter({ empresa, tarefa: valor });
    setTarefaFocus(false);
  };

  return (
    <div className="flex gap-4 items-end">
      {/* Dropdown Empresa */}
      <div className="relative w-1/2">
        <input
          type="text"
          value={empresa}
          onChange={e => {
            setEmpresa(e.target.value);
            if (onFilter) onFilter({ empresa: e.target.value, tarefa });
          }}
          onFocus={() => setEmpresaFocus(true)}
          onBlur={() => setTimeout(() => setEmpresaFocus(false), 150)}
          placeholder={placeholderEmpresa}
          className="p-2 rounded w-full border border-gray-400 bg-white text-black"
        />
        {empresaFocus && filtroEmpresas.length > 0 && (
          <ul className="absolute bg-white text-black w-full rounded shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
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

      {/* Dropdown Tarefa */}
      <div className="relative w-1/2">
        <input
          type="text"
          value={tarefa}
          onChange={e => {
            setTarefa(e.target.value);
            if (onFilter) onFilter({ empresa, tarefa: e.target.value });
          }}
          onFocus={() => setTarefaFocus(true)}
          onBlur={() => setTimeout(() => setTarefaFocus(false), 150)}
          placeholder={placeholderTarefa}
          className="p-2 rounded w-full border border-gray-400 bg-white text-black"
        />
        {tarefaFocus && filtroTarefas.length > 0 && (
          <ul className="absolute bg-white text-black w-full rounded shadow-lg mt-1 max-h-40 overflow-y-auto z-10">
            {filtroTarefas.map(t => (
              <li
                key={t.id}
                className="p-2 hover:bg-blue-500 hover:text-white cursor-pointer"
                onMouseDown={() => selectTarefa(t.nome)}
              >
                {t.nome}
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
