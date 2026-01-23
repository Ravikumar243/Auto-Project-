import React, { useContext, useMemo, useState } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

const CaseAgeingTable = () => {
  const { caseAgeingData, caseAgeingLoading, caseAgeingFilters } =
    useContext(AgentContext);

  const [expandedClients, setExpandedClients] = useState({});

  const toggleClient = (clientName) => {
    setExpandedClients((prev) => ({
      ...prev,
      [clientName]: !prev[clientName],
    }));
  };

  const statusOrder = [
    "Vendor Not Assigned",
    "Vendor Assigned",
    "On the way to incident",
    "Reached at incident location",
    "On the way to drop",
    "Drop completed",
    "Case closed",
  ];

  console.log("SERVICE TYPE =", caseAgeingFilters.serviceType);

  const tableData = useMemo(() => {
    if (!caseAgeingData?.length) return [];

    const rows = [];

    caseAgeingData.forEach((client) => {
      // const isRSR = caseAgeingFilters.serviceType === "RSR";
      // const cases = isRSR ? client.rsrCases : client.towingCases;

      const isRSR = caseAgeingFilters.serviceType === "RSR";
      const isNoService = caseAgeingFilters.serviceType === "NO_SERVICE";

      const cases = isNoService
        ? client.noServiceTypeCases || []
        : isRSR
          ? client.rsrCases || []
          : client.towingCases || [];

      const parentTotal = cases.reduce(
        (sum, item) => sum + (item.totalStageCases || 0),
        0,
      );

      if (!cases || !cases.length) return;

      let parentRow = {};

      if (isNoService) {
        const total = cases.reduce(
          (sum, item) => sum + (item.totalStageCases || 0),
          0,
        );

        parentRow = {
          isParent: true,
          clientName: client.clientName,
          status: "",
          total: total || 0,
        };
      }

      if (isRSR) {
        const total_0_30 = cases.reduce((s, i) => s + (i.age_0_30 || 0), 0);
        const total_31_45 = cases.reduce((s, i) => s + (i.age_31_45 || 0), 0);
        const total_46_90 = cases.reduce((s, i) => s + (i.age_46_90 || 0), 0);
        const total_90_Plus = cases.reduce(
          (s, i) => s + (i.age_90_Plus || 0),
          0,
        );

        parentRow = {
          isParent: true,
          clientName: client.clientName,
          status: "",
          age_0_30: total_0_30,
          age_31_45: total_31_45,
          age_46_90: total_46_90,
          age_90_Plus: total_90_Plus,
          total: parentTotal || 0,
        };
      } else {
        const total_0_45 = cases.reduce((s, i) => s + (i.age_0_45 || 0), 0);
        const total_46_60 = cases.reduce((s, i) => s + (i.age_46_60 || 0), 0);
        const total_61_90 = cases.reduce((s, i) => s + (i.age_61_90 || 0), 0);
        const total_91_120 = cases.reduce((s, i) => s + (i.age_91_120 || 0), 0);
        const total_120_Plus = cases.reduce(
          (s, i) => s + (i.age_120_Plus || 0),
          0,
        );

        parentRow = {
          isParent: true,
          clientName: client.clientName,
          status: "",
          age_0_45: total_0_45,
          age_46_60: total_46_60,
          age_61_90: total_61_90,
          age_91_120: total_91_120,
          age_120_Plus: total_120_Plus,
          total: parentTotal || 0,
        };
      }

      rows.push(parentRow);

      // if (expandedClients[client.clientName]) {
      //   const sortedCases = [...cases].sort(
      //     (a, b) =>
      //       statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
      //   );

      //   sortedCases.forEach((item) => {
      //     const childRow = isRSR
      //       ? {
      //           isParent: false,
      //           clientName: "",
      //           status: item.status,
      //           age_0_30: item.age_0_30,
      //           age_31_45: item.age_31_45,
      //           age_46_90: item.age_46_90,
      //           age_90_Plus: item.age_90_Plus,
      //           total: item.totalStageCases || 0,
      //         }
      //       : {
      //           isParent: false,
      //           clientName: "",
      //           status: item.status,
      //           age_0_45: item.age_0_45,
      //           age_46_60: item.age_46_60,
      //           age_61_90: item.age_61_90,
      //           age_91_120: item.age_91_120,
      //           age_120_Plus: item.age_120_Plus,
      //           total: item.totalStageCases || 0,
      //         };

      //     rows.push(childRow);
      //   });
      // }

      if (expandedClients[client.clientName]) {
        if (isNoService) {
          const item = cases[0]; // ONLY ONE CHILD

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
            const childRow = isRSR
              ? {
                  isParent: false,
                  clientName: "",
                  status: item.status,
                  age_0_30: item.age_0_30,
                  age_31_45: item.age_31_45,
                  age_46_90: item.age_46_90,
                  age_90_Plus: item.age_90_Plus,
                  total: item.totalStageCases || 0,
                }
              : {
                  isParent: false,
                  clientName: "",
                  status: item.status,
                  age_0_45: item.age_0_45,
                  age_46_60: item.age_46_60,
                  age_61_90: item.age_61_90,
                  age_91_120: item.age_91_120,
                  age_120_Plus: item.age_120_Plus,
                  total: item.totalStageCases || 0,
                };

            rows.push(childRow);
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

  const towingColumns = [
    { name: "0-45 min", selector: (row) => row.age_0_45 ?? 0 },
    { name: "46-60 min", selector: (row) => row.age_46_60 ?? 0 },
    { name: "61-90 min", selector: (row) => row.age_61_90 ?? 0 },
    { name: "91-120 min", selector: (row) => row.age_91_120 ?? 0 },
    { name: "120+ min", selector: (row) => row.age_120_Plus ?? 0 },
  ];

  const rsrColumns = [
    { name: "0-30 min", selector: (row) => row.age_0_30 ?? 0 },
    { name: "31-45 min", selector: (row) => row.age_31_45 ?? 0 },
    { name: "46-60 min", selector: (row) => row.age_46_90 ?? 0 },
    { name: "60+ min", selector: (row) => row.age_90_Plus ?? 0 },
  ];

  const dynamicColumns = useMemo(() => {
    return caseAgeingFilters.serviceType === "RSR" ? rsrColumns : towingColumns;
  }, [caseAgeingFilters.serviceType]);

  // const columns = [
  //   {
  //     name: "Client Name",
  //     cell: (row) =>
  //       row.isParent ? (
  //         <div
  //           style={{
  //             fontWeight: 600,
  //             cursor: "pointer",
  //             color: "#000",
  //             textAlign: "left",
  //             width: "100%",
  //             display: "flex",
  //             justifyContent: "flex-start",
  //           }}
  //           onClick={() => toggleClient(row.clientName)}
  //         >
  //           {expandedClients[row.clientName] ? "▼ " : "▶ "} {row.clientName}
  //         </div>
  //       ) : (
  //         <div
  //           style={{
  //             paddingLeft: 25,
  //             textAlign: "left",
  //             color: "#444",
  //             fontSize: "13px",
  //             width: "100%",
  //             display: "flex",
  //             justifyContent: "flex-start",
  //           }}
  //         >
  //           {row.status}
  //         </div>
  //       ),
  //     left: true,
  //     width: "300px",
  //   },

  //   {
  //     name: "Total",
  //     selector: (row) => row.total ?? 0,
  //     center: true,
  //   },
  //   ...dynamicColumns.map((col) => ({
  //     ...col,
  //     center: true,
  //   })),
  // ];

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

    // 🔥 NO SERVICE = ONLY 2 COLUMNS
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

  const handleExport = () => {
    const exportData = filteredData.map((row) => {
      // 🔥 NO SERVICE → only 2 columns
      if (caseAgeingFilters.serviceType === "NO_SERVICE") {
        return {
          Client: row.clientName || row.status,
          Total: row.total ?? 0,
        };
      }

      // RSR export
      if (caseAgeingFilters.serviceType === "RSR") {
        return {
          Client: row.clientName || row.status,
          Total: row.total ?? 0,
          "0-30 min": row.age_0_30 ?? 0,
          "31-45 min": row.age_31_45 ?? 0,
          "46-90 min": row.age_46_90 ?? 0,
          "60+ min": row.age_90_Plus ?? 0,
        };
      }

      // Towing export
      return {
        Client: row.clientName || row.status,
        Total: row.total ?? 0,
        "0-45 min": row.age_0_45 ?? 0,
        "46-60 min": row.age_46_60 ?? 0,
        "61-90 min": row.age_61_90 ?? 0,
        "91-120 min": row.age_91_120 ?? 0,
        "120+ min": row.age_120_Plus ?? 0,
      };
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Case Ageing");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "case_ageing_report.xlsx");
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

        <Button
          variant="contained"
          sx={{ backgroundColor: "#5932ea" }}
          onClick={handleExport}
        >
          Export Report
        </Button>
      </Box>

      <DataTable
        key={caseAgeingFilters.serviceType}
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

export default CaseAgeingTable;
