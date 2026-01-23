import baseURL from "api/autoApi";
import {
  createContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";

export const RSA_INCIDENT_LIST = [
  { label: "On the way to Incident", value: "On the way to Incident" },
  {
    label: "Reached at Incident location",
    value: "Reached at Incident location",
  },
  { label: "On the way to drop", value: "On the way to drop" },
  { label: "Drop Completed", value: "Drop Completed" },
  { label: "Case Completed", value: "Case Completed" },
  { label: "Case Cancelled", value: "Case Cancelled" },
  { label: "Service Recalled", value: "Service Recalled" },
  { label: "Complete-Enquiry", value: "Complete-Enquiry" },
  { label: "Case Denied", value: "Case Denied" },
  { label: "Vendor Not Assign", value: "Incident details saved" },
];

export const STATUS_LIST = [
  { label: "Completed", value: "Case Completed" },
  { label: "Cancelled", value: "Case Cancelled" },
  { label: "Complete Enquiry", value: "Complete-Enquiry" },
  { label: "Service Recalled", value: "Service Recalled" },
  { label: "Case Denied", value: "Case Denied" },
];

export const SUB_STATUS_LIST = [
  { label: "Vendor Not Assigned", value: "Incident details saved" },
  { label: "On the way to Incident", value: "On the way to Incident" },
  {
    label: "Reached at Incident location",
    value: "Reached at Incident location",
  },
  { label: "On the way to drop", value: "On the way to drop" },
  { label: "Drop Completed", value: "Drop Completed" },
];

export const INCIDENT_TYPE_LIST = [
  { label: "RSR", value: "RSR" },
  { label: "Towing", value: "Towing" },
];

export const AgentContext = createContext();

export const AgentProvider = ({ children }) => {
  const [agentList, setAgentList] = useState([]);
  const [agentData, setAgentData] = useState([]);
  const [agentLoading, setAgentLoading] = useState(false);

  const [agentFilters, setAgentFilters] = useState({
    fromDate: "",
    toDate: "",
    status: [],
    subStatus: [],
    agentNames: [],
    serviceType: [],
    search: "",
  });

  const [clientFilters, setClientFilters] = useState({
    fromDate: "",
    toDate: "",
    status: [],
    subStatus: [],
    clientNames: [],
    serviceType: [],
    search: "",
  });

  const [caseAgeingFilters, setCaseAgeingFilters] = useState({
    fromDate: null,
    toDate: null,
    status: [],
    subStatus: [],
    clientNames: [],
    serviceType: "Towing",
    seach: "",
  });

  const [clientData, setClientData] = useState([]);
  const [clientLoading, setClientLoading] = useState(false);

  const [clientList, setClientList] = useState([]);

  const [caseAgeingData, setCaseAgeingData] = useState([]);
  const [caseAgeingLoading, setCaseAgeingLoading] = useState(false);

  const [filteredTotals, setFilteredTotals] = useState(null);
  const [agentFilteredTotal, setAgentFilteredTotal] = useState({
    totalCases: 0,
    completedCases: 0,
    openCases: 0,
  });

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role?.toLowerCase();

  const userEmail = localStorage.getItem("userEmail");
  const loggedInClientName = userEmail ? userEmail.split("@")[0] : "";

  const defaultAgentFilters = {
    fromDate: "",
    toDate: "",
    status: [],
    subStatus: [],
    agentNames: [],
    search: "",
    serviceType: [],
  };

  const defaultClientFilters = {
    fromDate: "",
    toDate: "",
    status: [],
    subStatus: [],
    clientNames: [],
    serviceType: "",
    search: "",
  };

  const defaultCaseAgeingFilters = {
    fromDate: "",
    toDate: "",
    incidentTypes: [],
    status: [],
    clientNames: [],
    serviceType: "Towing",
    search: "",
  };

  useEffect(() => {
    setAgentData([]);
    setClientData([]);
    setCaseAgeingData([]);

    setAgentFilters(defaultAgentFilters);
    setClientFilters(defaultClientFilters);
    setCaseAgeingFilters(defaultCaseAgeingFilters);
  }, [userRole, loggedInClientName]);

  useEffect(() => {
    if (userRole === "client" && loggedInClientName) {
      setClientFilters((prev) => ({
        ...prev,
        clientNames: [loggedInClientName],
      }));
    }
  }, [userRole, loggedInClientName]);

  useEffect(() => {
    if (userRole === "client" && loggedInClientName) {
      setCaseAgeingFilters((prev) => ({
        ...prev,
        clientNames: [loggedInClientName], // auto set
      }));
    }
  }, [userRole, loggedInClientName]);

  const fetchAgentData = useCallback(async () => {
    try {
      if (!userRole) return;

      if (userRole === "client" && !loggedInClientName) return;

      const currentUser = loggedInClientName;
      setAgentLoading(true);

      const params = new URLSearchParams();
      if (agentFilters.fromDate)
        params.append("fromDate", agentFilters.fromDate);
      if (agentFilters.toDate) params.append("toDate", agentFilters.toDate);

      if (agentFilters.status?.length) {
        params.append("status", agentFilters.status.join(","));
      }

      if (agentFilters.subStatus?.length) {
        params.append("subStatus", agentFilters.subStatus.join(","));
      }

      if (agentFilters.agentNames?.length) {
        params.append("agentNames", agentFilters.agentNames.join(","));
      }

      // if (agentFilters.serviceType?.length) {
      //   params.append("serviceType", agentFilters.serviceType.join(","));
      // }

      if (agentFilters.serviceType?.length === 1) {
        params.append("serviceType", agentFilters.serviceType[0]);
      }

      const res = await fetch(
        `${baseURL}/AgentCaseSummary?${params.toString()}`,
      );
      const data = await res.json();

      if (currentUser !== loggedInClientName) return;

      setAgentData(data?.data || []);
    } catch (error) {
      console.log("Agent API Error:", error);
    } finally {
      setAgentLoading(false);
    }
  }, [agentFilters]);

  const updateIncidentTypes = (newValues) => {
    setClientFilters((prev) => ({
      ...prev,
      incidentTypes: newValues,
    }));
  };

  const fetchClientData = useCallback(async () => {
    try {
      if (!userRole) return;

      if (userRole === "client" && !loggedInClientName) {
        return;
      }
      const currentUser = loggedInClientName;

      setClientLoading(true);

      const params = new URLSearchParams();
      if (clientFilters.fromDate)
        params.append("fromDate", clientFilters.fromDate);
      if (clientFilters.toDate) params.append("toDate", clientFilters.toDate);

      if (clientFilters.status?.length) {
        params.append("status", clientFilters.status.join(","));
      }

      if (clientFilters.subStatus?.length) {
        params.append("subStatus", clientFilters.subStatus.join(","));
      }

      // if (clientFilters.serviceType?.length) {
      //   params.append("serviceType", clientFilters.serviceType.join(","));
      // }

      if (clientFilters.serviceType?.length === 1) {
        params.append("serviceType", clientFilters.serviceType[0]);
      }

      if (userRole === "client") {
        params.append("clientNames", loggedInClientName);
      } else if (clientFilters.clientNames?.length) {
        params.append("clientNames", clientFilters.clientNames.join(","));
      }

      const res = await fetch(
        `${baseURL}/ClientCaseStatusSummary?${params.toString()}`,
      );
      const data = await res.json();
      if (currentUser !== loggedInClientName) return;

      setClientData(data?.data || []);
    } catch (error) {
      console.log("Client API Error:", error);
    } finally {
      setClientLoading(false);
    }
  }, [clientFilters, userRole, loggedInClientName]);

  const fetchCaseAgeingData = useCallback(async () => {
    try {
      if (!userRole) return;

      if (userRole === "client" && !loggedInClientName) return;

      const currentUser = loggedInClientName;

      setCaseAgeingLoading(true);

      let clientNameParam = "";

      if (userRole === "client") {
        clientNameParam = loggedInClientName;
      } else if (caseAgeingFilters.clientNames?.length) {
        clientNameParam = caseAgeingFilters.clientNames.join(",");
      }

      let serviceTypeToSend = "";

      if (caseAgeingFilters.serviceType === "NO_SERVICE") {
        serviceTypeToSend = ""; // explicitly empty
      } else if (caseAgeingFilters.serviceType) {
        serviceTypeToSend = caseAgeingFilters.serviceType;
      }

      // incidentType = subStatus
      let incidentTypeToSend = "";

      if (caseAgeingFilters.subStatus?.length) {
        incidentTypeToSend = caseAgeingFilters.subStatus.join(",");
      }

      const payload = {
        fromDate: caseAgeingFilters.fromDate || null,
        toDate: caseAgeingFilters.toDate || null,
        clientName: clientNameParam || "",
        incidentType: incidentTypeToSend,
        serviceType: serviceTypeToSend,
      };

      const res = await fetch(`${baseURL}/GetCaseAgeingReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (currentUser !== loggedInClientName) return;

      setCaseAgeingData(data?.data || []);
    } catch (error) {
      console.log("Case Ageing API Error:", error);
      setCaseAgeingData([]);
    } finally {
      setCaseAgeingLoading(false);
    }
  }, [caseAgeingFilters, userRole, loggedInClientName]);

  const fetchClientList = async () => {
    try {
      const res = await fetch(`${baseURL}/GetCompanyList`);
      const data = await res.json();
      setClientList(data?.dataItem || []);
    } catch (error) {
      console.log("Client List API Error:", error);
    }
  };

  const fetchUserList = async () => {
    try {
      const res = await fetch(`${baseURL}/GetOperationsList`);
      const data = await res.json();

      const autoUsers =
        data?.operationsUser
          ?.flatMap((roleGroup) => roleGroup.list || [])
          ?.filter((user) => user.userType === "Auto") || [];

      setAgentList(autoUsers);

      console.log(autoUsers, "autouserss");
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <AgentContext.Provider
      value={{
        // AGENT
        agentData,
        agentLoading,
        agentFilters,
        setAgentFilters,
        fetchAgentData,
        fetchUserList,
        agentList,

        // CLIENT
        clientData,
        clientLoading,
        clientFilters,
        setClientFilters,
        fetchClientData,
        fetchClientList,
        clientList,

        caseAgeingData,
        caseAgeingLoading,
        caseAgeingFilters,
        setCaseAgeingFilters,
        fetchCaseAgeingData,
        updateIncidentTypes,

        filteredTotals,
        setFilteredTotals,
        agentFilteredTotal,
        setAgentFilteredTotal,

        userRole,
        loggedInClientName,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};
