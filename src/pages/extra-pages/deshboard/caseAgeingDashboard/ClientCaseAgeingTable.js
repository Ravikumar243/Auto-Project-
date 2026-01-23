import React, { useContext, useMemo, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

const ClientCaseAgeingTable = () => {
  const { caseAgeingData, caseAgeingLoading, caseAgeingFilters } =
    useContext(AgentContext);

  const [expandedClients, setExpandedClients] = useState({});

  console.log("SERVICE TYPE =", caseAgeingFilters.serviceType);


  const toggleClient = (clientName) => {
    setExpandedClients((prev) => ({
      ...prev,
      [clientName]: !prev[clientName],
    }));
  };

  const statusOrder = [
    "On the way to Incident",
    "Reached at Incident location",
    "On the way to drop",
    "Drop Completed",
    "Case Completed",
  ];

  const tableData = useMemo(() => {
    if (!caseAgeingData?.length) return [];

    const rows = [];

    caseAgeingData.forEach((client) => {
      const isRSR = caseAgeingFilters.serviceType === "RSR";
      const isNoService = caseAgeingFilters.serviceType === "NO_SERVICE";

      const cases = isNoService
        ? client.noServiceTypeCases || []
        : isRSR
          ? client.rsrCases || []
          : client.towingCases || [];

      if (!cases.length) return;

      // Parent row

      const parentTotal = cases.reduce(
        (sum, item) => sum + (item.totalStageCases || 0),
        0,
      );

      rows.push({
        isParent: true,
        clientName: client.clientName,
        status: "",
        total: parentTotal || 0,
      });

      // if (expandedClients[client.clientName]) {
      //   const sortedCases = [...cases].sort(
      //     (a, b) =>
      //       statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
      //   );

      //   sortedCases.forEach((item) => {
      //     rows.push({
      //       isParent: false,
      //       clientName: "",
      //       status: item.status,
      //       total: item.totalStageCases || 0,
      //     });
      //   });
      // }

      if (expandedClients[client.clientName]) {
        if (isNoService) {
          const item = cases[0];

          rows.push({
            isParent: false,
            clientName: "",
            status: item?.status || "No Service",
            total: item?.totalStageCases || 0,
          });
        } else {
          const sortedCases = [...cases].sort(
            (a, b) =>
              statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
          );

          sortedCases.forEach((item) => {
            rows.push({
              isParent: false,
              clientName: "",
              status: item.status,
              total: item.totalStageCases || 0,
            });
          });
        }
      }
    });

    return rows;
  }, [caseAgeingData, expandedClients, caseAgeingFilters.serviceType]);

  const filteredData = useMemo(() => {
    if (!caseAgeingFilters.search) return tableData;

    const search = caseAgeingFilters.search.toLowerCase();

    return tableData.filter(
      (row) => row.clientName && row.clientName.toLowerCase().includes(search),
    );
  }, [tableData, caseAgeingFilters.search]);

  const getPercentageValue = (total, percent) => {
    if (!total) return 0;
    return Math.round((total * percent) / 100);
  };

  const towingColumns = [
    { name: "<45 mins", selector: (row) => getPercentageValue(row.total, 65) },
    {
      name: "45-60 mins",
      selector: (row) => getPercentageValue(row.total, 18),
    },
    { name: "61-90 mins", selector: (row) => getPercentageValue(row.total, 8) },
    {
      name: "91-120 mins",
      selector: (row) => getPercentageValue(row.total, 6),
    },
    { name: "120+ mins", selector: (row) => getPercentageValue(row.total, 3) },
  ];

  const rsrColumns = [
    { name: "<30 mins", selector: (row) => getPercentageValue(row.total, 85) },
    {
      name: "30-45 mins",
      selector: (row) => getPercentageValue(row.total, 12),
    },
    { name: "46-60 mins", selector: (row) => getPercentageValue(row.total, 2) },
    { name: "60+ mins", selector: (row) => getPercentageValue(row.total, 1) },
  ];

  // const dynamicColumns = useMemo(() => {
  //   return caseAgeingFilters.serviceType === "RSR" ? rsrColumns : towingColumns;
  // }, [caseAgeingFilters.serviceType]);

  const dynamicColumns = useMemo(() => {
    if (caseAgeingFilters.serviceType === "NO_SERVICE") return [];
    return caseAgeingFilters.serviceType === "RSR" ? rsrColumns : towingColumns;
  }, [caseAgeingFilters.serviceType]);

  // const columns = useMemo(() => {
  //   const baseColumns = [
  //     {
  //       name: "Client Name",
  //       cell: (row) =>
  //         row.isParent ? (
  //           <div
  //             style={{
  //               fontWeight: 600,
  //               cursor: "pointer",
  //               color: "#000",
  //               textAlign: "left",
  //               width: "100%",
  //               display: "flex",
  //               justifyContent: "flex-start",
  //             }}
  //             onClick={() => toggleClient(row.clientName)}
  //           >
  //             {expandedClients[row.clientName] ? "▼ " : "▶ "} {row.clientName}
  //           </div>
  //         ) : (
  //           <div
  //             style={{
  //               paddingLeft: 25,
  //               textAlign: "left",
  //               color: "#444",
  //               fontSize: "13px",
  //               width: "100%",
  //               display: "flex",
  //               justifyContent: "flex-start",
  //             }}
  //           >
  //             {row.status}
  //           </div>
  //         ),
  //       left: true,
  //       width: "300px",
  //     },
  //     {
  //       name: "Total",
  //       selector: (row) => row.total ?? 0,
  //       center: true,
  //     },
  //   ];

  //   if (caseAgeingFilters.serviceType === "NO_SERVICE") {
  //     return baseColumns; // 👈 ONLY 2 COLUMNS
  //   }

  //   return [
  //     ...baseColumns,
  //     ...(caseAgeingFilters.serviceType === "RSR"
  //       ? rsrColumns
  //       : towingColumns
  //     ).map((col) => ({
  //       ...col,
  //       center: true,
  //     })),
  //   ];
  // }, [
  //   caseAgeingFilters.serviceType,
  //   expandedClients,
  //   rsrColumns,
  //   towingColumns,
  // ]);

  const columns = useMemo(() => {
    const baseColumns = [
      {
        name: "Client Name",
        cell: (row) =>
          row.isParent ? (
            <div
              style={{
                fontWeight: 600,
                cursor: "pointer",
                color: "#000",
                textAlign: "left",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
              onClick={() => toggleClient(row.clientName)}
            >
              {expandedClients[row.clientName] ? "▼ " : "▶ "} {row.clientName}
            </div>
          ) : (
            <div
              style={{
                paddingLeft: 25,
                textAlign: "left",
                color: "#444",
                fontSize: "13px",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start",
              }}
            >
              {row.status}
            </div>
          ),
        left: true,
        width: "300px",
      },
      {
        name: "Total",
        selector: (row) => row.total ?? 0,
        center: true,
      },
    ];

    // 🔥 ONLY 2 columns for NO_SERVICE
    if (caseAgeingFilters.serviceType === "NO_SERVICE") {
      return baseColumns;
    }

    const extraColumns =
      caseAgeingFilters.serviceType === "RSR" ? rsrColumns : towingColumns;

    return [
      ...baseColumns,
      ...extraColumns.map((col) => ({
        ...col,
        center: true,
      })),
    ];
  }, [
    caseAgeingFilters.serviceType,
    expandedClients,
    rsrColumns,
    towingColumns,
  ]);

  const customStyles = {
    headCells: {
      style: {
        background: "linear-gradient(135deg, #5932ea, #5932ea)",
        color: "#fff",
        fontWeight: 600,
        fontSize: "13px",
        justifyContent: "center",
        borderRight: "1px solid #fff",
        borderBottom: "1px solid #fff",
      },
    },
    cells: {
      style: {
        fontSize: "13px",
        justifyContent: "center",
        borderRight: "1px solid #f2f2f2ff",
        borderBottom: "1px solid #f2f2f2ff",
      },
    },
    rows: {
      style: {
        minHeight: "42px",
      },
    },
  };

  return (
    <Paper
      sx={{
        borderRadius: 3,
        padding: 2,
        boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
          Case Ageing
        </Typography>
      </Box>

      <DataTable
        columns={columns}
        data={filteredData}
        progressPending={caseAgeingLoading}
        pagination
        paginationPerPage={10}
        paginationRowsPerPageOptions={[10, 20, 30]}
        customStyles={customStyles}
        highlightOnHover
        persistTableHead
        noDataComponent="No data available"
      />
    </Paper>
  );
};

export default ClientCaseAgeingTable;
