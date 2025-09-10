import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { usePessoas } from "../hooks/usePessoas";
import { useUpdateExecucao } from "../hooks/useExecucoes";
import { formatVencimento, formatMesRef } from "../utils/date";
import { toast } from "react-hot-toast";

// Registrar módulos do ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TabelaTarefas({ tarefas }) {
  const [rowData, setRowData] = useState([]);

  const { pessoas } = usePessoas();
  const { updateExecucao } = useUpdateExecucao();

  const nomesResponsaveis = pessoas.map(p => p.nome);

  const dateComparator = useCallback((filterLocalDateAtMidnight, cellValue) => {
    if (!cellValue) return -1;
    const cellDate = new Date(cellValue);
    cellDate.setHours(0, 0, 0, 0);
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }, []);

  // Colunas
  const columnDefs = useMemo(() => [
    { headerName: "ID", field: "id", width: 90 },
    {
      headerName: "MES_REF",
      field: "mes_ref",
      width: 120,
      valueGetter: (params) => formatMesRef(params.data.mes_ref),
    },
    { headerName: "TAREFA", field: "tarefa", flex: 1, wrapText: true, autoHeight: true },
    { headerName: "EMPRESA", field: "empresa", width: 200 },
    {
      headerName: "RESPONSÁVEL",
      field: "responsavel",
      width: 160,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: nomesResponsaveis },
    },
    {
      headerName: "VENC",
      field: "vencimento",
      width: 140,
      editable: true,
      filter: "agDateColumnFilter",
      filterParams: { comparator: dateComparator },
      valueGetter: (params) => formatVencimento(params.data.vencimento),
      valueParser: (params) => formatVencimento(params.newValue),
    },
    {
      headerName: "STATUS",
      field: "status",
      width: 140,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Em aberto", "Urgente", "Concluído"] },
    },
    { headerName: "OBS", field: "obs", flex: 1, editable: true, wrapText: true, autoHeight: true },
  ], [dateComparator, nomesResponsaveis]);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    cellStyle: { color: '#000', fontSize: '14px' },
  }), []);

  const getRowStyle = useCallback((params) => {
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    const { vencimento, status } = params.data;

    if (status === "Concluído") return { backgroundColor: "#22c55e", color: "#fff" };
    if (!vencimento) return status === "Urgente" ? { backgroundColor: "#ffb86b", color: "#000" } : {};

    const v = new Date(vencimento);
    if (isNaN(v)) return status === "Urgente" ? { backgroundColor: "#ffb86b", color: "#000" } : {};
    v.setHours(0,0,0,0);

    if (status === "Urgente") return { backgroundColor: "#ffb86b", color: "#000" };
    if (v < hoje && status !== "Concluído") return { backgroundColor: "#f87171", color: "#000" };
    const diffDias = Math.ceil((v-hoje)/(1000*60*60*24));
    if(diffDias>=0 && diffDias<=3) return { backgroundColor: "#facc15", color: "#000" };
    return {};
  }, []);

const onCellValueChanged = useCallback(async (params) => {
  const updatedRow = { ...params.data };

  // Validação de data
  if (updatedRow.vencimento && isNaN(new Date(updatedRow.vencimento))) {
    toast.error("Data inválida!");
    return;
  }

  // Mapear responsável
  const pessoaSelecionada = pessoas.find(p => p.nome === updatedRow.responsavel);
  if (pessoaSelecionada) updatedRow.responsavel_id = pessoaSelecionada.id;

  // Atualiza estado local otimista
  setRowData(prev => prev.map(r => r.id === updatedRow.id ? updatedRow : r));

  try {
    await updateExecucao(updatedRow.id, {
      status: updatedRow.status,
      vencimento: updatedRow.vencimento,
      obs: updatedRow.obs,
      responsavel_id: updatedRow.responsavel_id
    });
    toast.success("Execução salva com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar execução:", error);
    toast.error("Falha ao salvar!");
    // sem rollback, valor permanece como está
  }
}, [pessoas, updateExecucao]);

  // Ordena tarefas
  useEffect(() => {
    if (!tarefas) return;
    const ordenadas = [...tarefas].sort((a,b) => {
      const aDate = a.vencimento ? new Date(a.vencimento) : new Date(8640000000000000);
      const bDate = b.vencimento ? new Date(b.vencimento) : new Date(8640000000000000);
      return aDate - bDate;
    });
    setRowData(ordenadas);
  }, [tarefas]);

  return (
    <div className="ag-theme-alpine" style={{height:600,width:"100%",overflow:"auto"}}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        getRowStyle={getRowStyle}
        pagination
        paginationPageSize={100}
        suppressClickEdit={false}
      />
    </div>
  );
}
