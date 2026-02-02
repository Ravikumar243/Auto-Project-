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
import { VendorFailureContext } from "../vendorFailure/VendorFailureHook";
import { useContext, useEffect } from "react";

const FilterBar = () => {
  const {
    vendorPerformanceFilters,
    setVendorPerformanceFilters,
    states,
    cities,
    vendors,
    stateCityLoading,
    vendorLoading,
    fetchVendors,
  } = useContext(VendorFailureContext);

 useEffect(() => {
  fetchVendors({
    stateNames: vendorPerformanceFilters.stateNames,
    cityNames: vendorPerformanceFilters.cityNames,
  });
}, [
  vendorPerformanceFilters.stateNames,
  vendorPerformanceFilters.cityNames,
]);

useEffect(() => {
  setVendorPerformanceFilters((prev) => ({
    ...prev,
    vendorIds: [],
  }));
}, [
  vendorPerformanceFilters.stateNames,
  vendorPerformanceFilters.cityNames,
]);


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
                value={vendorPerformanceFilters.fromDate || ""}
                onChange={(e) =>
                  setVendorPerformanceFilters((prev) => ({
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
                value={vendorPerformanceFilters.toDate || ""}
                onChange={(e) =>
                  setVendorPerformanceFilters((prev) => ({
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
                  value: vendorPerformanceFilters.stateNames || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = states;

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        vendorPerformanceFilters.stateNames?.includes(val),
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    setVendorPerformanceFilters((prev) => ({
                      ...prev,
                      stateNames: selected,
                      cityNames: [], // reset cities
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
                      vendorPerformanceFilters.stateNames?.length ===
                        states.length
                    }
                    indeterminate={
                      vendorPerformanceFilters.stateNames?.length > 0 &&
                      vendorPerformanceFilters.stateNames?.length <
                        states.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {states.map((state) => (
                  <MenuItem key={state} value={state}>
                    <Checkbox
                      checked={(
                        vendorPerformanceFilters.stateNames || []
                      ).includes(state)}
                    />
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
                  value: vendorPerformanceFilters.cityNames || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = cities;

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        vendorPerformanceFilters.cityNames?.includes(val),
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    setVendorPerformanceFilters((prev) => ({
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
                      vendorPerformanceFilters.cityNames?.length ===
                        cities.length
                    }
                    indeterminate={
                      vendorPerformanceFilters.cityNames?.length > 0 &&
                      vendorPerformanceFilters.cityNames?.length < cities.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {cities.map((city) => (
                  <MenuItem key={city} value={city}>
                    <Checkbox
                      checked={(
                        vendorPerformanceFilters.cityNames || []
                      ).includes(city)}
                    />
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
                  value: vendorPerformanceFilters.vendorIds || [],
                  onChange: (e) => {
                    let selected = e.target.value;
                    const allValues = vendors.map((v) => v.vendorId);

                    if (selected.includes("ALL")) {
                      const isAllSelected = allValues.every((val) =>
                        vendorPerformanceFilters.vendorIds?.includes(val),
                      );
                      selected = isAllSelected ? [] : allValues;
                    }

                    setVendorPerformanceFilters((prev) => ({
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
                      vendorPerformanceFilters.vendorIds?.length ===
                        vendors.length
                    }
                    indeterminate={
                      vendorPerformanceFilters.vendorIds?.length > 0 &&
                      vendorPerformanceFilters.vendorIds?.length <
                        vendors.length
                    }
                  />
                  <ListItemText primary="All" />
                </MenuItem>

                {vendors.map((vendor) => (
                  <MenuItem key={vendor.vendorId} value={vendor.vendorId}>
                    <Checkbox
                      checked={(
                        vendorPerformanceFilters.vendorIds || []
                      ).includes(vendor.vendorId)}
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
            placeholder="Search by Vendor Name"
            value={vendorPerformanceFilters.search}
            onChange={(e) =>
              setVendorPerformanceFilters((prev) => ({
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

export default FilterBar;
