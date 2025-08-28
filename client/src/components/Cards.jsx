export default function Cards({ tarefas, responsavelAtivo }) {
  const hoje = new Date();  
  hoje.setHours(0,0,0,0);

  const tarefasFiltradas = responsavelAtivo
    ? tarefas.filter((t) => t.responsavel === responsavelAtivo)
    : tarefas;

  let emAberto = 0;
  let atrasadas = 0;
  let urgentes = 0;

  tarefasFiltradas.forEach((t) => {
    const vencimento = new Date(t.vencimento);
    vencimento.setHours(0,0,0,0);
    if (t.status === "Em aberto" || t.status === "Urgente") emAberto++;
    if (vencimento < hoje && t.status !== "Concluído") atrasadas++;
    if (t.status === "Urgente") urgentes++;
  });

  const labels = [
    { name: "Tarefas em aberto", valor: emAberto },
    { name: "Tarefas atrasadas", valor: atrasadas },
    { name: "Tarefas Urgentes", valor: urgentes },
  ];

  return (
    <div className="flex max-w-7xl items-center mx-auto py-4 justify-center gap-10">
      {labels.map((label) => (
        <div key={label.name} className="min-w-[120px] font-roboto bg-slate-700 text-white p-4 rounded-md shadow-lg flex flex-col items-center justify-center text-center">
          <h2 className="text-5xl">{label.valor}</h2>
          <p className="text-xl">{label.name}</p>
        </div>
      ))}
    </div>
  );
}
