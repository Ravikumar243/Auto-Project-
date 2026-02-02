import React, { useContext, useMemo } from "react";
import { Box, Typography, Button, Paper } from "@mui/material";
import DataTable from "react-data-table-component";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const ClientParticular = () => {
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
          //   onClick={handleExport}
          //   disabled={!filteredClientData?.length}
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

      {/* <DataTable
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
          /> */}
    </Paper>
  );
};

export default ClientParticular;
