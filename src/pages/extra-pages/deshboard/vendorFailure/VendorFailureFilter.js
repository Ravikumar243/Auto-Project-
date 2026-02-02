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

import { VendorFailureContext } from "./VendorFailureHook";

const VendorFailureFilter = () => {
  const {
    fetchVendors,
    vendors,
    vendorLoading,
    states,
    cities,
    filters,
    setFilters,
    stateCityLoading,
  } = useContext(VendorFailureContext);

 useEffect(() => {
  fetchVendors({
    stateNames: filters.stateNames,
    cityNames: filters.cityNames,
  });
}, [filters.stateNames, filters.cityNames]);

useEffect(() => {
  setFilters((prev) => ({
    ...prev,
    vendorIds: [],
  }));
}, [filters.stateNames, filters.cityNames]);


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
            {/* DURATION */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                type="date"
                fullWidth
                size="small"
                label="From Date"
                InputLabelProps={{ shrink: true }}
                value={filters.fromDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    fromDate: e.target.value || null,
                  }))
                }
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
                value={filters.toDate || ""}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    toDate: e.target.value || null,
                  }))
                }
              />
            </Grid>

            {/* STATE MULTI SELECT */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select State"
                SelectProps={{
                  multiple: true,
                  value: filters.stateNames || [],
                  onChange: (e) => {
                    let selected = e.target.value.filter((v) => v !== "ALL");
                    const allValues = states;

                    if (e.target.value.includes("ALL")) {
                      selected =
                        selected.length === allValues.length ? [] : allValues;
                    }

                    setFilters((prev) => ({
                      ...prev,
                      stateNames: selected,
                      cityNames: [],
                    }));
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      states.length > 0 &&
                      filters.stateNames?.length === states.length
                    }
                    indeterminate={
                      filters.stateNames?.length > 0 &&
                      filters.stateNames?.length < states.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    <Checkbox checked={filters.stateNames.includes(state)} />
                    <ListItemText primary={state} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* CITY MULTI SELECT */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select City"
                SelectProps={{
                  multiple: true,
                  value: filters.cityNames || [],
                  onChange: (e) => {
                    let selected = e.target.value.filter((v) => v !== "ALL");
                    const allValues = cities;

                    if (e.target.value.includes("ALL")) {
                      selected =
                        selected.length === allValues.length ? [] : allValues;
                    }

                    setFilters((prev) => ({
                      ...prev,
                      cityNames: selected,
                    }));
                  },
                  renderValue: (selected) =>
                    Array.isArray(selected) ? selected.join(", ") : "",
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      cities.length > 0 &&
                      filters.cityNames?.length === cities.length
                    }
                    indeterminate={
                      filters.cityNames?.length > 0 &&
                      filters.cityNames?.length < cities.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    <Checkbox checked={filters.cityNames.includes(city)} />
                    <ListItemText primary={city} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Vendor"
                SelectProps={{
                  multiple: true,
                  value: filters.vendorIds || [],
                  onChange: (e) => {
                    let selected = e.target.value.filter((v) => v !== "ALL");
                    const allValues = vendors.map((v) => v.vendorId);

                    if (e.target.value.includes("ALL")) {
                      selected =
                        selected.length === allValues.length ? [] : allValues;
                    }

                    setFilters((prev) => ({
                      ...prev,
                      vendorIds: selected,
                    }));
                  },
                  renderValue: (selected) =>
                    vendors
                      .filter((v) => selected.includes(v.vendorId))
                      .map((v) => v.vendoR_NAME)
                      .join(", "),
                }}
              >
                <MenuItem value="ALL">
                  <Checkbox
                    checked={
                      vendors.length > 0 &&
                      filters.vendorIds?.length === vendors.length
                    }
                    indeterminate={
                      filters.vendorIds?.length > 0 &&
                      filters.vendorIds?.length < vendors.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {vendors.map((vendor) => (
                  <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                    <Checkbox
                      checked={filters.vendorIds.includes(vendor.vendorId)}
                    />
                    <ListItemText primary={vendor.vendoR_NAME} />
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>
        </Grid>

        {/* RIGHT SEARCH */}
        <Grid item xs={12} md={3}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search by SRN Number"
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
              }))
            }
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

export default VendorFailureFilter;
