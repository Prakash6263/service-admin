import React, { useEffect, useState, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { deleteDealer } from "../../api";

const UserTable = ({
  triggerDownloadExcel,
  triggerDownloadPDF,
  tableHeaders,
  datas,
  text,
  onDealerDeleted,
}) => {
  const tableRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [dealerFilter, setDealerFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cityFilter, setCityFilter] = useState("");
  const rowsPerPage = 10;
  console.log("Datas", datas);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef,
    filename: `${text}_List`,
    sheet: text,
  });

  useEffect(() => {
    triggerDownloadExcel.current = onDownload;
    triggerDownloadPDF.current = exportToPDF;
  }, [onDownload]);

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text(`${text} List`, 14, 10);

    const tableColumn = tableHeaders;
    const tableRows = filteredData.map((row, idx) => [
      idx + 1,
      row._id || "N/A",
      row.name || "N/A",
      row.email || "N/A",
      row.phone || "N/A",
      `${row.commission || 0}%`,
      `₹${row.wallet || 0}`,
    ]);

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });

    doc.save(`${text}_List.pdf`);
  };

const filteredData = useMemo(() => {
  return datas.filter((item) => {
    const search = searchTerm.toLowerCase();
    const matchesSearch =
      item.ownerName?.toLowerCase().includes(search) ||
      item.name?.toLowerCase().includes(search) ||
      item.email?.toLowerCase().includes(search) ||
      item.phone?.toLowerCase().includes(search);

    const matchesDealer = dealerFilter
      ? item.ownerName?.toLowerCase().includes(dealerFilter.toLowerCase())
      : true;

    const matchesCity = cityFilter
      ? item.city?.toLowerCase().includes(cityFilter.toLowerCase())
      : true;

    const matchesStatus =
      !statusFilter ||
      (statusFilter === "active" && item.isActive) ||
      (statusFilter === "inactive" && !item.isActive);

    return matchesSearch && matchesDealer && matchesCity && matchesStatus;
  });
}, [datas, searchTerm, dealerFilter, cityFilter, statusFilter]);


  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handleDelete = async (dealerId) => {
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
          const response = await deleteDealer(dealerId);
          if (response.status === 200) {
            onDealerDeleted();
            Swal.fire(
              "Deleted!",
              response.message || "Dealer deleted successfully.",
              "success"
            );
          } else {
            Swal.fire(
              "Error!",
              response.message || "Deletion failed.",
              "error"
            );
          }
        } catch {
          Swal.fire("Error!", "Failed to delete dealer.", "error");
        }
      }
    });
  };

  useEffect(() => {
    if (datas) {
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [datas]);

  const handleToggleStatus = async (dealerId, newStatus) => {
    try {
      const response = await fetch(`https://api.mrbikedoctor.cloud/bikedoctor/dealer/${dealerId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // Add authorization header if needed
          // 'Authorization': `Bearer ${yourAuthToken}`
        },
        body: JSON.stringify({ isActive: newStatus })
      });

      const result = await response.json();

      if (response.ok) {
        // Refresh the data after successful update
        onDealerDeleted();
        Swal.fire({
          icon: 'success',
          title: 'Status Updated',
          text: `Dealer is now ${newStatus ? 'Active' : 'Inactive'}`
        });
      } else {
        throw new Error(result.message || 'Failed to update status');
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: error.message
      });
      console.error('Toggle error:', error);
    }
  };

  const memoizedTableRows = useMemo(() => {
    console.log("Rendering table rows",currentData);
    return currentData?.map((data, index) => (
      <tr key={data._id}>
        <td>{index + 1}</td>
        <td>{data.dealerId || "N/A"}</td>
        <td>{data.commission}%</td>
        <td>{data.tax}%</td>
        <td>{data.ownerName || "N/A"}</td>
        {/* <td>{data.permanentAddress?.address || "N/A"}</td> */}
        <td style={{ color: data.aadharCardNo ? 'green' : 'red' }}>
          {data.aadharCardNo || 'N/A'}
        </td>
        <td style={{ color: data.panCardNo ? 'green' : 'red' }}>
          {data.panCardNo || 'N/A'}
        </td>
        <td>{data.shopName || "N/A"}</td>
        <td>{data.email || "N/A"}</td>
        <td>{data.phone || "N/A"}</td>
        <td>{data.fullAddress || "N/A"}</td>
        <td>{data.state || "N/A"}</td>
        <td>{data.shopPincode || "N/A"}</td>
        <td>{data.isVerify ? "Yes" : "No"}</td>
        <td>{data.isBlock ? "Blocked" : "Active"}</td>
        <td>{new Date(data.createdAt).toLocaleDateString()}</td>
        <td>{new Date(data.updatedAt).toLocaleDateString()}</td>
        <td>{data.city || "N/A"}</td>
        <td>{data.bankDetails?.bankName || "N/A"}</td>
        <td>{data.bankDetails?.accountNumber || "N/A"}</td>
        <td>{data.bankDetails?.ifscCode || "N/A"}</td>
        <td>{data.isProfile ? "Yes" : "No"}</td>
        <td>
          {data.documents?.aadharFront && data.documents?.aadharBack && data.documents?.panCardFront ? (
            <span className="text-green-600 font-semibold" style={{ color: "green" }}>Yes</span>
          ) : (
            <span className="text-red-600 font-semibold" style={{ color: "red" }}>No</span>
          )}
        </td>
        <td>
          <label className="switch">
            <input
              type="checkbox"
              checked={data.isActive}
              onChange={() => handleToggleStatus(data._id, !data.isActive)}
            />
            <span className="slider round"></span>
          </label>
        </td>
        <td className="d-flex align-items-center">
          <div className="dropdown">
            <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/view-dealer/${data._id}`);
                  }}
                >
                  <i className="fa-solid fa-eye me-2" /> View Details
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/updateDealer/${data._id}`);
                  }}
                >
                  <i className="far fa-edit me-2" /> Edit
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleDelete(data._id);
                  }}
                >
                  <i className="far fa-trash-alt me-2" /> Delete
                </a>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    ));
  }, [currentData]);

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-2">
          <div className="card-body">
            <div className="table-responsive">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search anything..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="mb-3 d-flex flex-wrap gap-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by Dealer Name"
                  value={dealerFilter}
                  onChange={(e) => setDealerFilter(e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
                <select
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{ maxWidth: "180px" }}
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Filter by City"
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  style={{ maxWidth: "200px" }}
                />
              </div>
              <table ref={tableRef} id="example" className="table table-striped">
                <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="list">
                  {loading ? (
                    <tr>
                      <td colSpan="12" style={{ textAlign: "center", padding: "20px", height: "30vh" }}>
                        <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem', margin: 'auto' }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={tableHeaders.length} style={{ textAlign: "center", color: "red", padding: "20px", fontWeight: "bold" }}>
                        {error}
                      </td>
                    </tr>
                  ) : datas.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} style={{ textAlign: "center", padding: "20px", fontStyle: "italic", color: "#555" }}>
                        No data found.
                      </td>
                    </tr>
                  ) : filteredData.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} style={{ textAlign: "center", padding: "20px", fontStyle: "italic", color: "#555" }}>
                        No records match your search.
                      </td>
                    </tr>
                  ) : (
                    memoizedTableRows
                  )}
                </tbody>
              </table>
            </div>

            <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
              <div className="text-muted" style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                Total Records: <span className="text-primary fw-bold">{filteredData.length}</span>
              </div>
              <nav aria-label="Page navigation example">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      aria-label="Previous"
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <li
                      key={pageNum}
                      className={`page-item ${pageNum === currentPage ? "active" : ""}`}
                      aria-current={pageNum === currentPage ? "page" : undefined}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      aria-label="Next"
                      disabled={currentPage === totalPages}
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
  );
};

export default UserTable;