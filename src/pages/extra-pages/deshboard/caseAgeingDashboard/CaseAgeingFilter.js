import React, { useContext, useEffect } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Checkbox,
  ListItemText,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import {
  AgentContext,
  RSA_INCIDENT_LIST,
  STATUS_LIST,
  SUB_STATUS_LIST,
} from "../agentDashboard/AgentDashboardHook";

const CLIENT_TYPE_LIST = ["Corporate", "Retail", "OEM", "Insurance"];

const CaseAgeingFilter = () => {
  const {
    clientFilters,
    caseAgeingFilters,
    setCaseAgeingFilters,
    fetchCaseAgeingData,
    fetchClientList,
    clientList,
    updateIncidentTypes,

    userRole,
    loggedInClientName,
  } = useContext(AgentContext);

  useEffect(() => {
    fetchClientList();
  }, []);

  useEffect(() => {
    if (!userRole) return;
    fetchCaseAgeingData();
  }, [caseAgeingFilters, userRole, loggedInClientName]);

  const handleChange = (key, value) => {
    setCaseAgeingFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box sx={{ marginTop: "20px", padding: "16px", borderRadius: 2 }}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            {/* FROM DATE */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={caseAgeingFilters.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
              />
            </Grid>

            {/* TO DATE */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="To Date"
                InputLabelProps={{ shrink: true }}
                value={caseAgeingFilters.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Status"
                SelectProps={{
                  multiple: true,
                  value: caseAgeingFilters.status || [],
                  onChange: (e) => {
                    const value = e.target.value;
                    const allValues = STATUS_LIST.map((i) => i.value);

                    if (value.includes("ALL")) {
                      if (
                        (caseAgeingFilters.status || []).length ===
                        allValues.length
                      ) {
                        handleChange("status", []);
                      } else {
                        handleChange("status", allValues);
                      }
                    } else {
                      handleChange("status", value);
                    }
                  },

                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      (caseAgeingFilters.status || []).length ===
                      STATUS_LIST.length
                    }
                    indeterminate={
                      (caseAgeingFilters.status || []).length > 0 &&
                      (caseAgeingFilters.status || []).length <
                        STATUS_LIST.length
                    }
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {STATUS_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={(caseAgeingFilters.status || []).includes(
                        item.value
                      )}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            {/* <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Sub Status"
                SelectProps={{
                  multiple: true,
                  value: caseAgeingFilters.subStatus || [],
                  onChange: (e) => {
                    const value = e.target.value;
                    const allValues = SUB_STATUS_LIST.map((i) => i.value);

                    if (value.includes("ALL")) {
                      if (
                        (caseAgeingFilters.subStatus || []).length ===
                        allValues.length
                      ) {
                        handleChange("subStatus", []);
                      } else {
                        handleChange("subStatus", allValues);
                      }
                    } else {
                      handleChange("subStatus", value);
                    }
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      (caseAgeingFilters.subStatus || []).length ===
                      SUB_STATUS_LIST.length
                    }
                    indeterminate={
                      (caseAgeingFilters.subStatus || []).length > 0 &&
                      (caseAgeingFilters.subStatus || []).length <
                        SUB_STATUS_LIST.length
                    }
                  />
                  <ListItemText primary="Select All" />
                </MenuItem>

                {SUB_STATUS_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={(caseAgeingFilters.subStatus || []).includes(
                        item.value
                      )}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid> */}

            {userRole !== "client" && (
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Client"
                  SelectProps={{
                    multiple: true,
                    value: caseAgeingFilters.clientNames,
                    onChange: (e) => {
                      const value = e.target.value;

                      if (value.includes("ALL")) {
                        if (
                          caseAgeingFilters.clientNames.length ===
                          clientList.length
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
                        caseAgeingFilters.clientNames.length ===
                          clientList.length
                      }
                      indeterminate={
                        caseAgeingFilters.clientNames.length > 0 &&
                        caseAgeingFilters.clientNames.length < clientList.length
                      }
                    />
                    <ListItemText primary="Select All" />
                  </MenuItem>

                  {clientList.map((client) => (
                    <MenuItem
                      key={client.companyName}
                      value={client.companyName}
                    >
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
            )}

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Service Type"
                value={caseAgeingFilters.serviceType || ""}
                onChange={(e) => handleChange("serviceType", e.target.value)}
              >
                {/* <MenuItem value="">Select</MenuItem> */}
                <MenuItem value="Towing">Towing</MenuItem>
                <MenuItem value="RSR">RSR</MenuItem>
                <MenuItem value="NO_SERVICE">No Service Type</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* SEARCH */}
        <Grid item xs={12} md={2}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Report"
            value={caseAgeingFilters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CaseAgeingFilter;
