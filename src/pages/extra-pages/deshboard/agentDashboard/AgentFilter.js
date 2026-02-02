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
  SUB_STATUS_LIST,
  STATUS_LIST,
  INCIDENT_TYPE_LIST,
} from "./AgentDashboardHook";

const AgentFilter = () => {
  const {
    fetchUserList,
    agentList,
    fetchAgentData,
    agentFilters,
    setAgentFilters,
  } = useContext(AgentContext);

  useEffect(() => {
    fetchUserList();
  }, []);

  useEffect(() => {
    fetchAgentData();
  }, [fetchAgentData, agentFilters]);

  console.log(agentList, "agentList");

  const handleChange = (key, value) => {
    setAgentFilters((prev) => ({
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
        {/* LEFT FILTERS */}
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
                value={agentFilters.fromDate}
                onChange={(e) => handleChange("fromDate", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& fieldset": { border: "1.5px solid #afafb1ff" },
                }}
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
                value={agentFilters.toDate}
                onChange={(e) => handleChange("toDate", e.target.value)}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& fieldset": { border: "1.5px solid #afafb1ff" },
                }}
              />
            </Grid>

            {/* <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Incident"
                SelectProps={{
                  multiple: true,
                  value: agentFilters.incidentTypes || [],
                  onChange: (e) =>
                    handleChange("incidentTypes", e.target.value),
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
                sx={{
                  "& .MuiOutlinedInput-root": { borderRadius: "8px" },
                  "& fieldset": { border: "1.5px solid #afafb1ff" },
                }}
              >
                
              </TextField>
            </Grid> */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Status"
                SelectProps={{
                  multiple: true,
                  value: agentFilters.status || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = STATUS_LIST.map((i) => i.value);

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        agentFilters.status?.includes(val)
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
                      (agentFilters.status || []).length === STATUS_LIST.length
                    }
                    indeterminate={
                      (agentFilters.status || []).length > 0 &&
                      (agentFilters.status || []).length < STATUS_LIST.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {STATUS_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={(agentFilters.status || []).includes(item.value)}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* SUB STATUS */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Sub Status"
                SelectProps={{
                  multiple: true,
                  value: agentFilters.subStatus || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = SUB_STATUS_LIST.map((i) => i.value);

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        agentFilters.subStatus?.includes(val)
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
                      (agentFilters.subStatus || []).length ===
                      SUB_STATUS_LIST.length
                    }
                    indeterminate={
                      (agentFilters.subStatus || []).length > 0 &&
                      (agentFilters.subStatus || []).length <
                        SUB_STATUS_LIST.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {SUB_STATUS_LIST.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    <Checkbox
                      checked={(agentFilters.subStatus || []).includes(
                        item.value
                      )}
                    />
                    <ListItemText primary={item.label} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* AGENTS */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Agent"
                SelectProps={{
                  multiple: true,
                  value: agentFilters.agentNames || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = agentList.map((a) => a.email);

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        agentFilters.agentNames?.includes(val)
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    handleChange("agentNames", selected);
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      agentList.length > 0 &&
                      agentFilters.agentNames?.length === agentList.length
                    }
                    indeterminate={
                      agentFilters.agentNames?.length > 0 &&
                      agentFilters.agentNames?.length < agentList.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {agentList.map((agent) => (
                  <MenuItem key={agent.uniqueId} value={agent.email}>
                    <Checkbox
                      checked={(agentFilters.agentNames || []).includes(
                        agent.email
                      )}
                    />
                    <ListItemText primary={agent.email} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Service Type"
                SelectProps={{
                  multiple: true,
                  value: agentFilters.serviceType || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = ["Towing", "RSR"];

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        agentFilters.serviceType?.includes(val)
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
                    checked={(agentFilters.serviceType || []).length === 2}
                    indeterminate={
                      (agentFilters.serviceType || []).length > 0 &&
                      (agentFilters.serviceType || []).length < 2
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                <MenuItem value="Towing">
                  <Checkbox
                    checked={(agentFilters.serviceType || []).includes(
                      "Towing"
                    )}
                  />
                  <ListItemText primary="Towing" />
                </MenuItem>

                <MenuItem value="RSR">
                  <Checkbox
                    checked={(agentFilters.serviceType || []).includes("RSR")}
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
            value={agentFilters.search}
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

export default AgentFilter;
