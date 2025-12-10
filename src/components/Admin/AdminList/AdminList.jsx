import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { getAdmins, deleteAdmin } from "../../../api";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";

const Alladmins = ({ triggerDownloadExcel, triggerDownloadPDF }) => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const tableRef = useRef(null);

  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editAdmin, setEditAdmin] = useState(null);

  // Editable fields state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    mobile: "",
    password: "", // leave empty unless user wants to change
  });

  const roles = ["Telecaller", "Manager", "Admin", "Subadmin", "Executive"];

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Admin_List",
    sheet: "Admins",
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Admin List", 14, 10);

    const table = tableRef.current;
    if (!table) {
      console.error("Table not found!");
      return;
    }

    doc.autoTable({
      html: "#example",
      startY: 20,
      theme: "striped",
    });

    doc.save("Admin_List.pdf");
  };

  triggerDownloadExcel.current = onDownload;
  triggerDownloadPDF.current = exportToPDF;

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const response = await getAdmins();
        if (response.status === 200) {
          setAdmins(response.data);
        } else {
          setError("Failed to fetch admins");
        }
      } catch (err) {
        setError("Error fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    if (!searchTerm) return admins;
    const lowerTerm = searchTerm.toLowerCase();
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(lowerTerm) ||
        admin.email.toLowerCase().includes(lowerTerm) ||
        admin.role.toLowerCase().includes(lowerTerm) ||
        (admin.mobile && admin.mobile.includes(lowerTerm))
    );
  }, [admins, searchTerm]);

  const paginatedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAdmins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAdmins, currentPage]);

  const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const handleDelete = useCallback(
    async (adminId) => {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const response = await deleteAdmin(adminId);
            if (response.status === 200) {
              setAdmins((prevAdmins) =>
                prevAdmins.filter((admin) => admin._id !== adminId)
              );
              Swal.fire(
                "Deleted!",
                response.message || "The admin has been removed.",
                "success"
              );
            } else {
              Swal.fire(
                "Error!",
                response.message || "Failed to delete admin.",
                "error"
              );
            }
          } catch (error) {
            Swal.fire(
              "Error!",
              "Something went wrong while deleting the admin.",
              "error"
            );
          }
        }
      });
    },
    [admins, setAdmins]
  );

  const handleStatusToggle = async ({ id }, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const response = await fetch(
      // `https://api.mrbikedoctor.cloud/bikedoctor/adminauth/update-status/${id}`,
      `https://api.mrbikedoctor.cloud/bikedoctor/adminauth/update-status/${id}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setAdmins((prevAdmins) =>
        prevAdmins.map((admin) =>
          admin._id === id ? { ...admin, status: newStatus } : admin
        )
      );
      Swal.fire("Success", data.message || "Status updated", "success");
    } else {
      Swal.fire("Error", data.message || "Failed to update status", "error");
    }
  };

  // OPEN EDIT MODAL AND SET FORM DATA
  const handleEdit = (admin) => {
    setEditAdmin(admin);
    setFormData({
      name: admin.name || "",
      email: admin.email || "",
      role: admin.role || "",
      mobile: admin.mobile || "",
      password: "", // leave blank on edit
    });
    setShowEditModal(true);
  };

  // HANDLE FORM INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // HANDLE FORM SUBMIT TO UPDATE ADMIN
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", editAdmin._id, formData);

    if (!formData.name || !formData.email || !formData.role || !formData.mobile) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    try {
      const response = await fetch(
        // `https://dr-bike-backend.onrender.com/bikedoctor/adminauth/admin/${editAdmin._id}`,
        `https://api.mrbikedoctor.cloud/bikedoctor/adminauth/admin/${editAdmin._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Update admin in local state
        setAdmins((prevAdmins) =>
          prevAdmins.map((admin) =>
            admin._id === editAdmin._id ? { ...admin, ...formData } : admin
          )
        );
        setShowEditModal(false);
        Swal.fire("Success", data.message || "Admin updated successfully", "success");
      } else {
        Swal.fire("Error", data.message || "Failed to update admin", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const memoizedAdminList = useMemo(() => {
    return paginatedAdmins?.map((admin, index) => (
      <tr key={admin._id}>
        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
        <td>{admin.name}</td>
        <td>{admin.email}</td>
        <td>{admin.mobile || "N/A"}</td>
        <td>{admin.role}</td>
        <td>{admin.employeeId || "Not Assigned"}</td>
        <td>
          <label className="switch">
            <input
              type="checkbox"
              checked={admin.status === "active"}
              onChange={() =>
                handleStatusToggle({ id: admin._id, userId: admin.userId }, admin.status)
              }
            />
            <span className="slider"></span>
          </label>
        </td>
        <td className="d-flex align-items-center">
          <div className="dropdown">
            <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(admin._id);
                  }}
                >
                  <i className="far fa-trash-alt me-2" /> View
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEdit(admin);
                  }}
                >
                  <i className="far fa-edit me-2" /> Edit
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    ));
  }, [paginatedAdmins, currentPage, handleDelete]);

  return (
    <>
      {/* Your existing table UI */}
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-2">
            <div className="card-body">
              <div className="table-responsive">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, email or phone"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                <table
                  ref={tableRef}
                  id="example"
                  className="table table-striped"
                >
                  <thead
                    className="thead-light"
                    style={{ backgroundColor: "#2e83ff" }}
                  >
                    <tr>
                      <th># S.No</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Employe_Id</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody className="list">
                    {loading ? (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            height: "30vh",
                          }}
                        >
                          <div
                            className="spinner-border text-primary"
                            role="status"
                            style={{
                              width: "3rem",
                              height: "3rem",
                              margin: "auto",
                            }}
                          >
                            <span className="visually-hidden">
                              Loading...
                            </span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            textAlign: "center",
                            color: "red",
                            padding: "20px",
                            fontWeight: "bold",
                          }}
                        >
                          {error}
                        </td>
                      </tr>
                    ) : admins.length === 0 ? (
                      <tr>
                        <td
                          colSpan="8"
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            fontStyle: "italic",
                            color: "#555",
                          }}
                        >
                          No admins found.
                        </td>
                      </tr>
                    ) : (
                      memoizedAdminList
                    )}
                  </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                  <div
                    className="text-muted"
                    style={{ fontWeight: "500", fontSize: "0.9rem" }}
                  >
                    Total Records:{" "}
                    <span className="text-primary fw-bold">
                      {filteredAdmins.length}
                    </span>
                  </div>

                  <nav aria-label="Page navigation example">
                    <ul className="pagination pagination-sm mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          aria-label="Previous"
                        >
                          &laquo;
                        </button>
                      </li>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                          <li
                            key={page}
                            className={`page-item ${page === currentPage ? "active" : ""
                              }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </button>
                          </li>
                        )
                      )}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          aria-label="Next"
                        >
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form onSubmit={handleEditSubmit} className="w-100">
              <div className="modal-content shadow-lg border-0 rounded-3">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">Edit Admin Details</h5>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setShowEditModal(false)}
                  ></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Mobile</label>
                      <input
                        type="text"
                        name="mobile"
                        className="form-control"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Role</label>
                      <select
                        name="role"
                        className="form-select"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>Select Role</option>
                        {roles.map((roleOption) => (
                          <option key={roleOption} value={roleOption}>
                            {roleOption}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-12">
                      <label className="form-label">Password <small className="text-muted">(leave blank to keep current)</small></label>
                      <input
                        type="password"
                        name="password"
                        className="form-control"
                        value={formData.password}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer bg-light border-top-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
export default Alladmins;