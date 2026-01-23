import React, { useContext } from "react";
import { Box, Card } from "@mui/material";
import ActiveCasesHook from "../ActiveCasesHook";
import { Grid } from "@mui/material";
import { CardContent, Typography } from "@mui/material";

import VendorFailureTable from "./VendorFailureTable";
import VendorFailureFilter from "./VendorFailureFilter";
import { VendorFailureContext } from "./VendorFailureHook";
// import VendorPerformanceTable from "./VendorPerformanceTable";

const VendorFailureDashboard = () => {
  const { activeCases, escalated, mycases } = ActiveCasesHook();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = (userInfo?.role || "Agent").toLowerCase();

  const { VendorFailureData } = useContext(VendorFailureContext);
  console.log(VendorFailureData, "VendorFailureData");
  const allCards = [
    {
      title: "Vendor Failure Report",
      //   value: activeCases.length,
      bg: "linear-gradient(135deg, #6FAEFF 0%, #CFE3FF 100%)",
      titleColor: "#1E6FFF",
      roles: ["admin", "vendor"],
    },
  ];

  const visibleCards = allCards.filter((card) => card.roles.includes(userRole));

  return (
    <Box>
      <div className="d-flex gap-5">
        <Box width="100%">
          {visibleCards.map((card, index) => (
            <Grid item>
              <Card
                sx={{
                  width: "100%",
                  height: 120,
                  borderRadius: 3,
                  position: "relative",
                  overflow: "hidden",
                  background: "linear-gradient(135deg, #5FA2FF, #A7D1FF)",
                }}
              >
                {/* TITLE */}
                <Box
                  sx={{
                    position: "relative",
                    zIndex: 2,
                    padding: "16px 24px",
                  }}
                >
                  <Typography
                    sx={{
                      color: "#fff",
                      fontSize: "26px",
                      fontWeight: 600,
                    }}
                  >
                    {card.title}
                  </Typography>
                </Box>

                {/* 🌊 WAVE */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    zIndex: 1,
                  }}
                >
                  <svg
                    viewBox="0 0 1440 200"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="
        M600 200
        C760 160, 860 120, 980 120
        C1100 120, 1180 80, 1260 70
        C1340 60, 1400 80, 1440 90
        L1440 200
        Z
      "
                      fill="rgba(255,255,255,0.35)"
                    />
                  </svg>
                </Box>
              </Card>
            </Grid>
          ))}
        </Box>
      </div>
      <VendorFailureFilter />

      <Box mt={3}>
        <VendorFailureTable />
      </Box>
    </Box>
  );
};

export default VendorFailureDashboard;
