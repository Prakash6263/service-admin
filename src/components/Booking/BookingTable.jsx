import React, { useMemo, useRef, useState } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";

const BookingTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, loading, error }) => {
  const tableRef = useRef(null);
  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const totalPages = Math.ceil(datas.length / rowsPerPage);

  const handlePageChange = (pageNum) => {
    setCurrentPage(pageNum);
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return datas;

    return datas.filter((item) =>
      (item.user_id?.first_name + " " + item.user_id?.last_name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.bookingId?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [datas, searchTerm]);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  // ✅ Excel & PDF Export
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Booking_List",
    sheet: "Bookings",
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Booking List", 14, 10);
    doc.autoTable({ html: "#example", startY: 20, theme: "striped" });
    doc.save("Bookings.pdf");
  };

  if (triggerDownloadExcel) triggerDownloadExcel.current = onDownload;
  if (triggerDownloadPDF) triggerDownloadPDF.current = exportToPDF;

  const memoizedBookingList = useMemo(() => {
    return currentData.map((booking, index) => (
      <tr key={booking._id}>
        <td>{index + 1}</td>
        <td>{booking.bookingId || "N/A"}</td>
        <td>{booking.user_id?.first_name} {booking.user_id?.last_name}</td>
        <td>{booking.user_id?.email || "N/A"}</td>
        <td>{booking.user_id?.phone || "N/A"}</td>
        <td>{booking.user_id?.city || "N/A"}</td>
        <td>{booking.user_id?.address || "N/A"}</td>
        <td>{booking.dealer_id?.shopName || "N/A"}</td>
        <td>{booking.dealer_id?.phone || "N/A"}</td>
        <td>{booking.dealer_id?.fullAddress || "N/A"}</td>
        <td>{booking.services[0]?.name || "N/A"}</td>
        <td>{booking.services[0]?.description || "N/A"}</td>
        <td>₹{booking.services[0]?.estimated_cost || 0}</td>
        <td>{new Date(booking.pickupDate).toLocaleDateString()}</td>
        <td>{booking.pickupStatus || "N/A"}</td>
        <td>{booking.status || "N/A"}</td>
        <td>₹{booking.totalBill || 0}</td>
        <td>{booking.billStatus || "N/A"}</td>
        <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
        <td>{new Date(booking.updatedAt).toLocaleDateString()}</td>

        {/* ✅ Action Menu (Three Dots) */}
        {/* <td className="d-flex align-items-center">
          <div className="dropdown">
            <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="far fa-edit me-2" /> Edit
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="far fa-trash-alt me-2" /> Delete
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="#" onClick={(e) => e.preventDefault()}>
                  <i className="fa fa-eye me-2" /> View Details
                </a>
              </li>
            </ul>
          </div>
        </td> */}
      </tr>
    ));
  }, [currentData]);



  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-2">
            <div className="card-body">
              <div className="table-responsive">
                <div className="mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name, order ID or ID"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>
                <table ref={tableRef} id="example" className="table table-striped">
                  <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                    <tr>{tableHeaders.map((header, index) => (<th key={index}>{header}</th>))}</tr>
                  </thead>
                  {/* <tbody className="list">{memoizedPaymentList}</tbody> */}
                  <tbody className="list">
                    {loading ? (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
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
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </td>
                      </tr>
                    ) : error ? (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
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
                    ) : memoizedBookingList.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          style={{
                            textAlign: "center",
                            padding: "20px",
                            fontStyle: "italic",
                            color: "#555",
                          }}
                        >
                          No payments found.
                        </td>
                      </tr>
                    ) : (
                      memoizedBookingList
                    )}
                  </tbody>
                </table>
              </div>

              {/* ✅ Fixed Pagination */}
              <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                <div className="text-muted" style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                  Total Records:{" "}
                  <span className="text-primary fw-bold">
                    {filteredData.length}
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
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                      >
                        <button className="page-link" onClick={() => handlePageChange(page)}>
                          {page}
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
    </>
  );
};

export default BookingTable;
