import React, { useContext, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { VendorFailureContext } from "./VendorFailureHook";
import DataTable from "react-data-table-component";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const VendorFailureTable = () => {
  const { vendorFailureLoading, vendorFailureData, filters } =
    useContext(VendorFailureContext);

  const filteredData = useMemo(() => {
    if (!filters.search) return vendorFailureData || [];

    return (vendorFailureData || []).filter((item) =>
      item?.srnNumber
        ?.toString()
        .toLowerCase()
        .includes(filters.search.toLowerCase())
    );
  }, [filters.search, vendorFailureData]);

  const handleExport = () => {
    if (!vendorFailureData || vendorFailureData.length === 0) return;

    const excelData = vendorFailureData.map((row, index) => ({
      "S.No": index + 1,
      "SRN Number": row.srnNumber || "-",
      "Vendor Name": row.vendorName || "-",
      "Agent Name": row.agentName || "-",
      Date: row.failureDate || "-",
      "Time Stamp": row.failureTime || "-",
      "Reason For Rejection": row.rejectionReason || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vendor Failure Report");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `Vendor_Failure_Report_${Date.now()}.xlsx`);
  };
  const columns = [
    {
      name: "SRN Number",
      selector: (row) => row.srnNumber || "-",
      center: true,
    },
    {
      name: "Vendor Name",
      selector: (row) => row.vendorName || "-",
      center: true,
    },
    {
      name: "Agent Name",
      selector: (row) => row.agentName || "-",
      center: true,
    },
    {
      name: "Date",
      selector: (row) => row.failureDate || "-",
      center: true,
    },
    {
      name: "Time Stamp",
      selector: (row) => row.failureTime || "-",
      center: true,
    },
    {
      name: "Reason For Rejection",
      selector: (row) => row.rejectionReason || "-",
      center: true,
      wrap: true,
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#5932ea",
        color: "#fff",
        fontWeight: 600,
        fontSize: "13px",
        borderRight: "1px solid #fff",
      },
    },
    cells: {
      style: {
        borderRight: "1px solid #f2f2f2ff",
        borderBottom: "1px solid #f2f2f2ff",
        fontSize: "13px",
        justifyContent: "center",
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
          Vendor Failure Report
        </Typography>

        <Button
          variant="contained"
          onClick={handleExport}
          disabled={!vendorFailureData?.length}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #5932ea, #5932ea)",
          }}
        >
          Export Report
        </Button>
      </Box>

      <DataTable
        columns={columns}
        data={filteredData || []}
        progressPending={vendorFailureLoading}
        pagination
        highlightOnHover
        striped
        customStyles={customStyles}
        noDataComponent="No records found"
      />
    </Paper>
  );
};

export default VendorFailureTable;
