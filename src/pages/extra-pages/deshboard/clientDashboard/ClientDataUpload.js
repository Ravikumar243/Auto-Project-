import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import MainCard from "components/MainCard";

const ClientDataUpload = () => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) return;
    console.log("Uploading file:", file);
  };

  return (
    <div className="mt-0">
      <MainCard
        sx={{
          minHeight: "180px",
          padding: 3,
        }}
      >
        <Box>
          <Typography variant="h5" className="mb-2">
            Upload Client Data
          </Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            {/* Hidden input */}
            <input
              type="file"
              accept=".xlsx,.xls,.csv"
              id="client-upload"
              hidden
              onChange={handleFileChange}
            />

            {/* Choose File */}
            <label htmlFor="client-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUploadIcon />}
                sx={{
                  height: "35px",
                  color: "#7e00d1",
                  border: "1px solid #7e00d1",
                  backgroundColor: "#faf5ff",
                  fontSize: "12px",
                  "&:hover": {
                    backgroundColor: "#7e00d1",
                    color: "#fff",
                  },
                }}
              >
                Choose File
              </Button>
            </label>

            {/* File Name */}
            {file && (
              <Typography
                sx={{
                  fontSize: "13px",
                  width: "380px", // ⬅️ increased width
                  height: "35px", // ⬅️ match button height
                  display: "flex",
                  alignItems: "center",
                  px: 1.5,
                  border: "1px solid #7e00d1",
                  borderRadius: "5px",
                  backgroundColor: "#faf5ff",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {file.name}
              </Typography>
            )}

            {/* Upload Button */}
            <Button
              variant="contained"
              disabled={!file}
              onClick={handleUpload}
              sx={{
                height: "35px",
                backgroundColor: "#7e00d1",
                fontSize: "12px",
                "&:hover": {
                  backgroundColor: "#7e00d9",
                },
              }}
            >
              Upload File
            </Button>
          </Box>
        </Box>
      </MainCard>
    </div>
  );
};

export default ClientDataUpload;
