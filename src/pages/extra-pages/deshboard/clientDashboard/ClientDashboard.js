import React from "react";
import { Box, Card } from "@mui/material";
import ActiveCasesHook from "../ActiveCasesHook";
import { Grid } from "@mui/material";
import { CardContent, Typography } from "@mui/material";

import ClientTable from "./ClientTable";
import ClientFilter from "./ClientFilter";
// import VendorPerformanceTable from "./VendorPerformanceTable";

const ClientDashboard = () => {
  const { activeCases, escalated, mycases } = ActiveCasesHook();
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = (userInfo?.role || "Agent").toLowerCase();

  const allCards = [
    {
      title: "Total No of Cases",
      value: activeCases.length,
      bg: "linear-gradient(135deg, #6FAEFF 0%, #CFE3FF 100%)",
      titleColor: "#1E6FFF",
      roles: ["admin", "vendor"],
    },
    {
      title: "Cases Completed",
      value: mycases.length,
      bg: "linear-gradient(135deg, #6FDCC8 0%, #CFF7EF 100%)",
      titleColor: "#0E8F7A",
      roles: ["admin", "vendor"],
    },
    {
      title: "Open Cases",
      value: escalated.length,
      bg: "linear-gradient(135deg, #FFC96B 0%, #FFE3A6 100%)",
      titleColor: "#D28A00",
      roles: ["admin", "vendor"],
    },
    {
      title: "Cancelled Cases",
      value: 10,
      bg: "linear-gradient(135deg, #C7D1E2 0%, #E6ECF5 100%)",
      titleColor: "#7A869A",
      roles: ["admin", "vendor"],
    },
    
  ];

  const visibleCards = allCards.filter((card) => card.roles.includes(userRole));

  return (
    <Box>
     
        <Grid
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {visibleCards.map((card, index) => (
            
              <Card
                sx={{
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
      
      <ClientFilter/>

      <Box mt={3}>
        <ClientTable />
      </Box>
    </Box>
  );
};

export default ClientDashboard;
