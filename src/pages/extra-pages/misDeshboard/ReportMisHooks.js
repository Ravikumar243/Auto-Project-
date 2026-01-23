import { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import moment from "moment";
import baseURL from "../../../api/autoApi";
import { toast } from "react-toastify";

const ReportMisHooks = () => {
  // ⬇️ NEW: GET ROLE FROM LOCALSTORAGE
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role; // "Admin" or "Agent"
  const userEmail = localStorage.getItem("userEmail");

  const [listData, setListData] = useState([]);
  const [filtercase, setFiltercase] = useState([]);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [policyLoading, setPolicyLoading] = useState(false)
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState(userEmail);
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState("");

  const isFilterApplied = search || from || to || company;


  // 🔹 helper (put at top of hook file)
const parseAnyDate = (value) => {
  if (!value) return null;

  return moment(
    value,
    [
      "DD-MM-YYYY HH:mm:ss",
      "DD-MM-YYYY",
      "M/D/YYYY h:mm:ss A",
      "YYYY-MM-DD",
      "YYYY-MM-DDTHH:mm"
    ],
    true
  );
};



  // Fetch all data
  const fetchDataAPI = async () => {
    try {
      const params = new URLSearchParams();
      if (from) params.append("fromDate", from);
      if (to) params.append("toDate", to);
      if (company) params.append("companyName", company);

      const URL = `${baseURL}/GetPolicyCRMData?${params.toString()}`;
      setPolicyLoading(true)
      const request = await fetch(URL);
      const data = await request.json();
      setListData(data.dataItems);
    } catch (error) {
      console.log("error", error);
    } finally {
      setPolicyLoading(false);
    }
  };

  // useEffect(() => {
  //   fetchDataAPI();
  // }, []);

  useEffect(() => {
    fetchDataAPI();
  }, [from, to, company]);

  // Excel Download
  const handleDowloadExcel = (data, filename = "sheetdata.xlsx") => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, filename);
  };

  // Send OTP
  const handleSendOtp = async () => {
    if (!email) {
      toast.error("Please enter a valid email");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(
        `${baseURL}/SendOTP?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await res.json();

      if (data?.status === true || data?.Status === true) {
        toast.success("OTP sent successfully!");
        setStep(2);
      } else {
        toast.error(data?.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP + DOWNLOAD based on ROLE
  const handleVerifyOtp = async () => {
    if (!otp) return toast.error("Enter OTP");

    try {
      setLoading(true);

      const res = await fetch(
        `${baseURL}/VerifyOTP?email=${encodeURIComponent(email)}&otp=${otp}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.json();

      if (data?.status === true || data?.Status === true) {
        toast.success("OTP verified successfully!");

        // ⬇️ ROLE BASED DOWNLOAD LOGIC

        if (userRole === "Admin" || userRole === "AM" || userRole==="HeadAC") {
          // ADMIN → DOWNLOAD ALL DATA
          handleDowloadExcel(filtercase);
        } else if (userRole === "Agent" || userRole === "Advisor" ||  userRole==="TL")  {
          // AGENT → ONLY LAST 3 DAYS
          const last3DaysData = filtercase.filter((row) => {
            const dateStr = row.completeInformationTime?.split(" ")[0];
            const caseDate = moment(dateStr, "DD-MM-YYYY");
            const today = moment();
            const diff = today.diff(caseDate, "days");
            return diff <= 3;
          });

          if (last3DaysData.length === 0) {
            toast.error("No data available for the last 3 days.");
            return;
          }

          handleDowloadExcel(last3DaysData);
        }

        setStep(1);
        setOpen(false);
        setOtp("");
      } else {
        toast.error(data?.message || "Invalid or expired OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error("Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

 

useEffect(() => {
  if (!Array.isArray(listData) || listData.length === 0) {
    setFiltercase([]);
    return;
  }

  let baseData = [...listData];

  // 🔹 AGENT / ADVISOR / TL → last 3 days only
  if (userRole === "Agent" || userRole === "Advisor" || userRole === "TL") {
    baseData = baseData.filter((row) => {
      const caseDate =
        parseAnyDate(row.completeInformationTime) ||
        parseAnyDate(row.callTime) ||
        parseAnyDate(row.reportedDate);

      if (!caseDate || !caseDate.isValid()) return false;

      const today = moment().endOf("day");
      const diff = today.diff(caseDate, "days");
      return diff <= 2;
    });
  }

  const result = baseData.filter((row) => {
    // 🔍 Search
    const referenceMatch = row.reference_No
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const contactMatch = row.contactNo
      ?.toLowerCase()
      .includes(search.toLowerCase());

    let dateMatch = true;

    // 📅 Date filter
    if (from || to) {
      const caseDate =
        parseAnyDate(row.completeInformationTime) ||
        parseAnyDate(row.callTime) ||
        parseAnyDate(row.reportedDate);

      if (!caseDate || !caseDate.isValid()) return false;

      const fromDate = from ? moment(from).startOf("day") : null;
      const toDate   = to ? moment(to).endOf("day") : null;

      if (fromDate && toDate) {
        dateMatch = caseDate.isBetween(fromDate, toDate, null, "[]");
      } else if (fromDate) {
        dateMatch = caseDate.isSameOrAfter(fromDate);
      }
    }

    return dateMatch && (referenceMatch || contactMatch || !search);
  });

  setFiltercase(result);
}, [listData, search, from, to, userRole]);


  return {
    listData,
    handleDowloadExcel,
    filtercase,
    setSearch,
    setFrom,
    to,
    setTo,
    from,
    loading,
    setOpen,
    open,
    email,
    setEmail,
    otp,
    setOtp,
    step,
    setStep,
    handleSendOtp,
    handleVerifyOtp,
    setCompany,
    company,
    policyLoading,
    isFilterApplied
  };
};

export default ReportMisHooks;
