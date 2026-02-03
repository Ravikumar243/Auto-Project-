import MainCard from "components/MainCard";
import React from "react";
import { Grid } from "@mui/material";
import { ToastContainer } from "react-toastify";
// import { Padding } from '../../../../node_modules/@mui/icons-material/index';
import { Card, CardContent, Typography, Box } from "@mui/material";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ActiveCses from "./ActiveCses";
import ActiveCasesHook from "./ActiveCasesHook";
import VendorDashboard from "./vendorDashboard/VendorDashboard";

// import { Data } from './ActiveCses'

const DashboardDetails = () => {
  const { activeCases, escalated, mycases } = ActiveCasesHook();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = (userInfo?.role || "Agent").toLowerCase();
  console.log(userRole, "userRole");

  const allCards = [
    {
      title: "Total Cases",
      value: activeCases.length,
      bg: "linear-gradient(135deg, #6FAEFF 0%, #CFE3FF 100%)",
      titleColor: "#1E6FFF",
      roles: ["admin", "agent", "vendor", "qa", "sme",'tl', 'headac',"am"],
    },
    {
      title: "My Cases",
      value: mycases.length,
      bg: "linear-gradient(135deg, #6FDCC8 0%, #CFF7EF 100%)",
      titleColor: "#0E8F7A",
      roles: ["admin", "agent", "vendor", "qa", "sme",'tl','headac','am'],
    },
    {
      title: "Escalated",
      value: escalated.length,
      bg: "linear-gradient(135deg, #FFC96B 0%, #FFE3A6 100%)",
      titleColor: "#D28A00",
      roles: ["admin", "agent", "vendor", "qa", "sme",'tl', 'headac','am'],
    },
    {
      title: "Closed Cases",
      value: 10,
      bg: "linear-gradient(135deg, #C7D1E2 0%, #E6ECF5 100%)",
      titleColor: "#7A869A",
      roles: ["vendor"],
    },
    {
      title: "Pending Cases",
      value: 7,
      bg: "linear-gradient(135deg, #9C8CFF 0%, #D6CFFF 100%)",
      titleColor: "#6A5BFF",
      roles: ["vendor"],
    },
  ];

  const visibleCards = allCards.filter((card) => card.roles.includes(userRole));

  return (
    <>
      <MainCard
        title="All Travel Claims"
        sx={{
          background: "transparent",
          boxShadow: "none",
          border: "none",
          padding: 0, // optional
        }}
      >
        <Grid item xs={12} md={12} lg={12}>
          <Grid>
            <ToastContainer />
          </Grid>

          {/* <div className="d-flex gap-5"> */}
          <Grid
            sx={{
              display: "grid",
              gridTemplateColumns: {
                xs: "1fr",
                sm: "repeat(2, 1fr)",
                md: "repeat(3, 1fr)",
                lg: "repeat(3, 1fr)",
              },
              gap: 2,
            }}
          >
            {visibleCards.map((card, index) => (
              <Card
                sx={{
                  width: "100%",
                  borderRadius: 3,
                  boxShadow: 2,
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* CARD CONTENT */}
                <CardContent
                  sx={{
                    background: card.bg,
                    height: 120,
                    display: "flex",
                    alignItems: "center",
                    padding: "16px 20px",
                  }}
                >
                  <Box>
                    <Typography
                      sx={{
                        color: card.titleColor,
                        fontWeight: 600,
                        fontSize: "20px",
                        lineHeight: 1.2,
                      }}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      sx={{
                        color: "#fff",
                        fontWeight: 700,
                        fontSize: "40px",
                        marginTop: "10px",
                        lineHeight: 1,
                      }}
                    >
                      {card.value}
                    </Typography>
                  </Box>
                </CardContent>

                {/* 🔥 RIGHT-MIDDLE → BOTTOM-MIDDLE WAVE */}
                <Box
                  sx={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    width: "75%",
                    height: "80%",
                    pointerEvents: "none",
                  }}
                >
                  <svg
                    viewBox="0 0 300 300"
                    width="100%"
                    height="100%"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="
            M300 120
            C240 100, 220 180, 170 190
            C120 200, 90 250, 150 300
            L300 300 Z
          "
                      fill="rgba(255,255,255,0.35)"
                    />
                  </svg>
                </Box>
              </Card>
            ))}
          </Grid>
          {/* </div> */}

          {["admin", "agent", "vendor", "qa", "sme",'tl', 'headac','am'].includes(userRole) && (
            <ActiveCses />
          )}

          {userRole === "vendor" && <VendorDashboard />}
        </Grid>
      </MainCard>
    </>
  );
};

export default DashboardDetails;
