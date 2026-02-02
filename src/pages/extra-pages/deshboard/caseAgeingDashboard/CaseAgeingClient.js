import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  TextField,
  MenuItem,
  Checkbox,
  ListItemText,
} from "@mui/material";
import DataTable from "react-data-table-component";
import SearchIcon from "@mui/icons-material/Search";
import baseURL from "api/autoApi";
import { AgentContext } from "../agentDashboard/AgentDashboardHook";

const CaseAgeingClient = () => {
  const {
    clientFilters,
    caseAgeingFilters,
    setCaseAgeingFilters,
    fetchCaseAgeingData,
    fetchClientList,
    clientList,
    updateIncidentTypes,
  } = useContext(AgentContext);

  const [filters, setFilters] = useState({
    fromDate: "",
    toDate: "",
    clientNames: [],
    serviceType: "TOWING",
    search: "",
  });

  const [caseAgeingClient, setCaseAgeingClient] = useState([]);
  const [totalData, setTotalData] = useState("");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role?.toLowerCase();

  const userEmail = localStorage.getItem("userEmail");
  const loggedInClientName = userEmail ? userEmail.split("@")[0] : "";

  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const toggleClient = (name) => {
    setExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  };
  console.log(caseAgeingClient, "caseAgeingClient");

  const formatDateDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const isClientUser = userRole === "client";
        // const clientFromLogin = getClientNameFromEmail(userEmail);

        const params = new URLSearchParams({
          fromDate: formatDateDDMMYYYY(filters.fromDate),
          toDate: formatDateDDMMYYYY(filters.toDate),
          serviceType: filters.serviceType,
          CompanyName: isClientUser
            ? loggedInClientName
            : filters.clientNames.join(","),
        });

        const res = await fetch(
          `${baseURL}/GetClientData?${params.toString()}`,
        );

        const Data = await res.json();
        console.log(Data?.average, "datajljskd");
        // setCaseAgeingClient(Data?.average
        // //   Array.isArray(Data?.average) ? Data.average : [],
        // );

        // const detailRows = Array.isArray(Data?.clientSummary)
        //   ? Data.clientSummary
        //   : [];

        const averageRow = Data?.average
          ? { ...Data.average, isAverage: true }
          : null;

        //   setTotalData(Data?.clientSummary?.companyTotalCases);

        setCaseAgeingClient(
          averageRow ? [averageRow] : [],
          //   ? [...detailRows, averageRow] : detailRows,
        );

        // setData(json.data || []);
      } catch (err) {
        console.error("API Error", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filters]);

  const tableData = useMemo(() => {
    if (!caseAgeingClient.length) return [];

    const rows = [];

    caseAgeingClient.forEach((client) => {
      const isRSR = filters.serviceType === "RSR";
      const isNoService = filters.serviceType === "NO_SERVICE";

      const cases = isNoService
        ? client.noServiceTypeCases || []
        : isRSR
          ? client.rsrCases || []
          : client.towingCases || [];

      if (!cases.length) return;

      const parentTotal = cases.reduce(
        (s, i) => s + (i.totalStageCases || 0),
        0,
      );

      rows.push({
        isParent: true,
        clientName: client.clientName,
        total: parentTotal,
      });

      if (expanded[client.clientName]) {
        cases.forEach((c) => {
          rows.push({
            isParent: false,
            status: c.status,
            ...c,
            total: c.totalStageCases || 0,
          });
        });
      }
    });

    return rows;
  }, [caseAgeingClient, expanded, filters.serviceType]);

  const baseColumns = [
    {
      name: "Client Name",
      selector: (row) => "TVS",
      width: "200px",
    },
    {
      name: "Total Cases",
      selector: (row) => Number(row.companyTotalCases || 0),
      center: true,
    },
  ];

  const towingColumns = [
    {
      name: "0–45 Min",
      selector: (row) => <div>{Number(row.towing_0_45Min || 0)}%</div>,
      center: true,
    },
    {
      name: "46–60 Min",
      selector: (row) => <div>{Number(row.towing_46_60Min || 0)}%</div>,
      center: true,
    },
    {
      name: "61–90 Min",
      selector: (row) => <div>{Number(row.towing_61_90Min || 0)}%</div>,
      center: true,
    },
    {
      name: "91–120 Min",
      selector: (row) => <div>{Number(row.towing_91_120Min || 0)}%</div>,
      center: true,
    },
    {
      name: "120+ Min",
      selector: (row) => <div>{Number(row.towing_120PlusMin || 0)}%</div>,
      center: true,
    },
  ];

  const rsrColumns = [
    {
      name: "0–30 Min",
      selector: (row) => <div>{Number(row.rsR_0_30Min || 0)}%</div>,
      center: true,
    },
    {
      name: "31–45 Min",
      selector: (row) => <div>{Number(row.rsR_31_45Min || 0)}%</div>,
      center: true,
    },
    {
      name: "46–60 Min",
      selector: (row) => <div>{Number(row.rsR_46_60Min || 0)}%</div>,
      center: true,
    },
    {
      name: "60+ Min",
      selector: (row) => <div>{Number(row.rsR_60PlusMin || 0)}%</div>,
      center: true,
    },
  ];
  const columns = useMemo(() => {
    if (filters.serviceType === "RSR") {
      return [...baseColumns, ...rsrColumns];
    }

    if (filters.serviceType === "TOWING") {
      return [...baseColumns, ...towingColumns];
    }

    return baseColumns;
  }, [filters.serviceType]);

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
    <Paper sx={{ p: 2, borderRadius: 3 }}>
      <Typography fontSize={24} fontWeight={600} mb={2}>
        Case Ageing
      </Typography>

      {/* FILTERS */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            label="From Date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filters.fromDate}
            onChange={(e) => handleChange("fromDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            type="date"
            label="To Date"
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            value={filters.toDate}
            onChange={(e) => handleChange("toDate", e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={2}>
          <TextField
            select
            size="small"
            label="Service Type"
            fullWidth
            value={filters.serviceType}
            onChange={(e) => handleChange("serviceType", e.target.value)}
          >
            <MenuItem value="TOWING">Towing</MenuItem>
            <MenuItem value="RSR">RSR</MenuItem>
            <MenuItem value="NO_SERVICE">No Service</MenuItem>
          </TextField>
        </Grid>

        {/* {userRole !== "client" && (
          <Grid item xs={12} sm={6} md={2}>
            <TextField
              select
              fullWidth
              size="small"
              label="Select Client"
              SelectProps={{
                multiple: true,
                value: filters.clientNames,
                onChange: (e) => {
                  const value = e.target.value;

                  if (value.includes("ALL")) {
                    if (
                      caseAgeingFilters.clientNames.length === clientList.length
                    ) {
                      handleChange("clientNames", []);
                    } else {
                      handleChange(
                        "clientNames",
                        clientList.map((c) => c.companyName),
                      );
                    }
                  } else {
                    handleChange("clientNames", value);
                  }
                },
                renderValue: (selected) => selected.join(", "),
              }}
            >
              <MenuItem value="ALL">
                <Checkbox
                  checked={
                    clientList.length > 0 &&
                    caseAgeingFilters.clientNames.length === clientList.length
                  }
                  indeterminate={
                    caseAgeingFilters.clientNames.length > 0 &&
                    caseAgeingFilters.clientNames.length < clientList.length
                  }
                />
                <ListItemText primary="Select All" />
              </MenuItem>

              {clientList.map((client) => (
                <MenuItem key={client.companyName} value={client.companyName}>
                  <Checkbox
                    checked={caseAgeingFilters.clientNames.includes(
                      client.companyName,
                    )}
                  />
                  <ListItemText primary={client.companyName} />
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        )} */}

        <Grid item xs={12} sm={2}>
          <TextField
            size="small"
            fullWidth
            placeholder="Search Client"
            InputProps={{
              startAdornment: <SearchIcon fontSize="small" />,
            }}
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
          />
        </Grid>
      </Grid>

      {/* TABLE */}
      <DataTable
        columns={columns}
        data={caseAgeingClient}
        progressPending={loading}
        pagination
        highlightOnHover
        persistTableHead
        noDataComponent="No data available"
        customStyles={customStyles}
      />
    </Paper>
  );
};

export default CaseAgeingClient;
