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
    fetchVendors();
  }, []);

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
                value={filters.stateNames}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    stateNames: e.target.value,
                    cityNames: [], // reset cities when state changes (best practice)
                  }))
                }
              >
                {stateCityLoading ? (
                  <MenuItem disabled>Loading states...</MenuItem>
                ) : (
                  states.map((state) => (
                    <MenuItem key={state} value={state}>
                      <Checkbox checked={filters.stateNames.includes(state)} />
                      <ListItemText primary={state} />
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            {/* CITY MULTI SELECT */}
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select City"
                value={filters.cityNames}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    cityNames: e.target.value,
                  }))
                }
              >
                {stateCityLoading ? (
                  <MenuItem disabled>Loading cities...</MenuItem>
                ) : cities.length === 0 ? (
                  <MenuItem disabled>Select state first</MenuItem>
                ) : (
                  cities.map((city) => (
                    <MenuItem key={city} value={city}>
                      <Checkbox checked={filters.cityNames.includes(city)} />
                      <ListItemText primary={city} />
                    </MenuItem>
                  ))
                )}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Vendor"
                value={filters.vendorIds}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    vendors
                      .filter((v) => selected.includes(v.vendorId))
                      .map((v) => v.vendoR_NAME)
                      .join(", "),
                }}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    vendorIds: e.target.value, 
                  }))
                }
              >
                {vendorLoading ? (
                  <MenuItem disabled>Loading vendors...</MenuItem>
                ) : (
                  vendors.map((vendor) => (
                    <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                      <Checkbox
                        checked={filters.vendorIds.includes(vendor.vendorId)}
                      />
                      <ListItemText primary={vendor.vendoR_NAME} />
                    </MenuItem>
                  ))
                )}
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
