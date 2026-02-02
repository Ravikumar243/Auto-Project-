import PropTypes from "prop-types";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  List,
} from "@mui/material";

import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SearchIcon from "@mui/icons-material/Search";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import SpeedIcon from "@mui/icons-material/Speed";
import NetworkCheckIcon from "@mui/icons-material/NetworkCheck";
import BusinessIcon from "@mui/icons-material/Business";
import BarChartIcon from "@mui/icons-material/BarChart";
import InsightsIcon from "@mui/icons-material/Insights";
import ApartmentIcon from "@mui/icons-material/Apartment";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";

const NavItem = ({ level, drawerOpen }) => {
  const { pathname } = useLocation();
  // const [selectedVal, setSelectedVal] = useState("dashboard");

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role || "Agent";

  // const itemHandler = (id) => setSelectedVal(id);

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <DirectionsCarIcon />,
      url: "/dashboarddetails",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
      ],
    },
    {
      id: "vendorDashboard",
      label: "Vendor Dashboard",
      icon: <BusinessIcon />,
      url: "/vendor-dashboard",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
      ],
    },
    {
      id: "clientDashboard",
      label: "Client Dashboard",
      icon: <BarChartIcon />,
      url: "/client-dashboard",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
        // "Client",
      ],
    },
   
    {
      id: "agentDashboard",
      label: "Agent Dashboard",
      icon: <InsightsIcon />,
      url: "/agent-dashboard",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
      ],
    },
    {
      id: "caseAgeingDashboard",
      label: "Case Ageing",
      icon: <ApartmentIcon />,
      url: "/case-ageing-dashboard",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
        // "Client",
      ],
    },
     {
      id: "caseAgeingClient",
      label: "Case Ageing Client",
      icon: <UploadFileIcon />,
      url: "/caseAgeingClient",
      roles: ["Admin","Client"],
    },
    {
      id: "vendorFailureDashboard",
      label: "Vendor Failure",
      icon: <HourglassBottomIcon />,
      url: "/venodr-failure-dashboard",
      roles: [
        "Admin",
        "Agent",
        "Advisor",
        "AM",
        "HeadAC",
        "QA",
        "SME",
        "TL",
        "Vendor",
      ],
    },
    {
      id: "searchdashboard",
      label: "Search Support",
      icon: <SearchIcon />,
      url: "/Index",
      roles: ["Admin", "Agent", "Advisor", "AM", "HeadAC", "QA", "SME", "TL"],
    },
    {
      id: "createSupport",
      label: "Create Support Ticket",
      icon: <DescriptionOutlinedIcon />,
      url: "/createTickets",
      roles: ["Admin", "Agent", "Advisor", "AM", "HeadAC", "SME", "TL"],
      // onClick: () => {
      //   window.location.href = "/createTickets";
      // },
    },
    {
      id: "uploadDetails",
      label: "Upload Details",
      icon: <UploadFileIcon />,
      url: "/UploadDetails",
      roles: ["Admin"],
    },

    {
      id: "clientDataUpload",
      label: "Client Data Upload",
      icon: <UploadFileIcon />,
      url: "/clientDataUpload",
      roles: ["Admin"],
    },
    {
      id: "networkDetails",
      label: "Network Details",
      icon: <NetworkCheckIcon />,
      url: "/netwokDetails",
      roles: ["Admin"],
    },
    {
      id: "createUser",
      label: "Create User",
      icon: <PersonAddAlt1Icon />,
      url: "/create-user",
      roles: ["Admin"],
    },
    {
      id: "vcrfRecord",
      label: "VCRF Record",
      icon: <DescriptionOutlinedIcon />,
      url: "/vcrf-record",
      roles: ["Admin", "Agent", "Advisor", "AM", "HeadAC", "SME", "TL"],
    },
    {
      id: "feedback",
      label: "Feedback Record",
      icon: <DescriptionOutlinedIcon />,
      url: "/feedback",
      roles: ["Admin", "Agent", "AM", "HeadAC", "QA", "SME", "TL"],
    },
    {
      id: "spinny",
      label: "Spinny Data",
      icon: <DescriptionOutlinedIcon />,
      url: "/spinny-data",
      roles: ["Admin", "Agent"],
    },
    {
      id: "misdetails",
      label: "MIS",
      icon: <SpeedIcon />,
      url: "/misreport",
      roles: ["Admin", "Agent", "Advisor", "AM", "HeadAC", "TL"],
    },
    {
      id: "oldmis",
      label: "Old MIS Upload",
      icon: <SpeedIcon />,
      url: "/old-mis-upload",
      roles: ["Admin"],
    },
    {
      id: "slaReport",
      label: "SLA Report",
      icon: <SpeedIcon />,
      url: "/slnDeshboard",
      roles: ["Admin", "AM", "HeadAC"],
    },
    {
      id: "uploadStatecity",
      label: "Upload State/ City",
      icon: <UploadFileIcon />,
      url: "/uploderstatecity",
      roles: ["Admin"],
    },
    {
      id: "uploadMakemodels",
      label: "Upload Make/ Models",
      icon: <UploadFileIcon />,
      url: "/uploderMakemodels",
      roles: ["Admin"],
    },
  ];

  return (
    <List>
      {menuItems
        .filter((menu) => menu.roles.includes(userRole))
        .map((menu) => (
          <ListItemButton
            key={menu.id}
            component={Link}
            to={menu.url}
            // component={menu.id === "createSupport" ? "a" : Link}
            // href={menu.id === "createSupport" ? menu.url : undefined}
            // to={menu.id !== "createSupport" ? menu.url : undefined}
            // selected={selectedVal === menu.id}
            selected={pathname === menu.url}
            onClick={() => {
              // itemHandler(menu.id);
              if (menu.id === "createSupport") {
                window.location.href = menu.url;
              }
            }}
            sx={{
              pl: drawerOpen ? `${level * 28}px` : 1.5,
              py: 1,
              "&.Mui-selected": {
                backgroundColor: "#5932ea",
                color: "#ffffffff",
                "&:hover": {
                  backgroundColor: "#5932ea",
                  color: "#ffffffff",
                },
              },
              "&:hover": {
                bgcolor: "#f5f5f5",
                color: "#282828",
                "& .MuiListItemIcon-root": {
                  color: "#282828",
                },
              },
            }}
          >
            <ListItemIcon
              sx={{ color: pathname === menu.url ? "white" : "#282828" }}
            >
              {menu.icon}
            </ListItemIcon>
            <ListItemText
              primary={<Typography variant="h6">{menu.label}</Typography>}
              className="ms-2"
            />
          </ListItemButton>
        ))}
    </List>
  );
};

NavItem.propTypes = {
  level: PropTypes.number,
  drawerOpen: PropTypes.bool,
};

export default NavItem;
