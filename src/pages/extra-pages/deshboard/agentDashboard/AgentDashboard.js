import React, { useContext, useState } from "react";
import { Box, Card, Grid, CardContent, Typography } from "@mui/material";
import AgentFilter from "./AgentFilter";
import AgentTable from "./AgentTable";
import { AgentContext } from "./AgentDashboardHook";

const AgentDashboard = () => {
  const { agentFilteredTotal } = useContext(AgentContext);

  const [activeBreakdown, setActiveBreakdown] = useState(null);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = (userInfo?.role || "Agent").toLowerCase();

  const allCards = [
    {
      title: "Total No of Cases",
      value: agentFilteredTotal?.totalCases || 0,
      bg: "linear-gradient(135deg, #6FAEFF 0%, #CFE3FF 100%)",
      titleColor: "#1E6FFF",
      roles: ["admin", "vendor"],
    },
    {
      title: "Cases Completed",
      value: agentFilteredTotal?.completedCases || 0,
      bg: "linear-gradient(135deg, #6FDCC8 0%, #CFF7EF 100%)",
      titleColor: "#0E8F7A",
      roles: ["admin", "vendor"],
      isCompletedCard: true,
    },
    {
      title: "Open Cases",
      value: agentFilteredTotal?.openCases || 0,
      bg: "linear-gradient(135deg, #FFC96B 0%, #FFE3A6 100%)",
      titleColor: "#D28A00",
      roles: ["admin", "vendor"],
      isOpenCard: true,
    },
    {
      title: "Cancelled Cases",
      value: agentFilteredTotal?.cancelledCases || 0,
      bg: "linear-gradient(135deg, #C7D1E2 0%, #E6ECF5 100%)",
      titleColor: "#7A869A",
      roles: ["admin", "vendor"],
      isCancelledCard: true,
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
            key={index}
            onClick={() => {
              if (card.isOpenCard) {
                setActiveBreakdown((prev) => (prev === "open" ? null : "open"));
              }

              if (card.isCancelledCard) {
                setActiveBreakdown((prev) =>
                  prev === "cancelled" ? null : "cancelled",
                );
              }

              if (card.isCompletedCard) {
                setActiveBreakdown((prev) =>
                  prev === "completed" ? null : "completed",
                );
              }
            }}
            sx={{
              borderRadius: 3,
              boxShadow: 2,
              position: "relative",
              overflow: "hidden",
              cursor:
                card.isOpenCard || card.isCancelledCard || card.isCompletedCard
                  ? "pointer"
                  : "default",
            }}
          >
            <CardContent
              sx={{
                background: card.bg,
                height: 120,
                display: "flex",
                alignItems: "center",
                padding: "16px 20px",
                border:
                  (card.isOpenCard && activeBreakdown === "open") ||
                  (card.isCancelledCard && activeBreakdown === "cancelled") ||
                  (card.isCompletedCard && activeBreakdown === "completed")
                    ? "1px solid #1976d2"
                    : "none",
              }}
            >
              <Box>
                <Typography
                  sx={{
                    color: card.titleColor,
                    fontWeight: 600,
                    fontSize: "20px",
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

      {/* OPEN BREAKDOWN */}
      {activeBreakdown === "open" && (
        <Grid
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(5, 1fr)",
            },
            gap: 2,
          }}
        >
          {[
            {
              title: "Vendor Not Assign",
              value: agentFilteredTotal?.caseInitiated || 0,
              bg: "linear-gradient(135deg, #FF8A80 0%, #FFCDD2 100%)",
              titleColor: "#C62828",
            },
            {
              title: "On the way to Incident",
              value: agentFilteredTotal?.enRoute || 0,
              bg: "linear-gradient(135deg, #FFD54F 0%, #FFF3C0 100%)",
              titleColor: "#E65100",
            },
            {
              title: "Reached at Incident",
              value: agentFilteredTotal?.atLocation || 0,
              bg: "linear-gradient(135deg, #81D4FA 0%, #E1F5FE 100%)",
              titleColor: "#0277BD",
            },
            {
              title: "On the way to drop",
              value: agentFilteredTotal?.onRoute || 0,
              bg: "linear-gradient(135deg, #CE93D8 0%, #F3E5F5 100%)",
              titleColor: "#6A1B9A",
            },
            {
              title: "Drop Completed",
              value: agentFilteredTotal?.dropDone || 0,
              bg: "linear-gradient(135deg, #A5D6A7 0%, #E8F5E9 100%)",
              titleColor: "#2E7D32",
            },
          ].map((item, i) => (
            <Card
              key={i}
              sx={{
                borderRadius: 3,
                boxShadow: 2,
                overflow: "hidden",
              }}
            >
              <CardContent
                sx={{
                  background: item.bg,
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <Typography
                  sx={{
                    color: item.titleColor,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "28px",
                    marginTop: "6px",
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}

      {/* CANCELLED BREAKDOWN */}
      {activeBreakdown === "cancelled" && (
        <Grid
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 2,
          }}
        >
          {[
            {
              title: "Case Cancelled",
              value: agentFilteredTotal?.onlyCancelled || 0,
              bg: "linear-gradient(135deg, #B0BEC5 0%, #ECEFF1 100%)",
              titleColor: "#37474F",
            },
            {
              title: "Case Denied",
              value: agentFilteredTotal?.caseDenied || 0,
              bg: "linear-gradient(135deg, #EF9A9A 0%, #FFEBEE 100%)",
              titleColor: "#C62828",
            },
             {
              title: "Service Recalled",
              value: agentFilteredTotal?.serviceRecalled || 0,
              bg: "linear-gradient(135deg, #A5D6A7 0%, #E8F5E9 100%)",
              titleColor: "#2E7D32",
            },
          ].map((item, i) => (
            <Card key={i} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent
                sx={{
                  background: item.bg,
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <Typography
                  sx={{
                    color: item.titleColor,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "28px",
                    marginTop: "6px",
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}

      {/* COMPLETED BREAKDOWN */}
      {activeBreakdown === "completed" && (
        <Grid
          sx={{
            mt: 3,
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 2,
          }}
        >
          {[
            {
              title: "Cases Completed",
              value: agentFilteredTotal?.onlyCaseCompleted || 0,
              bg: "linear-gradient(135deg, #6FDCC8 0%, #CFF7EF 100%)",
              titleColor: "#0E8F7A",
            },
            {
              title: "Complete Enquiry",
              value: agentFilteredTotal?.completeEnquiry || 0,
              bg: "linear-gradient(135deg, #81D4FA 0%, #E1F5FE 100%)",
              titleColor: "#0277BD",
            },
          ].map((item, i) => (
            <Card key={i} sx={{ borderRadius: 3, boxShadow: 2 }}>
              <CardContent
                sx={{
                  background: item.bg,
                  height: 100,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  padding: "16px",
                }}
              >
                <Typography
                  sx={{
                    color: item.titleColor,
                    fontWeight: 600,
                    fontSize: "16px",
                  }}
                >
                  {item.title}
                </Typography>

                <Typography
                  sx={{
                    color: "#fff",
                    fontWeight: 700,
                    fontSize: "28px",
                    marginTop: "6px",
                  }}
                >
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Grid>
      )}

      <AgentFilter />

      <Box mt={3}>
        <AgentTable />
      </Box>
    </Box>
  );
};

export default AgentDashboard;
