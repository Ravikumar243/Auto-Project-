import baseURL from "api/autoApi";
import { createContext, useEffect, useState } from "react";

export const VendorFailureContext = createContext();

export const VendorFailureProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    fromDate: null,
    toDate: null,
    stateNames: [],
    cityNames: [],
    vendorIds: [],
    search: "",
  });

  const [vendorPerformanceFilters, setVendorPerformanceFilters] = useState({
    fromDate: null,
    toDate: null,
    stateNames: [],
    cityNames: [],
    vendorIds: [],
    search:""
  });

  const [vendors, setVendors] = useState([]);
  const [vendorLoading, setVendorLoading] = useState(false);

  const [vendorTotalData, setVendorTotalData] = useState([]);

  const [vendorPerformanceData, setVendorPerformanceData] = useState([]);
  const [vendorPerformanceLoading, setVendorPerformanceLoading] =
    useState(false);

  const [vendorFailureData, setVendorFailureData] = useState([]);
  const [vendorFailureLoading, setVendorFailureLoading] = useState(false);

  const [agentClientTotalData, setAgentClientTotalData] = useState("");
  const [stateCityLoading, setStateCityLoading] = useState(false);
  const [stateCityData, setStateCityData] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const fetchVendors = async () => {
    try {
      setVendorLoading(true);
      const res = await fetch(`${baseURL}/GetVendors`);
      const result = await res.json();
      setVendors(result?.data || []);
    } catch (error) {
      console.error("Vendor API error", error);
      setVendors([]);
    } finally {
      setVendorLoading(false);
    }
  };

  const fetchVendorTotalData = async () => {
    try {
      const res = await fetch(`${baseURL}/VendorPerformanceOverall`);
      const data = await res.json();
      console.log(data, "vnedorksdkjfd");
      setVendorTotalData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVendorClientTotalData = async () => {
    try {
      const res = await fetch(`${baseURL}/CaseStatusSummary`);
      const data = await res.json();
      setAgentClientTotalData(data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchVendorPerformanceFiltered = async () => {
    try {
      setVendorPerformanceLoading(true);

      const params = new URLSearchParams();

      if (vendorPerformanceFilters.fromDate)
        params.append("fromDate", vendorPerformanceFilters.fromDate);

      if (vendorPerformanceFilters.toDate)
        params.append("toDate", vendorPerformanceFilters.toDate);

      if (vendorPerformanceFilters.stateNames.length)
        params.append(
          "stateNames",
          vendorPerformanceFilters.stateNames.join(",")
        );

      if (vendorPerformanceFilters.cityNames.length)
        params.append(
          "cityNames",
          vendorPerformanceFilters.cityNames.join(",")
        );

      if (vendorPerformanceFilters.vendorIds.length)
        params.append(
          "vendorIds",
          vendorPerformanceFilters.vendorIds.join(",")
        );

      const res = await fetch(
        `${baseURL}/VendorPerformanceFiltered?${params.toString()}`
      );

      const data = await res.json();
      setVendorPerformanceData(data?.data || []);
    } catch (error) {
      console.error("VendorPerformanceFiltered API error", error);
      setVendorPerformanceData([]);
    } finally {
      setVendorPerformanceLoading(false);
    }
  };

  const fetchStateCity = async () => {
    try {
      setStateCityLoading(true);
      const res = await fetch(`${baseURL}/GetAutoStateCity`, {
        method: "GET",
      });

      const result = await res.json();

      const dataItem = Array.isArray(result?.dataItem) ? result.dataItem : [];

      setStateCityData(dataItem);

      const uniqueStates = [
        ...new Set(dataItem.map((item) => item.state).filter(Boolean)),
      ];

      setStates(uniqueStates);
    } catch (error) {
      console.error("State/City API error", error);
      setStates([]);
      setCities([]);
    } finally {
      setStateCityLoading(false);
    }
  };

  const fetchVendorFailure = async () => {
    try {
      setVendorFailureLoading(true);
      const payload = {
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        stateNames: filters.stateNames.join(","),
        cityNames: filters.cityNames.join(","),
        vendorIds: filters.vendorIds.join(","),
      };

      const res = await fetch(`${baseURL}/VendorFailureReport`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setVendorFailureData(data?.data);
      console.log(data);
    } catch (error) {
      console.log(error);
    } finally {
      setVendorFailureLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorClientTotalData();
  }, []);

  useEffect(() => {
    fetchStateCity();
  }, []);

  const activeStateNames =
    vendorPerformanceFilters.stateNames.length > 0
      ? vendorPerformanceFilters.stateNames
      : filters.stateNames;

  useEffect(() => {
    const activeStateNames =
      vendorPerformanceFilters.stateNames.length > 0
        ? vendorPerformanceFilters.stateNames
        : filters.stateNames;

    if (activeStateNames.length === 0) {
      setCities([]);
      return;
    }

    const filteredCities = [
      ...new Set(
        stateCityData
          .filter((item) => activeStateNames.includes(item.state))
          .map((item) => item.city)
          .filter(Boolean)
      ),
    ];

    setCities(filteredCities);
  }, [vendorPerformanceFilters.stateNames, filters.stateNames, stateCityData]);

  useEffect(() => {
    fetchVendorFailure();
  }, [filters]);

  console.log(vendorTotalData, "vendorTotalDataksdk");

  return (
    <VendorFailureContext.Provider
      value={{
        vendorFailureData,
        vendorFailureLoading,
        states,
        cities,
        filters,
        setFilters,
        stateCityLoading,
        agentClientTotalData,

        fetchVendors,
        vendors,
        vendorLoading,

        fetchVendorPerformanceFiltered,
        vendorPerformanceData,
        vendorPerformanceFilters,
        setVendorPerformanceFilters,
        vendorPerformanceLoading,

        fetchVendorTotalData,
        vendorTotalData,
      }}
    >
      {children}
    </VendorFailureContext.Provider>
  );
};
