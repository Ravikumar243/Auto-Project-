import baseURL from "api/autoApi";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

const OldMisHook = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [companyName, setCompanyName] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [defaultRows, setDefaultRows] = useState([]);
  const [defaultLoading, setDefaultLoading] = useState(false);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [companyList, setCompanyList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [isSRNSearch, setIsSRNSearch] = useState(false);

  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role;

  const AGENT_ROLES = ["Agent", "Advisor", "SME"];
  const isAgent = AGENT_ROLES.includes(userRole);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const shortYear = year.slice(-2);

    return `${day}/${month}/${shortYear}`;
  };

  const parseDateSafe = (dateStr) => {
  if (!dateStr) return null;

  // extract only date part
  const clean = dateStr.split(" ")[0].replace(/\//g, "-");
  const parts = clean.split("-");

  if (parts.length !== 3) return null;

  // DD-MM-YYYY
  const [dd, mm, yyyy] = parts;

  if (!dd || !mm || !yyyy) return null;

  const date = new Date(Number(yyyy), Number(mm) - 1, Number(dd));
  return isNaN(date.getTime()) ? null : date;
};

 const filterOnlyLast3Days = (data = []) => {
  const today = new Date();
  today.setHours(23, 59, 59, 999);

  const startDate = new Date();
  startDate.setDate(today.getDate() - 2);
  startDate.setHours(0, 0, 0, 0);

  return data.filter((row) => {
    const rowDate = parseDateSafe(row.reportedDate);
    if (!rowDate) return false;

    // ❌ future block
    if (rowDate > today) return false;

    // ❌ past block
    if (rowDate < startDate) return false;

    return true;
  });
};

  const loadDefaultMIS = async () => {
    setDefaultLoading(true);
    try {
      const params = {
        companyName,
        fromDate: formatDate(fromDate),
        toDate: formatDate(toDate),
      };

      const query = new URLSearchParams(params).toString();

      const res = await fetch(`${baseURL}/GetOldCRMData?${query}`);
      const data = await res.json();

      setDefaultMessage(data.message || "");

      // setDefaultRows(data?.dataItems || []);
      let items = data?.dataItems || [];

      if (isAgent) {
        items = filterOnlyLast3Days(items);
      }

      setDefaultRows(items);
    } catch (error) {
      console.error("Error loading MIS:", error);
      toast.error("Error loading data");
    } finally {
      setDefaultLoading(false);
    }
  };

  const getOldCompanyList = async () => {
    try {
      const res = await fetch(`${baseURL}/GetOldCompanyList`);
      const data = await res.json();
      if (data.status === true) {
        setCompanyList(data?.dataItem);
      }
    } catch (error) {
      toast.error("Error loading data");
    }
  };

  useEffect(() => {
    getOldCompanyList();
  }, []);



  const handleSearch = async () => {
    if (searchText.trim()) {
      // SRN Search
      setIsSRNSearch(true);
      setLoading(true);

      try {
        const res = await fetch(
          `${baseURL}/GetCaseByReferenceNo?referenceNo=${searchText}`,
        );
        const data = await res.json();

        // setRows(data ? [data] : []);
        const result = data ? [data] : [];

        if (isAgent) {
          const filtered = filterOnlyLast3Days(result);
          setRows(filtered);

          if (filtered.length === 0) {
            toast.error("Agents can view only last 3 days data");
          }
        } else {
          setRows(result);
        }

        if (!data) toast.info("No record found!");
      } catch (err) {
        toast.error("No Data Found for this SRN");
      } finally {
        setLoading(false);
      }
    } else {
      setIsSRNSearch(false);
      // loadDefaultMIS();
    }
  };

  const handleFilterSearch = async () => {
    if (!companyName && !fromDate && !toDate) {
      toast.info("Please select company or date!");
      return;
    }

    setIsSRNSearch(false);
    await loadDefaultMIS();
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) return alert("Please select a file!");

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(`${baseURL}/UploadCaseMasterExcel`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        let message = "Upload failed!";
        try {
          const json = JSON.parse(text);
          message = json.message || json.error || message;
        } catch {
          message = text;
        }
        toast.error(message);
        return false;
      }

      const data = await res.json();
      console.log("API Response:", data);
      toast.success("File uploaded successfully!");
      return true;
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Upload Error");
    } finally {
      setLoading(false);
    }
  };

  return {
    // STATES
    loading,
    rows,
    defaultRows,
    isSRNSearch,

    companyName,
    fromDate,
    toDate,
    searchText,
    file,

    // SETTERS
    setCompanyName,
    setFromDate,
    setToDate,
    setSearchText,

    handleFileChange,
    handleUpload,
    handleSearch,
    handleFilterSearch,
    defaultLoading,
    defaultMessage,
    companyList,
    filterOnlyLast3Days
  };
};

export default OldMisHook;
