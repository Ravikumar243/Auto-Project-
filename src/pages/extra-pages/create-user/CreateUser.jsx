import baseURL from "api/autoApi";
import React, { useContext, useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "react-data-table-component";
import { json } from "react-router";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { wrap } from "lodash";
import { UserContext } from "./CreateUserHook";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const CreateUser = () => {
  const {
    userList,
    activeTab,
    setActiveTab,
    errors,
    loading,
    formData,
    editUser,
    deleteUser,
    handleChange,
    handleSubmit,
  } = useContext(UserContext);

  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEditClick = (user) => {
    setIsEdit(true);
    setEditId(user.uniqueId);

    // pre-fill form
    handleChange({
      target: { name: "name", value: user.name },
    });
    handleChange({
      target: { name: "email", value: user.email },
    });
    handleChange({ target: { name: "password", value: user.password || "" } });
    handleChange({
      target: { name: "role", value: user.role },
    });
    handleChange({
      target: { name: "selectUser", value: user.userType },
    });

    // open modal
    const modal = new window.bootstrap.Modal(
      document.getElementById("createUserModal"),
    );
    modal.show();
  };

  const openCreateModal = () => {
    setIsEdit(false);
    setEditId(null);
    setShowPassword(false);

    // clear form
    handleChange({ target: { name: "name", value: "" } });
    handleChange({ target: { name: "email", value: "" } });
    handleChange({ target: { name: "password", value: "" } });
    handleChange({ target: { name: "role", value: "" } });
    handleChange({ target: { name: "selectUser", value: "" } });

    const modalEl = document.getElementById("createUserModal");

    // 🔥 Dispose old instance if exists
    const existingModal = window.bootstrap.Modal.getInstance(modalEl);
    if (existingModal) {
      existingModal.dispose();
    }

    const modal = new window.bootstrap.Modal(modalEl);
    modal.show();
  };

  const columns = [
    {
      name: "Sr.No",
      selector: (row, i) => i + 1,
      sortable: true,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      sortable: true,
      width: "120px",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
      width: "260px",
      wrap: true,
    },
    {name:"Password", selector : (row)=> row.password},
    { name: "User Type", selector: (row) => row.userType, sortable: true },
    { name: "Status", selector: (row) => row.status, sortable: true },
    { name: "Unique ID", selector: (row) => row.uniqueId, sortable: true },
    {
      name: "Action",
      cell: (row) => (
        <>
          {/* EDIT */}
          <IconButton color="primary" onClick={() => handleEditClick(row)}>
            <EditOutlinedIcon />
          </IconButton>

          {/* DELETE */}
          <IconButton color="error" onClick={() => deleteUser(row.uniqueId)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },

    // {
    //   name: "Delete User",
    //   selector: (row) => (
    //     <div>
    //       <IconButton color="error" onClick={() => deleteUser(row.uniqueId)}>
    //         <DeleteIcon />
    //       </IconButton>
    //     </div>
    //   ),
    // },
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#edededff",
        // color: "black",
        fontWeight: "bold",
        fontSize: "14px",
      },
    },
    cells: {
      style: {
        fontSize: "14px",
      },
    },
  };

  console.log(userList, "userList");
  const data = userList.find((group) => group.role === activeTab)?.list || [];

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>User List</h3>
        <button className="btn btn-primary" onClick={openCreateModal}>
          + Create User
        </button>
      </div>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-3">
        {[
          "Admin",
          "Agent",
          "AM",
          "HeadAC",
          "QA",
          "SME",
          "TL",
          "Client",
          "Network",
        ].map((role) => (
          <li className="nav-item" key={role}>
            <button
              className={`nav-link ${activeTab === role ? "active" : ""}`}
              onClick={() => setActiveTab(role)}
            >
              {role}
            </button>
          </li>
        ))}
      </ul>

      <DataTable
        columns={columns}
        data={data}
        pagination
        highlightOnHover
        responsive
        dense
        customStyles={customStyles}
      />

      {/* Modal */}
      <div
        className="modal fade"
        id="createUserModal"
        tabIndex="-1"
        aria-labelledby="createUserModalLabel"
        aria-hidden="true"
      >
        {/* Centered and large width */}
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="createUserModalLabel">
                {isEdit ? "Update User" : "Create User"}
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();

                  if (isEdit) {
                    const success = await editUser({
                      uniqueId: editId,
                      name: formData.name,
                      email: formData.email,
                      password: formData.password,
                      role: formData.role,
                      userType: formData.selectUser,
                      type: "",
                    });

                    if (success) {
                      const modalEl =
                        document.getElementById("createUserModal");
                      const modal = window.bootstrap.Modal.getInstance(modalEl);
                      modal?.hide();

                      setIsEdit(false);
                      setEditId(null);
                    }
                  } else {
                    handleSubmit(e);
                  }

                  setIsEdit(false);
                  setEditId(null);
                }}
              >
                <div className="row">
                  {/* Name */}
                  <div className="col-6 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <small className="text-danger">{errors.name}</small>
                    )}
                  </div>

                  {/* Email */}
                  <div className="col-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <small className="text-danger">{errors.email}</small>
                    )}
                  </div>
                </div>

                <div className="row">
                  {/* Password */}
                  <div className="col-6 mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </button>
                    </div>

                    {errors.password && (
                      <small className="text-danger">{errors.password}</small>
                    )}
                  </div>

                  {/* Role */}
                  <div className="col-6 mb-3">
                    <label className="form-label">Role</label>
                    <select
                      name="role"
                      className="form-select"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="">Select Role</option>
                      <option value="Admin">Admin</option>
                      <option value="Agent">Agent</option>
                      <option value="AM">AM</option>
                      <option value="HeadAC">Head-AC</option>
                      <option value="QA">QA</option>
                      <option value="SME">SME</option>
                      <option value="TL">TL</option>
                      <option value="Client">Client</option>
                      <option value="Network">Network</option>
                    </select>
                    {errors.role && (
                      <small className="text-danger">{errors.role}</small>
                    )}
                  </div>
                </div>

                {/* User Type */}
                <div className="mb-3">
                  <label className="form-label">User Type</label>
                  <input
                    name="selectUser"
                    className="form-control"
                    value={formData.selectUser}
                    readOnly
                  />
                  {errors.selectUser && (
                    <small className="text-danger">{errors.selectUser}</small>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading
                      ? isEdit
                        ? "Updating..."
                        : "Creating..."
                      : isEdit
                        ? "Update User"
                        : "Create User"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default CreateUser;
