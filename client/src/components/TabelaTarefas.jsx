import React, { useState, useMemo, useCallback, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { responsaveis } from "../data/fakeDB";

// registrar módulos do ag-grid
ModuleRegistry.registerModules([AllCommunityModule]);

export default function TabelaTarefas({ tarefas }) {
  const [rowData, setRowData] = useState([]);

  // normaliza datas
  const normalizeDateString = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (!isNaN(d)) return d.toISOString().slice(0, 10);
    return value;
  };

  // comparator para filtro de datas
  const dateComparator = useCallback((filterLocalDateAtMidnight, cellValue) => {
    if (!cellValue) return -1;
    const cellDate = new Date(cellValue);
    cellDate.setHours(0, 0, 0, 0);
    if (cellDate < filterLocalDateAtMidnight) return -1;
    if (cellDate > filterLocalDateAtMidnight) return 1;
    return 0;
  }, []);

  // definir colunas
  const columnDefs = useMemo(() => [
    { headerName: "ID", field: "id_unico", width: 90 },
    { headerName: "MES_REF", field: "mes_ref", width: 120 },
    { 
      headerName: "TAREFA", 
      field: "tarefa", 
      flex: 1, 
      wrapText: true,      // permite quebra de linha
      autoHeight: true,    // ajusta altura da linha automaticamente
    },
    { headerName: "EMPRESA", field: "empresa", width: 200 },
    {
      headerName: "RESPONSÁVEL",
      field: "responsavel",
      width: 160,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: responsaveis },
    },
    {
      headerName: "VENC",
      field: "vencimento",
      width: 140,
      editable: true,
      filter: "agDateColumnFilter",
      filterParams: { comparator: dateComparator },
      valueParser: (params) => normalizeDateString(params.newValue),
    },
    {
      headerName: "STATUS",
      field: "status",
      width: 140,
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: { values: ["Em aberto", "Urgente", "Concluído"] },
    },
    { 
      headerName: "OBS", 
      field: "obs", 
      flex: 1, 
      editable: true,
      wrapText: true,
      autoHeight: true,
    },
  ], [dateComparator]);

  // default col def com estilo global
  const defaultColDef = useMemo(() => ({
    sortable: true,
    resizable: true,
    filter: true,
    cellStyle: {
      color: '#000',          // texto preto
    }
  }), []);

  // estilo de fundo baseado em status
  const getRowStyle = useCallback((params) => {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const { vencimento, status } = params.data;

    if (status === "Concluído") return { backgroundColor: "#22c55e", color: "#fff" };

    if (!vencimento) return status === "Urgente" ? { backgroundColor: "#ffb86b", color: "#000" } : {};

    const v = new Date(vencimento);
    if (isNaN(v)) return status === "Urgente" ? { backgroundColor: "#ffb86b", color: "#000" } : {};
    v.setHours(0, 0, 0, 0);

    if (status === "Urgente") return { backgroundColor: "#ffb86b", color: "#000" };
    if (v < hoje && status !== "Concluído") return { backgroundColor: "#f87171", color: "#000" };

    const diffDias = Math.ceil((v - hoje) / (1000 * 60 * 60 * 24));
    if (diffDias > 0 && diffDias <= 3) return { backgroundColor: "#facc15", color: "#000" };

    return {};
  }, []);

  // atualizar estado local
  const onCellValueChanged = useCallback((params) => {
    const updated = rowData.map(r => r.id_unico === params.data.id_unico ? params.data : r);
    setRowData(updated);
  }, [rowData]);

  // ordenar ao receber tarefas
  useEffect(() => {
    if (!tarefas) return;
    const ordenadas = [...tarefas].sort((a, b) => {
      const aDate = a.vencimento ? new Date(a.vencimento) : new Date(8640000000000000);
      const bDate = b.vencimento ? new Date(b.vencimento) : new Date(8640000000000000);
      return aDate - bDate;
    });
    setRowData(ordenadas);
  }, [tarefas]);

  return (
    <div className="ag-theme-alpine" style={{ height: 600, width: "100%", overflow: "auto" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={columnDefs}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        getRowStyle={getRowStyle}
        pagination
        paginationPageSize={100}
        sortModel={[{ colId: "vencimento", sort: "asc" }]}
        suppressClickEdit={false}
      />
    </div>
  );
}
