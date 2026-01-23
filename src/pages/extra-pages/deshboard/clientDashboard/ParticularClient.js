import React, { useContext, useMemo } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ParticularClient = () => {
  const { clientData, clientLoading, clientFilters } = useContext(AgentContext);

  const filteredClientData = useMemo(() => {
    if (!clientFilters.search) return clientData || [];

    return (clientData || []).filter((row) =>
      row?.clientName
        ?.toLowerCase()
        .includes(clientFilters.search.toLowerCase())
    );
  }, [clientData, clientFilters.search]);

  const handleExport = () => {
    if (!filteredClientData || filteredClientData.length === 0) return;

    const excelData = filteredClientData.map((row, index) => ({
      "S.No": index + 1,
      "Client Name": row.clientName || "-",
      Cases: row.totalCases || 0,
      Completed: row.caseCompleted || 0,
      "Vendor Not Assign": row.caseInitiated || 0,
      "On the way to Incident": row.enRoute || 0,
      "Reached at Incident location": row.atLocation || 0,
      "On the way to drop": row.onRoute || 0,
      "Drop Completed": row.dropDone || 0,
      Cancelled: row.cancelled || 0,
      "Complete Enquiry": row.completeEnquiry || 0,
      "Case Denied": row.caseDenied || 0,
      "Service Recalled": row.serviceRecalled || 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
      workbook,
      worksheet,
      "Client Level Total Cases"
    );

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `Client_Level_Report_${Date.now()}.xlsx`);
  };

  const columns = useMemo(
    () => [
      {
        name: "Client Name",
        width: "180px",
        cell: (row) => (
          <div style={{ textAlign: "left", width: "100%" }}>
            {row.clientName}
          </div>
        ),
      },
      { name: "Total Cases", selector: (row) => row.totalCases, center: true },
      {
        name: "Cases Completed",
        selector: (row) => row.caseCompleted,
        center: true,
        width: "180px",
      },
      {
        name: "Cancelled",
        selector: (row) => row.cancelled,
        center: true,
        width: "180px",
      },
      {
        name: "Complete Enquiry",
        selector: (row) => row.completeEnquiry,
        width: "180px",
      },

      {
        name: "Service Recalled",
        selector: (row) =>
          (Number(row.caseDenied) || 0) + (Number(row.serviceRecalled) || 0),
        width: "200px",
      },
      {
        name: "Open",
        selector: (row) =>
          (row.caseInitiated || 0) +
          (row.enRoute || 0) +
          (row.atLocation || 0) +
          (row.onRoute || 0) +
          (row.dropDone || 0),
        center: true,
        width: "120px",
      },

      //   {
      //     name: "Vendor Not Assign",
      //     selector: (row) => row.caseInitiated,
      //     width: "180px",
      //     width: "180px",
      //   },
      //   {
      //     name: "On the way to Incident",
      //     selector: (row) => row.enRoute,
      //     center: true,
      //     width: "180px",
      //   },
      //   {
      //     name: "Reached at Incident location",
      //     selector: (row) => row.atLocation,
      //     center: true,
      //     width: "220px",
      //   },
      //   {
      //     name: "On the way to drop",
      //     selector: (row) => row.onRoute,
      //     center: true,
      //     width: "180px",
      //   },
      //   {
      //     name: "Drop Completed",
      //     selector: (row) => row.dropDone,
      //     center: true,
      //     width: "180px",
      //   },
    ],
    []
  );

  // 🔹 CUSTOM STYLES → MATCH MUI TABLE EXACTLY
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
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography sx={{ fontWeight: 600, fontSize: "24px" }}>
          Client level Total Cases
        </Typography>

        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!filteredClientData?.length}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #5932ea, #5932ea)",
          }}
        >
          Export Report
        </Button>
      </Box>

      {/* DATA TABLE */}

      <DataTable
        columns={columns}
        data={filteredClientData}
        progressPending={clientLoading}
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

export default ParticularClient;
