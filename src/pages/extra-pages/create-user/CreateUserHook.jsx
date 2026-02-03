import baseURL from "api/autoApi";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userList, setUserList] = useState([]);
  const [activeTab, setActiveTab] = useState("Admin");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    selectUser: "",
  });
  const [errors, setErrors] = useState({});

  const userTypeMap = {
    Admin: "Auto",
    Agent: "Auto",
    AM: "Auto",
    HeadAC: "Auto",
    QA: "Auto",
    SME: "Auto",
    TL: "Auto",
    Client: "Auto",
    Network: "Auto",
  };

  useEffect(() => {
    fetchUserList();
  }, []);

  const fetchUserList = async () => {
    try {
      const res = await fetch(`${baseURL}/GetOperationsList`);
      const data = await res.json();

      const filteredUser = (data?.operationsUser || [])
        .filter((group) => group.role) // ❌ remove blank role
        .map((group) => ({
          role: group.role,
          list: (group.list || []).filter((user) => user.userType === "Auto"),
        }));

      setUserList(filteredUser);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const editUser = async (payload) => {
    try {
      const res = await fetch(`${baseURL}/EditOperationsUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to edit user");
      }

      toast.success("User updated successfully");

      // 🔥 UPDATE USER IN STATE (NO REFRESH)
      setUserList((prev) =>
        prev.map((group) => ({
          ...group,
          list: group.list.map((user) =>
            user.uniqueId === payload.uniqueId ? { ...user, ...payload } : user,
          ),
        })),
      );

      return true;
    } catch (error) {
      console.error("Edit error:", error.message);
      toast.error("Edit failed");
    }
  };

  const deleteUser = async (deleteUserById) => {
    console.log(deleteUserById, "deleteUserById");
    const DeletePayload = {
      uniqueId: deleteUserById,
    };
    try {
      const res = await fetch(`${baseURL}/DeleteOperationsUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(DeletePayload),
      });
      if (!res.ok) {
        throw new Error("Failed to delete user");
      }
      toast.success("User deleted successfully");

      setUserList((prev) =>
        prev.map((group) => ({
          ...group,
          list: group.list.filter((user) => user.uniqueId !== deleteUserById),
        })),
      );
    } catch (error) {
      console.error("Delete error:", error.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "role") {
      setFormData((prev) => ({
        ...prev,
        role: value,
        selectUser: userTypeMap[value] || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const validate = () => {
    let newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!formData.role) newErrors.role = "Role is required";
    if (!formData.selectUser) newErrors.selectUser = "User type is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(`${baseURL}/CreateOperationsList`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          userType: formData.selectUser,
          type: formData.type || "",
        }),
      });

      const data = await response.json();

      if (data.status) {
        toast.success("User created successfully!");
        setFormData({
          name: "",
          email: "",
          password: "",
          role: "",
          selectUser: "",
        });
        fetchUserList();
    

        // close modal programmatically
        const modalEl = document.getElementById("createUserModal");
        const modal = window.bootstrap.Modal.getInstance(modalEl);
        modal.hide();

        document
          .querySelectorAll(".modal-backdrop")
          .forEach((el) => el.remove());
        document.body.classList.remove("modal-open");
        document.body.style.overflow = "auto";
      } else {
        toast.error(data.message || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider
      value={{
        userList,
        activeTab,
        errors,
        setActiveTab,
        loading,
        formData,
        editUser,
        deleteUser,
        handleChange,
        handleSubmit,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
