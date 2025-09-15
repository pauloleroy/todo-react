import { useState, useEffect } from "react";

export default function FiltroStatus({ statusAtivos, onStatusChange }) {
  // Status disponíveis
  const statusOptions = [
    { label: "Em aberto", color: "bg-blue-500" },
    { label: "Urgente", color: "bg-[#ffb86b]" },
    { label: "Concluído", color: "bg-green-500" },
  ];

  // Estado interno espelha os statusAtivos do App
  const [ativos, setAtivos] = useState({
    "Em aberto": true,
    "Urgente": true,
    "Concluído": false,
  });

  useEffect(() => {
    const novoAtivo = {};
    statusOptions.forEach(({ label }) => {
      novoAtivo[label] = statusAtivos.includes(label);
    });
    setAtivos(novoAtivo);
  }, [statusAtivos]);

  const toggleStatus = (status) => {
    const novoAtivo = { ...ativos, [status]: !ativos[status] };
    setAtivos(novoAtivo);

    if (onStatusChange) {
      const selecionados = Object.keys(novoAtivo).filter((s) => novoAtivo[s]);
      onStatusChange(selecionados);
    }
  };

  return (
    <div className="flex gap-2">
      {statusOptions.map(({ label, color }) => (
        <button
          key={label}
          onClick={() => toggleStatus(label)}
          className={`${color} ${
            ativos[label] ? "opacity-100" : "opacity-40"
          } px-4 py-2 rounded font-semibold text-white transition-opacity`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
