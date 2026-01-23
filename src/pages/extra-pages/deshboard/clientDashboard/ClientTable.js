import React, { useContext, useEffect, useMemo } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ClientTable = () => {
  const {
    clientData,
    clientLoading,
    clientFilters,
    filteredTotals,
    setFilteredTotals,
  } = useContext(AgentContext);

  const filteredClientData = useMemo(() => {
    if (!clientFilters.search) return clientData || [];

    return (clientData || []).filter((row) =>
      row?.clientName
        ?.toLowerCase()
        .includes(clientFilters.search.toLowerCase()),
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
      "Client Level Total Cases",
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

  const totals = useMemo(() => {
    return filteredClientData.reduce(
      (acc, row) => {
        const cancelled = row.cancelled || 0;
        const denied = row.caseDenied || 0;
        const completed = row.caseCompleted || 0;
        const enquiry = row.completeEnquiry || 0;

        const initiated = row.caseInitiated || 0;
        const enRoute = row.enRoute || 0;
        const atLocation = row.atLocation || 0;
        const onRoute = row.onRoute || 0;
        const dropDone = row.dropDone || 0;

        acc.totalCases += row.totalCases || 0;

        // ✅ Merge completed + enquiry
        acc.completedCases += completed + enquiry;

        // ✅ Merge cancelled + denied
        acc.cancelledCases += cancelled + denied;

        acc.onlyCaseCompleted += completed;
      acc.onlyCancelled += cancelled;

        acc.caseDenied += denied;
        acc.completeEnquiry += enquiry;

        acc.caseInitiated += initiated;
        acc.enRoute += enRoute;
        acc.atLocation += atLocation;
        acc.onRoute += onRoute;
        acc.dropDone += dropDone;

        acc.openCases =
          acc.caseInitiated +
          acc.enRoute +
          acc.atLocation +
          acc.onRoute +
          acc.dropDone;

        return acc;
      },
      {
        totalCases: 0,
        completedCases: 0,
        cancelledCases: 0,
        openCases: 0,

        caseDenied: 0,
        completeEnquiry: 0,

        onlyCaseCompleted: 0,
      onlyCancelled: 0,

        caseInitiated: 0,
        enRoute: 0,
        atLocation: 0,
        onRoute: 0,
        dropDone: 0,
      },
    );
  }, [filteredClientData]);

  useEffect(() => {
    setFilteredTotals(totals);
  }, [totals]);

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
        name: "Case Denied",
        selector: (row) => row.caseDenied,
        width: "180px",
      },
      {
        name: "Service Recalled",
        selector: (row) => row.serviceRecalled,
        width: "180px",
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
      {
        name: (
          <div
            style={{
              backgroundColor: "#FFE3A6",
              color: "#393737ff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            Vendor Not Assign
          </div>
        ),
        selector: (row) => row.caseInitiated,
        width: "180px",
        width: "180px",
      },
      {
        name: (
          <div
            style={{
              backgroundColor: "#FFE3A6",
              color: "#393737ff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            On the way to Incident
          </div>
        ),

        selector: (row) => row.enRoute,
        center: true,
        width: "180px",
      },
      {
        name: (
          <div
            style={{
              backgroundColor: "#FFE3A6",
              color: "#393737ff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            Reached at Incident location
          </div>
        ),

        selector: (row) => row.atLocation,
        center: true,
        width: "220px",
      },
      {
        name: (
          <div
            style={{
              backgroundColor: "#FFE3A6",
              color: "#393737ff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            On the way to drop
          </div>
        ),

        selector: (row) => row.onRoute,
        center: true,
        width: "180px",
      },
      {
        name: (
          <div
            style={{
              backgroundColor: "#FFE3A6",
              color: "#393737ff",
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px",
            }}
          >
            Drop Completed
          </div>
        ),

        selector: (row) => row.dropDone,
        center: true,
        width: "180px",
      },
    ],
    [],
  );

  const customStyles = {
    headCells: {
      style: {
        padding: 0,
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

export default ClientTable;
