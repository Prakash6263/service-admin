import React, { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ImagePreview from "../Global/ImagePreview";
import { deleteCustomer } from "../../api";

const UserTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, onDealerDeleted, loading }) => {
  const tableRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const rowsPerPage = 10;
  // const [loading, setLoading] = useState(false);

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Admin_List",
    sheet: "Admins",
  });

  // const exportToPDF = () => {
  //   const doc = new jsPDF();
  //   doc.text("Admin List", 14, 10);
  //   const table = tableRef.current;

  //   if (!table) {
  //     console.error("Table not found!");
  //     return;
  //   }

  //   doc.autoTable({ html: "#example", startY: 20, theme: "striped" });
  //   doc.save(`${text}.pdf`);
  // };

  const exportToPDF = useCallback(() => {
    const doc = new jsPDF();
    doc.text("Admin List", 14, 10);
    const table = tableRef.current;

    if (!table) {
      console.error("Table not found!");
      return;
    }

    doc.autoTable({ html: "#example", startY: 20, theme: "striped" });
    doc.save(`${text}.pdf`);
  }, [text]);

  // useEffect(() => {
  //   triggerDownloadExcel.current = onDownload;
  //   triggerDownloadPDF.current = exportToPDF;
  // }, [onDownload, exportToPDF]);

  useEffect(() => {
    triggerDownloadExcel.current = onDownload;
    triggerDownloadPDF.current = exportToPDF;
  }, [onDownload, exportToPDF, triggerDownloadExcel, triggerDownloadPDF]);

  const filteredData = useMemo(() => {
    return datas.filter(
      (data) =>
        data.first_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        data.phone?.toString().includes(searchTerm)
    );
  }, [datas, searchTerm]);

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
          const response = await deleteCustomer(dealerId);
          if (response.status === 200) {
            onDealerDeleted();
            Swal.fire("Deleted!", response.message || "Dealer deleted successfully.", "success");
          } else {
            Swal.fire("Error!", response.message || "Deletion failed.", "error");
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete dealer.", "error");
        }
      }
    });
  };

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
                  placeholder="Search by name, email or phone"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <table ref={tableRef} id="example" className="table table-striped examplesss">
                <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <div className="mt-2">Loading Customers Data...</div>
                      </td>
                    </tr>
                  ) : currentData.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-5">
                        <div className="d-flex flex-column align-items-center text-muted">
                          <i className="fa fa-box-open mb-3" style={{ fontSize: "2rem", color: "#adb5bd" }}></i>
                          <h6 className="mb-1" style={{ fontWeight: 600 }}>No Customers Found</h6>
                          {/* <p style={{ fontSize: "0.9rem", color: "#6c757d", margin: 0 }}>
                            Try adding a new offer or refreshing the page.
                          </p> */}
                        </div>
                      </td>
                    </tr>
                  ) : (
                    currentData.map((data, index) => (
                      <tr key={data._id}>
                        <td>{index + 1}</td>
                        <td>{data._id || "N/A"}</td>
                        <td>{data.first_name || "N/A"}</td>
                        <td>{data.last_name || "N/A"}</td>
                        <td>{data.email || "N/A"}</td>
                        <td>{data.phone || "N/A"}</td>
                        <td>{data.address || "N/A"}</td>
                        <td>{data.city || "N/A"}</td>
                        <td>{data.state || "N/A"}</td>
                        <td>{data.pincode || "N/A"}</td>
                        <td>{data.isVerify ? "Yes" : "No"}</td>
                        <td>{data.isBlock ? "Blocked" : "Active"}</td>
                        <td>₹{data.wallet || 0}</td>
                        <td>{data.isProfile ? "Yes" : "No"}</td>
                        <td>{data.otp || "N/A"}</td>
                        <td>{new Date(data.createdAt).toLocaleDateString()}</td>
                        <td>{new Date(data.updatedAt).toLocaleDateString()}</td>
                        <td>{data.image ? <ImagePreview image={data.image} /> : "N/A"}</td>
                        <td>
                          <div className="dropdown">
                            <button className="btn-action-icon" data-bs-toggle="dropdown">
                              <i className="fas fa-ellipsis-v" />
                            </button>
                            <ul className="dropdown-menu dropdown-menu-end">
                              <li>
                                <button
                                  className="dropdown-item"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete(data._id);
                                  }}
                                >
                                  <i className="far fa-trash-alt me-2" /> Delete
                                </button>
                              </li>
                            </ul>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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
  );
};

export default UserTable;
