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
  INCIDENT_TYPE_LIST,
  STATUS_LIST,
  SUB_STATUS_LIST,
} from "../agentDashboard/AgentDashboardHook";

const ClientFilter = () => {
  const {
    fetchClientList,
    fetchClientData,
    clientFilters,
    setClientFilters,
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

    if (userRole === "client" && !loggedInClientName) return;
    fetchClientData();
  }, [fetchClientData, clientFilters, userRole, loggedInClientName]);

  const handleChange = (key, value) => {
    setClientFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box
      sx={{
        marginTop: "20px",
        padding: "16px",
        borderRadius: 2,
      }}
    >
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs={12} md={9}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={clientFilters.fromDate}
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
                value={clientFilters.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
              />
            </Grid>

            {/* STATUS */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Status"
                SelectProps={{
                  multiple: true,
                  value: clientFilters.status || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = STATUS_LIST.map((i) => i.value);

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        clientFilters.status?.includes(val)
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    handleChange("status", selected);
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      (clientFilters.status || []).length === STATUS_LIST.length
                    }
                    indeterminate={
                      (clientFilters.status || []).length > 0 &&
                      (clientFilters.status || []).length < STATUS_LIST.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {STATUS_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={(clientFilters.status || []).includes(
                        item.value
                      )}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {userRole !== "client" && (
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Sub Status"
                  SelectProps={{
                    multiple: true,
                    value: clientFilters.subStatus || [],
                    onChange: (e) => {
                      let selected = e.target.value;
                      const allValues = SUB_STATUS_LIST.map((i) => i.value);

                      if (selected.includes("ALL")) {
                        const isAllSelected = allValues.every((val) =>
                          clientFilters.subStatus?.includes(val)
                        );
                        selected = isAllSelected ? [] : allValues;
                      }

                      handleChange("subStatus", selected);
                    },
                    renderValue: (selected) =>
                      Array.isArray(selected) ? selected.join(", ") : "",
                  }}
                >
                  <MenuItem value="ALL">
                    <Checkbox
                      checked={
                        (clientFilters.subStatus || []).length ===
                        SUB_STATUS_LIST.length
                      }
                      indeterminate={
                        (clientFilters.subStatus || []).length > 0 &&
                        (clientFilters.subStatus || []).length <
                          SUB_STATUS_LIST.length
                      }
                    />
                    <ListItemText primary="All" />
                  </MenuItem>

                  {SUB_STATUS_LIST.map((item) => (
                    <MenuItem key={item.value} value={item.value}>
                      <Checkbox
                        checked={(clientFilters.subStatus || []).includes(
                          item.value
                        )}
                      />
                      <ListItemText primary={item.label} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* CLIENT (ADMIN ONLY) */}
            {userRole !== "client" && (
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  select
                  fullWidth
                  size="small"
                  label="Select Client"
                  SelectProps={{
                    multiple: true,
                    value: clientFilters.clientNames || [],
                    onChange: (e) => {
                      let selected = e.target.value;
                      const allValues = clientList.map((c) => c.companyName);

                      if (selected.includes("ALL")) {
                        const isAllSelected = allValues.every((val) =>
                          clientFilters.clientNames?.includes(val)
                        );
                        selected = isAllSelected ? [] : allValues;
                      }

                      handleChange("clientNames", selected);
                    },
                    renderValue: (selected) =>
                      Array.isArray(selected) ? selected.join(", ") : "",
                  }}
                >
                  <MenuItem value="ALL">
                    <Checkbox
                      checked={
                        clientList.length > 0 &&
                        clientFilters.clientNames?.length === clientList.length
                      }
                      indeterminate={
                        clientFilters.clientNames?.length > 0 &&
                        clientFilters.clientNames?.length < clientList.length
                      }
                    />
                    <ListItemText primary="Select All" />
                  </MenuItem>

                  {clientList.map((client, index) => (
                    <MenuItem key={index} value={client.companyName}>
                      <Checkbox
                        checked={(clientFilters.clientNames || []).includes(
                          client.companyName
                        )}
                      />
                      <ListItemText primary={client.companyName} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            )}

            {/* SERVICE TYPE */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Incident Type"
                SelectProps={{
                  multiple: true,
                  value: clientFilters.serviceType || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = ["Towing", "RSR"];

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        clientFilters.serviceType?.includes(val)
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    handleChange("serviceType", selected);
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={(clientFilters.serviceType || []).length === 2}
                    indeterminate={
                      (clientFilters.serviceType || []).length > 0 &&
                      (clientFilters.serviceType || []).length < 2
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                <MenuItem value="Towing">
                  <Checkbox
                    checked={(clientFilters.serviceType || []).includes(
                      "Towing"
                    )}
                  />
                  <ListItemText primary="Towing" />
                </MenuItem>

                <MenuItem value="RSR">
                  <Checkbox
                    checked={(clientFilters.serviceType || []).includes("RSR")}
                  />
                  <ListItemText primary="RSR" />
                </MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT SEARCH */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search Report"
            value={clientFilters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": { borderRadius: "8px" },
              "& fieldset": { border: "1.5px solid #afafb1ff" },
            }}
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

export default ClientFilter;
