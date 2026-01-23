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
                value={vendorPerformanceFilters.stateNames}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                onChange={(e) =>
                  setVendorPerformanceFilters((prev) => ({
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
                      <Checkbox
                        checked={vendorPerformanceFilters.stateNames.includes(
                          state
                        )}
                      />
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
                value={vendorPerformanceFilters.cityNames}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) => selected.join(", "),
                }}
                onChange={(e) =>
                  setVendorPerformanceFilters((prev) => ({
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
                      <Checkbox
                        checked={vendorPerformanceFilters.cityNames.includes(
                          city
                        )}
                      />
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
                value={vendorPerformanceFilters.vendorIds}
                SelectProps={{
                  multiple: true,
                  renderValue: (selected) =>
                    vendors
                      .filter((v) => selected.includes(v.vendorId))
                      .map((v) => v.vendoR_NAME)
                      .join(", "),
                }}
                onChange={(e) =>
                  setVendorPerformanceFilters((prev) => ({
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
                        checked={vendorPerformanceFilters.vendorIds.includes(
                          vendor.vendorId
                        )}
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
