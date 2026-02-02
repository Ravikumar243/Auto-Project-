import React, { useContext, useEffect, useMemo } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import { VendorFailureContext } from "../vendorFailure/VendorFailureHook";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const VendorPerformanceTable = () => {
  const {
    fetchVendorPerformanceFiltered,
    vendorPerformanceData,
    vendorPerformanceLoading,
    vendorPerformanceFilters,
    vendorFilteredTotal,
    setVendorFilteredTotal,
  } = useContext(VendorFailureContext);

  useEffect(() => {
    fetchVendorPerformanceFiltered();
  }, [vendorPerformanceFilters]);

  const filteredData = useMemo(() => {
    if (!vendorPerformanceFilters.search) return vendorPerformanceData || [];

    return (vendorPerformanceData || []).filter((row) =>
      row?.vendorName
        ?.toLowerCase()
        .includes(vendorPerformanceFilters.search.toLowerCase()),
    );
  }, [vendorPerformanceData, vendorPerformanceFilters.search]);

  const handleExportExcel = () => {
    if (!filteredData.length) return;

    const formattedData = filteredData.map((row) => ({
      "Vendor Name": row.vendorName || "-",
      State: row.stateName || "-",
      City: row.cityName || "-",
      Accepted: row.accepted || 0,
      Rejected: row.rejected || 0,
      "Vendor Cases": row.vendorCases || 0,
      "Acceptance Rate": row.acceptanceRate || "0%",
      "Rejected Rate": row.rejectedRate || "0%",
    }));

    const worksheet = XLSX.utils.json_to_sheet(formattedData);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Performance");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, "Vendor_Performance_Report.xlsx");
  };

  const totals = useMemo(() => {
    const accepted = filteredData.reduce(
      (sum, row) => sum + (Number(row.acceptedCases) || 0),
      0,
    );

    const rejected = filteredData.reduce(
      (sum, row) => sum + (Number(row.rejectedCases) || 0),
      0,
    );

    const total = accepted + rejected;

    const acceptedRate = total ? ((accepted / total) * 100).toFixed(2) : "0.00";

    const rejectedRate = total ? ((rejected / total) * 100).toFixed(2) : "0.00";

    return {
      accepted,
      rejected,
      total,
      acceptedRate,
      rejectedRate,
    };
  }, [filteredData]);

  useEffect(() => {
    setVendorFilteredTotal(totals);
  }, [totals]);

  const columns = useMemo(
    () => [
      {
        name: "Vendor Name",
        selector: (row) => row.vendorName || "-",
        center: true,
      },
      {
        name: "State",
        selector: (row) => row.stateName || "-",
        center: true,
      },
      {
        name: "City",
        selector: (row) => row.cityName || "-",
        center: true,
      },
      {
        name: "Accepted",
        selector: (row) => row.acceptedCases || 0,
        center: true,
      },
      {
        name: "Rejected",
        selector: (row) => row.rejectedCases || 0,
        center: true,
      },
      {
        name: "Vendor Cases",
        selector: (row) => row.vendorCases || 0,
        center: true,
      },
      {
        name: "Acceptance Rate",
        selector: (row) => row.acceptedRate + "%" || "0%",
        center: true,
      },
      {
        name: "Rejected Rate",
        selector: (row) => row.rejectedRate + "%" || "0%",
        center: true,
      },
    ],
    [],
  );

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
          Vendor Performance
        </Typography>

        <Button
          variant="contained"
          onClick={handleExportExcel}
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
        data={filteredData || []}
        progressPending={vendorPerformanceLoading}
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

export default VendorPerformanceTable;
