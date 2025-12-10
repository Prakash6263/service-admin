// // import { useState, useMemo, useRef, useEffect } from "react";
// // import { useDownloadExcel } from "react-export-table-to-excel";
// // import jsPDF from "jspdf";
// // import "jspdf-autotable";

// // const ServiceTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, loading, error }) => {
// //   const tableRef = useRef(null);
// //   const [searchTerm, setSearchTerm] = useState("");
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const rowsPerPage = 10;

// //   const { onDownload } = useDownloadExcel({
// //     currentTableRef: tableRef.current,
// //     filename: "Payment_List",
// //     sheet: "Payments",
// //   });

// //   const exportToPDF = () => {
// //     const doc = new jsPDF();
// //     doc.text("Payment List", 14, 10);

// //     const table = tableRef.current;
// //     if (!table) {
// //       console.error("Table not found!");
// //       return;
// //     }

// //     doc.autoTable({
// //       html: table,
// //       startY: 20,
// //       theme: "striped",
// //     });

// //     doc.save(`${text}.pdf`);
// //   };

// //   // Set up download triggers
// //   useEffect(() => {
// //     if (triggerDownloadExcel) {
// //       triggerDownloadExcel.current = onDownload;
// //     }
// //     if (triggerDownloadPDF) {
// //       triggerDownloadPDF.current = exportToPDF;
// //     }
// //   }, [onDownload, exportToPDF]);

// //   // Filter data based on search term
// //   const filteredData = useMemo(() => {
// //     if (!searchTerm) return datas;

// //     return datas.filter((data) => {
// //       const searchLower = searchTerm.toLowerCase();
// //       return (
// //         (data.user_id?.email || "").toLowerCase().includes(searchLower) ||
// //         (data.cf_order_id || "").toString().toLowerCase().includes(searchLower) ||
// //         (data.orderId || "").toLowerCase().includes(searchLower) ||
// //         (data._id || "").toLowerCase().includes(searchLower) ||
// //         (data.order_status || "").toLowerCase().includes(searchLower)
// //       );
// //     });
// //   }, [datas, searchTerm]);

// //   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

// //   const currentData = useMemo(() => {
// //     const start = (currentPage - 1) * rowsPerPage;
// //     return filteredData.slice(start, start + rowsPerPage);
// //   }, [filteredData, currentPage, rowsPerPage]);

// //   const handlePageChange = (pageNum) => {
// //     setCurrentPage(pageNum);
// //   };

// //   const memoizedPaymentList = useMemo(() => {
// //     console.log("Current Data", currentData);
// //     return currentData.map((data, index) => (
// //       <tr key={data._id}>
// //         <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
// //         <td>{data.orderId || data._id || "N/A"}</td>
// //         <td>{data.orderId || "N/A"}</td>
// //         <td>{`${data.rawData?.user_id?.first_name || ''} ${data.rawData?.user_id?.last_name || ''}`.trim() || "N/A"}</td>
// //         <td>₹{data.rawData?.orderAmount || 0}</td>
// //         <td>{data.rawData?.order_currency || "INR"}</td>
// //         <td>
// //           <span className={`badge ${data.payment_type === 'ONLINE' ? 'bg-success-light' : 'bg-warning-light'}`}>
// //             {data.payment_by || "N/A"}
// //           </span>
// //         </td>
// //         <td>
// //           <span className={`badge ${data.order_status === 'SUCCESS' ? 'bg-success-light' : data.order_status === 'PENDING' ? 'bg-warning-light' : 'bg-danger-light'}`}>
// //             {data.rawData?.order_status || "N/A"}
// //           </span>
// //         </td>
// //         {/* <td>{data.rawData?.create_date ? new Date(data.create_date).toLocaleDateString() : "N/A"}</td> */}
// //         <td>
// //           {data.rawData?.createdAt ?
// //             new Date(data.rawData?.createdAt).toLocaleString('en-IN', {
// //               day: '2-digit',
// //               month: '2-digit',
// //               year: 'numeric',
// //               hour: '2-digit',
// //               minute: '2-digit',
// //               hour12: true
// //             })
// //             : "N/A"
// //           }
// //         </td>
// //       </tr>
// //     ));
// //   }, [currentData, currentPage, rowsPerPage]);

// //   // Reset to first page when data changes
// //   useEffect(() => {
// //     setCurrentPage(1);
// //   }, [datas]);

// //   return (
// //     <div className="row">
// //       <div className="col-sm-12">
// //         <div className="card-table card p-2">
// //           <div className="card-body">
// //             <div className="table-responsive">
// //               <div className="mb-3">
// //                 <input
// //                   type="text"
// //                   className="form-control"
// //                   placeholder="Search by email, order ID, payment ID or status"
// //                   value={searchTerm}
// //                   onChange={(e) => {
// //                     setSearchTerm(e.target.value);
// //                     setCurrentPage(1);
// //                   }}
// //                 />
// //               </div>
// //               <table ref={tableRef} className="table table-striped">
// //                 <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
// //                   <tr>
// //                     {tableHeaders.map((header, index) => (
// //                       <th key={index} style={{ color: 'white' }}>{header}</th>
// //                     ))}
// //                   </tr>
// //                 </thead>
// //                 <tbody className="list">
// //                   {loading ? (
// //                     <tr>
// //                       <td
// //                         colSpan={tableHeaders.length}
// //                         style={{
// //                           textAlign: "center",
// //                           padding: "20px",
// //                           height: "30vh",
// //                         }}
// //                       >
// //                         <div
// //                           className="spinner-border text-primary"
// //                           role="status"
// //                           style={{
// //                             width: "3rem",
// //                             height: "3rem",
// //                             margin: "auto",
// //                           }}
// //                         >
// //                           <span className="visually-hidden">Loading...</span>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ) : error ? (
// //                     <tr>
// //                       <td
// //                         colSpan={tableHeaders.length}
// //                         style={{
// //                           textAlign: "center",
// //                           color: "red",
// //                           padding: "20px",
// //                           fontWeight: "bold",
// //                         }}
// //                       >
// //                         {error}
// //                       </td>
// //                     </tr>
// //                   ) : memoizedPaymentList.length === 0 ? (
// //                     <tr>
// //                       <td
// //                         colSpan={tableHeaders.length}
// //                         style={{
// //                           textAlign: "center",
// //                           padding: "20px",
// //                           fontStyle: "italic",
// //                           color: "#555",
// //                         }}
// //                       >
// //                         {searchTerm ? "No payments match your search." : "No payments found."}
// //                       </td>
// //                     </tr>
// //                   ) : (
// //                     memoizedPaymentList
// //                   )}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Pagination */}
// //             {filteredData.length > 0 && (
// //               <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
// //                 <div className="text-muted" style={{ fontWeight: "500", fontSize: "0.9rem" }}>
// //                   Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
// //                   <span className="text-primary fw-bold">
// //                     {filteredData.length}
// //                   </span> records
// //                 </div>
// //                 <nav aria-label="Page navigation example">
// //                   <ul className="pagination pagination-sm mb-0">
// //                     <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
// //                       <button
// //                         className="page-link"
// //                         onClick={() => setCurrentPage(currentPage - 1)}
// //                         disabled={currentPage === 1}
// //                         aria-label="Previous"
// //                       >
// //                         &laquo;
// //                       </button>
// //                     </li>
// //                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
// //                       <li
// //                         key={page}
// //                         className={`page-item ${page === currentPage ? "active" : ""}`}
// //                       >
// //                         <button
// //                           className="page-link"
// //                           onClick={() => handlePageChange(page)}
// //                         >
// //                           {page}
// //                         </button>
// //                       </li>
// //                     ))}
// //                     <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
// //                       <button
// //                         className="page-link"
// //                         onClick={() => setCurrentPage(currentPage + 1)}
// //                         disabled={currentPage === totalPages || totalPages === 0}
// //                         aria-label="Next"
// //                       >
// //                         &raquo;
// //                       </button>
// //                     </li>
// //                   </ul>
// //                 </nav>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default ServiceTable;

// import { useState, useMemo, useRef, useEffect } from "react";
// import { useDownloadExcel } from "react-export-table-to-excel";
// import jsPDF from "jspdf";
// import "jspdf-autotable";

// const ServiceTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, loading, error }) => {
//   const tableRef = useRef(null);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [paymentTypeFilter, setPaymentTypeFilter] = useState("all");
//   const rowsPerPage = 10;

//   const { onDownload } = useDownloadExcel({
//     currentTableRef: tableRef.current,
//     filename: "Payment_List",
//     sheet: "Payments",
//   });

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text("Payment List", 14, 10);

//     const table = tableRef.current;
//     if (!table) {
//       console.error("Table not found!");
//       return;
//     }

//     doc.autoTable({
//       html: table,
//       startY: 20,
//       theme: "striped",
//     });

//     doc.save(`${text}.pdf`);
//   };

//   // Set up download triggers
//   useEffect(() => {
//     if (triggerDownloadExcel) {
//       triggerDownloadExcel.current = onDownload;
//     }
//     if (triggerDownloadPDF) {
//       triggerDownloadPDF.current = exportToPDF;
//     }
//   }, [onDownload, exportToPDF]);

//   // Get unique values for filters
//   const uniqueStatuses = useMemo(() => {
//     const statuses = [...new Set(datas.map(item => item.order_status))].filter(Boolean);
//     return statuses;
//   }, [datas]);

//   const uniquePaymentTypes = useMemo(() => {
//     const types = [...new Set(datas.map(item => item.payment_type))].filter(Boolean);
//     return types;
//   }, [datas]);

//   // Filter data based on search term and filters
//   const filteredData = useMemo(() => {
//     if (!datas.length) return [];

//     return datas.filter((data) => {
//       const searchLower = searchTerm.toLowerCase();

//       // Search across multiple fields
//       const matchesSearch =
//         (data.rawData?.user_id?.email || "").toLowerCase().includes(searchLower) ||
//         (data.rawData?.cf_order_id || "").toString().toLowerCase().includes(searchLower) ||
//         (data.orderId || "").toLowerCase().includes(searchLower) ||
//         (data._id || "").toLowerCase().includes(searchLower) ||
//         (data.rawData?.order_status || "").toLowerCase().includes(searchLower) ||
//         (data.rawData?.payment_type || "").toLowerCase().includes(searchLower);

//       // Status filter
//       const matchesStatus = statusFilter === "all" || data.order_status === statusFilter;

//       // Payment type filter
//       const matchesPaymentType = paymentTypeFilter === "all" || data.payment_type === paymentTypeFilter;

//       return matchesSearch && matchesStatus && matchesPaymentType;
//     });
//   }, [datas, searchTerm, statusFilter, paymentTypeFilter]);

//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   const currentData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return filteredData.slice(start, start + rowsPerPage);
//   }, [filteredData, currentPage, rowsPerPage]);

//   const handlePageChange = (pageNum) => {
//     setCurrentPage(pageNum);
//   };

//   const clearAllFilters = () => {
//     setSearchTerm("");
//     setStatusFilter("all");
//     setPaymentTypeFilter("all");
//     setCurrentPage(1);
//   };

//   const memoizedPaymentList = useMemo(() => {
//     console.log("Current Data", currentData);
//     return currentData.map((data, index) => (
//       <tr key={data._id}>
//         <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
//         <td>{data.paymentId || "N/A"}</td>
//         <td>{data.orderId || "N/A"}</td>
//         {/* <td>
//           {data.rawData?.user_id?.email ? 
//             data.user_id.email.split('@')[0]
//               .split(/[._]/)
//               .map(word => word.charAt(0).toUpperCase() + word.slice(1))
//               .join(' ')
//             : "N/A"
//           }
//         </td> */}
//         <td>{`${data.rawData?.user_id?.first_name || ''} ${data.rawData?.user_id?.last_name || ''}`.trim() || "N/A"}</td>
//         <td>₹{data.rawData?.orderAmount || 0}</td>
//         <td>{data.rawData?.order_currency || "INR"}</td>
//         <td>
//           <span className={`badge ${data.rawData?.payment_type === 'ONLINE' ? 'bg-success-light' : 'bg-warning-light'}`}>
//             {data.rawData?.payment_type || "N/A"}
//           </span>
//         </td>
//         {/* <td>
//           <span className={`badge ${
//             data.rawData?.order_status === 'SUCCESS' ? 'bg-success-light' : 
//             data.rawData?.order_status === 'PENDING' ? 'bg-warning-light' : 
//             'bg-danger-light'
//           }`}>
//             {data.rawData?.order_status || "N/A"}
//           </span>
//         </td> */}
//         <td>
//           <span className={`badge ${data.rawData?.order_status === 'SUCCESS' ? 'bg-success-light text-success' :
//               data.rawData?.order_status === 'PENDING' ? 'bg-warning-light text-warning' :
//                 data.rawData?.order_status === 'FAILED' ? 'bg-danger-light text-danger' :
//                   data.rawData?.order_status === 'CANCELLED' ? 'bg-secondary-light text-secondary' :
//                     'bg-light text-muted'
//             }`}>
//             {data.rawData?.order_status || "N/A"}
//           </span>
//         </td>
//         <td>
//           {data.rawData?.createdAt ?
//             new Date(data.rawData?.createdAt).toLocaleString('en-IN', {
//               day: '2-digit',
//               month: '2-digit',
//               year: 'numeric',
//               hour: '2-digit',
//               minute: '2-digit',
//               hour12: true
//             })
//             : "N/A"
//           }
//         </td>
//       </tr>
//     ));
//   }, [currentData, currentPage, rowsPerPage]);

//   // Reset to first page when filters change
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [searchTerm, statusFilter, paymentTypeFilter, datas]);

//   return (
//     <div className="row">
//       <div className="col-sm-12">
//         <div className="card-table card p-2">
//           <div className="card-body">

//             {/* Filters Section */}
//             <div className="row mb-3">
//               <div className="col-md-4">
//                 <input
//                   type="text"
//                   className="form-control"
//                   placeholder="Search by email, order ID, payment ID..."
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>

//               <div className="col-md-3">
//                 <select
//                   className="form-select"
//                   value={statusFilter}
//                   onChange={(e) => setStatusFilter(e.target.value)}
//                 >
//                   <option value="all">All Status</option>
//                   {uniqueStatuses.map(status => (
//                     <option key={status} value={status}>
//                       {status}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-md-3">
//                 <select
//                   className="form-select"
//                   value={paymentTypeFilter}
//                   onChange={(e) => setPaymentTypeFilter(e.target.value)}
//                 >
//                   <option value="all">All Payment Types</option>
//                   {uniquePaymentTypes.map(type => (
//                     <option key={type} value={type}>
//                       {type}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="col-md-2">
//                 <button
//                   className="btn btn-outline-secondary w-100"
//                   onClick={clearAllFilters}
//                 >
//                   Clear Filters
//                 </button>
//               </div>
//             </div>

//             {/* Active Filters Display */}
//             {(searchTerm || statusFilter !== "all" || paymentTypeFilter !== "all") && (
//               <div className="mb-3">
//                 <small className="text-muted">
//                   Active filters:
//                   {searchTerm && <span className="badge bg-primary ms-2">Search: {searchTerm}</span>}
//                   {statusFilter !== "all" && <span className="badge bg-info ms-2">Status: {statusFilter}</span>}
//                   {paymentTypeFilter !== "all" && <span className="badge bg-warning ms-2">Type: {paymentTypeFilter}</span>}
//                   <span className="badge bg-secondary ms-2">Results: {filteredData.length}</span>
//                 </small>
//               </div>
//             )}

//             <div className="table-responsive">
//               <table ref={tableRef} className="table table-striped">
//                 <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
//                   <tr>
//                     {tableHeaders.map((header, index) => (
//                       <th key={index} style={{ color: 'white' }}>{header}</th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="list">
//                   {loading ? (
//                     <tr>
//                       <td
//                         colSpan={tableHeaders.length}
//                         style={{
//                           textAlign: "center",
//                           padding: "20px",
//                           height: "30vh",
//                         }}
//                       >
//                         <div
//                           className="spinner-border text-primary"
//                           role="status"
//                           style={{
//                             width: "3rem",
//                             height: "3rem",
//                             margin: "auto",
//                           }}
//                         >
//                           <span className="visually-hidden">Loading...</span>
//                         </div>
//                       </td>
//                     </tr>
//                   ) : error ? (
//                     <tr>
//                       <td
//                         colSpan={tableHeaders.length}
//                         style={{
//                           textAlign: "center",
//                           color: "red",
//                           padding: "20px",
//                           fontWeight: "bold",
//                         }}
//                       >
//                         {error}
//                       </td>
//                     </tr>
//                   ) : memoizedPaymentList.length === 0 ? (
//                     <tr>
//                       <td
//                         colSpan={tableHeaders.length}
//                         style={{
//                           textAlign: "center",
//                           padding: "20px",
//                           fontStyle: "italic",
//                           color: "#555",
//                         }}
//                       >
//                         {searchTerm || statusFilter !== "all" || paymentTypeFilter !== "all"
//                           ? "No payments match your filters."
//                           : "No payments found."}
//                       </td>
//                     </tr>
//                   ) : (
//                     memoizedPaymentList
//                   )}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination */}
//             {filteredData.length > 0 && (
//               <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
//                 <div className="text-muted" style={{ fontWeight: "500", fontSize: "0.9rem" }}>
//                   Showing {((currentPage - 1) * rowsPerPage) + 1} to {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
//                   <span className="text-primary fw-bold">
//                     {filteredData.length}
//                   </span> records
//                 </div>
//                 <nav aria-label="Page navigation example">
//                   <ul className="pagination pagination-sm mb-0">
//                     <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(currentPage - 1)}
//                         disabled={currentPage === 1}
//                         aria-label="Previous"
//                       >
//                         &laquo;
//                       </button>
//                     </li>
//                     {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                       <li
//                         key={page}
//                         className={`page-item ${page === currentPage ? "active" : ""}`}
//                       >
//                         <button
//                           className="page-link"
//                           onClick={() => handlePageChange(page)}
//                         >
//                           {page}
//                         </button>
//                       </li>
//                     ))}
//                     <li className={`page-item ${currentPage === totalPages || totalPages === 0 ? "disabled" : ""}`}>
//                       <button
//                         className="page-link"
//                         onClick={() => setCurrentPage(currentPage + 1)}
//                         disabled={currentPage === totalPages || totalPages === 0}
//                         aria-label="Next"
//                       >
//                         &raquo;
//                       </button>
//                     </li>
//                   </ul>
//                 </nav>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ServiceTable;

import { useState, useMemo, useRef, useEffect } from "react";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ServiceTable = ({
  triggerDownloadExcel,
  triggerDownloadPDF,
  tableHeaders,
  datas,
  text,
  loading,
  error,
}) => {
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Payment_List",
    sheet: "Payments",
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Payment List", 14, 10);
    if (tableRef.current) {
      doc.autoTable({
        html: tableRef.current,
        startY: 20,
        theme: "striped",
      });
      doc.save(`${text}.pdf`);
    }
  };

  useEffect(() => {
    if (triggerDownloadExcel) triggerDownloadExcel.current = onDownload;
    if (triggerDownloadPDF) triggerDownloadPDF.current = exportToPDF;
  }, [onDownload, exportToPDF]);

  // Search filter (searches across most key fields)
  const filteredData = useMemo(() => {
    if (!datas?.length) return [];

    const lowerSearch = searchTerm.toLowerCase();

    return datas.filter((item) =>
      Object.values(item).some((val) =>
        String(val).toLowerCase().includes(lowerSearch)
      )
    );
  }, [datas, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-2">
          <div className="card-body">
            {/* Filters */}
            <div className="row mb-3">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by any field..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => setSearchTerm("")}
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table ref={tableRef} className="table table-striped">
                <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index} style={{ color: "white" }}>
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status" />
                      </td>
                    </tr>
                  ) : error ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center text-danger py-3">
                        {error}
                      </td>
                    </tr>
                  ) : currentData.length === 0 ? (
                    <tr>
                      <td colSpan={tableHeaders.length} className="text-center py-3 text-muted">
                        No data found.
                      </td>
                    </tr>
                  ) : (
                    currentData.map((data, index) => (
                      <tr key={index}>
                        <td>{data.serialNo}</td>
                        <td>{data.paymentId}</td>
                        <td>{data.cfOrderId}</td>
                        <td>{data.orderId}</td>
                        <td>{data.userId}</td>
                        <td>{data.userName}</td>
                        <td>{data.userEmail}</td>
                        <td>{data.userPhone}</td>
                        <td>{data.dealerId}</td>
                        <td>{data.bookingId}</td>
                        <td>{data.bookingStatus}</td>
                        <td>₹{data.amount}</td>
                        <td>{data.currency}</td>
                        <td>
                          <span className={`badge ${data.type === "ONLINE" ? "bg-success-light" : "bg-warning-light"}`}>
                            {data.type}
                          </span>
                        </td>
                        <td>{data.method}</td>
                        <td>{data.transactionId}</td>
                        <td>
                          <span
                            className={`badge ${
                              data.status === "SUCCESS"
                                ? "bg-success-light text-success"
                                : data.status === "PENDING"
                                ? "bg-warning-light text-warning"
                                : "bg-secondary-light text-secondary"
                            }`}
                          >
                            {data.status}
                          </span>
                        </td>
                        <td>{data.createdAt}</td>
                        <td>{data.updatedAt}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {filteredData.length > 0 && (
              <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                <div className="text-muted">
                  Showing {(currentPage - 1) * rowsPerPage + 1}–
                  {Math.min(currentPage * rowsPerPage, filteredData.length)} of{" "}
                  <span className="text-primary fw-bold">{filteredData.length}</span>
                </div>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li
                      key={page}
                      className={`page-item ${page === currentPage ? "active" : ""}`}
                    >
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li
                    className={`page-item ${
                      currentPage === totalPages || totalPages === 0 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages || totalPages === 0}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceTable;
