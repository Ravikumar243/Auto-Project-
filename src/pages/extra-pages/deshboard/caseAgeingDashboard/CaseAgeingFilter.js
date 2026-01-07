import React from 'react'
import { Box, Grid, TextField, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const CaseAgeingFilter = () => {
  return (
    <div>
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
            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Duration"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& fieldset": {
                    border:'1.5px solid #afafb1ff'
                  },
                }}
              >
                <MenuItem value="">Select Duration</MenuItem>
                <MenuItem value="today">Today</MenuItem>
                <MenuItem value="7">Last 7 Days</MenuItem>
                <MenuItem value="30">Last 30 Days</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Incident"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& fieldset": {
                    border:'1.5px solid #afafb1ff'
                  },
                }}
              >
                <MenuItem value="">Select State</MenuItem>
                <MenuItem value="up">Uttar Pradesh</MenuItem>
                <MenuItem value="mh">Maharashtra</MenuItem>
              </TextField>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                select
                fullWidth
                size="small"
                label="Select Client"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "8px",
                  },
                  "& fieldset": {
                    border:'1.5px solid #afafb1ff'
                  },
                }}
              >
                <MenuItem value="">Select City</MenuItem>
                <MenuItem value="noida">Noida</MenuItem>
                <MenuItem value="pune">Pune</MenuItem>
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
              },
              "& fieldset": {
                    border:'1.5px solid #afafb1ff'
                  },
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
    </div>
  )
}

export default CaseAgeingFilter
