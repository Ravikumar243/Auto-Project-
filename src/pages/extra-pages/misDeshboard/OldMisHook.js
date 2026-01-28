

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
  const [defaultLoading, setDefaultLoading]  = useState(false);
  const [defaultMessage, setDefaultMessage] = useState("");
  const [rows, setRows] = useState([]); 
  const [companyList, setCompanyList] = useState([]);

  const [searchText, setSearchText] = useState("");
  const [isSRNSearch, setIsSRNSearch] = useState(false); 

  const formatDate = (dateStr) => {
    if (!dateStr) return "";

    const [year, month, day] = dateStr.split("-");

    const shortYear = year.slice(-2); 

    return `${day}/${month}/${shortYear}`;
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

      setDefaultRows(data?.dataItems || []);
    } catch (error) {
      console.error("Error loading MIS:", error);
      toast.error("Error loading data");
    } finally {
      setDefaultLoading(false);
    }
  };


  const getOldCompanyList = async()=>{
    try {
      const res = await fetch(`${baseURL}/GetOldCompanyList`);
      const data = await res.json();
      if(data.status=== true){
        setCompanyList(data?.dataItem)
      }
    } catch (error) {
       toast.error("Error loading data");
    }
  }

  useEffect(()=>{
    getOldCompanyList();
  },[])
  

  const handleSearch = async () => {
    if (searchText.trim()) {
      // SRN Search
      setIsSRNSearch(true);
      setLoading(true);

      try {
        const res = await fetch(
          `${baseURL}/GetCaseByReferenceNo?referenceNo=${searchText}`
        );
        const data = await res.json();

        setRows(data ? [data] : []);
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
  companyList
  };
};

export default OldMisHook;
