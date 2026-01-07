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

const VendorPerformanceTable = () => {
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
        <Typography sx={{ fontWeight: 600, fontSize:"24px" }}>Vendor Performance</Typography>

        <Button
          variant="contained"
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #5932ea, #5932ea)",
          }}
        >
          Export Report
        </Button>
      </Box>

      {/* TABLE */}
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow
              sx={{
                background: "linear-gradient(135deg, #5932ea, #5932ea)",
              }}
            >
              {[
                "Vendor Name",
                "State",
                "City",
                "Accepted",
                "Rejected",
                "Vendor Cases",
                "Acceptance Rate",
                "Rejected Rate",
              ].map((head) => (
                <TableCell
                  key={head}
                  sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "13px",
                    borderRight: "1px solid #fff",
                    borderBottom: "1px solid #fff",
                    textAlign: "center",
                  }}
                >
                  {head}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {[...Array(8)].map((_, index) => (
              <TableRow key={index}>
                {[...Array(8)].map((_, i) => (
                  <TableCell
                    key={i}
                    sx={{
                      borderRight: "1px solid #f2f2f2ff",
                      borderBottom: "1px solid #f2f2f2ff",
                    }}
                  >
                    &nbsp;
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default VendorPerformanceTable;
