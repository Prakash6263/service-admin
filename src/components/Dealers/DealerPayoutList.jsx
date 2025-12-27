// import React, { useEffect, useState, useMemo, useRef } from "react";
// import { useDownloadExcel } from "react-export-table-to-excel";
// import jsPDF from "jspdf";
// import "jspdf-autotable";
// import { approveDealerPayout } from "../../api"; // Make sure this API is defined

// const ServiceTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, setData, text,fetchLatest }) => {
//   const tableRef = useRef(null);

//   const [modalData, setModalData] = useState(null); // row data for modal
//   const [newStatus, setNewStatus] = useState("");   // dropdown status

//   const { onDownload } = useDownloadExcel({
//     currentTableRef: tableRef.current,
//     filename: `${text.replace(/\s/g, "_")}_List`,
//     sheet: text,
//   });

//   const exportToPDF = () => {
//     const doc = new jsPDF();
//     doc.text(`${text} List`, 14, 10);

//     const table = tableRef.current;
//     if (!table) {
//       console.error("Table not found!");
//       return;
//     }

//     doc.autoTable({
//       html: "#example",
//       startY: 20,
//       theme: "striped",
//     });

//     doc.save(`${text}.pdf`);
//   };

//   const rowsPerPage = 10;
//   const [currentPage, setCurrentPage] = useState(1);
//   const totalPages = Math.ceil(datas.length / rowsPerPage);
//   const currentData = useMemo(() => {
//     const start = (currentPage - 1) * rowsPerPage;
//     return datas.slice(start, start + rowsPerPage);
//   }, [datas, currentPage]);

//   const handleNextPage = () => { if (currentPage < totalPages) setCurrentPage(currentPage + 1); };
//   const handlePrevPage = () => { if (currentPage > 1) setCurrentPage(currentPage - 1); };

//   triggerDownloadExcel.current = onDownload;
//   triggerDownloadPDF.current = exportToPDF;

//   const memoizedRowList = useMemo(() => {
//     return currentData.map((data, index) => {
//       if (text === "Dealer Payout") {
//         const getStatusBadge = (status) => {
//           const colorMap = {
//             ACTIVE: "success",
//             PAID: "primary",
//             PENDING: "warning",
//             FAILED: "danger",
//             EXPIRED: "secondary",
//             APPROVED: "success",
//             REJECTED: "danger",
//           };
//           return (
//             <span
//               className={`badge bg-${colorMap[status] || "dark"}`}
//               style={{ cursor: "pointer" }}
//               onClick={() => {
//                 setModalData(data);
//                 setNewStatus(data.order_status);
//               }}
//             >
//               {status}
//             </span>
//           );
//         };

//         return (
//           <tr key={data._id}>
//             <td>{index + 1}</td>
//             <td>{data._id}</td>
//             <td>{data.orderId}</td>
//             <td>{data.dealer_id?.name || "N/A"}</td>
//             <td>₹{data.Amount}</td>
//             <td>{data.Type}</td>
//             <td>{data.Note}</td>
//             <td>₹{data.Total}</td>
//             <td>{getStatusBadge(data.order_status)}</td>
//             <td>{new Date(data.createdAt).toLocaleDateString()}</td>
//           </tr>
//         );
//       }

//       return null;
//     });
//   }, [currentData, text]);

//   return (
//     <div className="row">
//       <div className="col-sm-12">
//         <div className="card-table card p-2">
//           <div className="card-body">
//             <div className="table-responsive">
//               <table ref={tableRef} id="example" className="table table-striped">
//                 <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
//                   <tr>{tableHeaders.map((header, index) => (<th key={index}>{header}</th>))}</tr>
//                 </thead>
//                 <tbody className="list">{memoizedRowList}</tbody>
//               </table>
//             </div>
//             <div className="d-flex justify-content-between align-items-center mt-3">
//               <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>Previous</button>
//               <span>Page {currentPage} of {totalPages}</span>
//               <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Modal */}
//       {modalData && (
//         <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
//           <div className="modal-dialog">
//             <div className="modal-content">
//               <div className="modal-header">
//                 <h5 className="modal-title">Change Payout Status</h5>
//                 <button type="button" className="btn-close" onClick={() => setModalData(null)} />
//               </div>
//               <div className="modal-body">
//                 <label>Status</label>
//                 <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
//                   {["ACTIVE", "PAID", "PENDING", "FAILED", "EXPIRED", "APPROVED", "REJECTED"].map((status) => (
//                     <option key={status} value={status}>{status}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="modal-footer">
//                 <button className="btn btn-secondary" onClick={() => setModalData(null)}>Cancel</button>
//                 <button
//   className="btn btn-primary"
//   onClick={async () => {
//     try {
//       await approveDealerPayout(modalData.orderId, newStatus);
//       setModalData(null);  
//       setTimeout(() => {
//         fetchLatest();     
//       }, 500); 
//     } catch (err) {
//       console.error(err);
//       alert("Status update failed");
//     }
//   }}
// >
//   Update Status
// </button>

//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ServiceTable;



"use client"

import { useState, useMemo, useRef } from "react"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { approveDealerPayout } from "../../api" // Make sure this API is defined

const ServiceTable = ({
  triggerDownloadExcel,
  triggerDownloadPDF,
  tableHeaders,
  datas,
  setData,
  text,
  fetchLatest,
}) => {
  const tableRef = useRef(null)

  const [modalData, setModalData] = useState(null) // row data for modal
  const [newStatus, setNewStatus] = useState("") // dropdown status

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: `${text.replace(/\s/g, "_")}_List`,
    sheet: text,
  })

  const exportToPDF = () => {
    const doc = new jsPDF()

    doc.setFontSize(16)
    doc.text(`${text} List`, 14, 15)

    doc.setFontSize(10)
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22)

    const tableColumn = [
      "#",
      "Payout ID",
      "Order ID",
      "Dealer Name",
      "Amount",
      "Type",
      "Note",
      "Total",
      "Status",
      "Date",
    ]

    const tableRows = datas.map((row, idx) => [
      idx + 1,
      row._id || "N/A",
      row.orderId || "N/A",
      row.dealer_id?.name || "N/A",
      `₹${row.Amount || 0}`,
      row.Type || "N/A",
      row.Note || "N/A",
      `₹${row.Total || 0}`,
      row.order_status || "N/A",
      row.createdAt ? new Date(row.createdAt).toLocaleDateString() : "N/A",
    ])

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 28,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: {
        fillColor: [46, 131, 255],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
    })

    doc.save(`${text.replace(/\s/g, "_")}_List_${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(datas.length / rowsPerPage)
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return datas.slice(start, start + rowsPerPage)
  }, [datas, currentPage])

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1)
  }
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1)
  }

  triggerDownloadExcel.current = onDownload
  triggerDownloadPDF.current = exportToPDF

  const memoizedRowList = useMemo(() => {
    return currentData.map((data, index) => {
      if (text === "Dealer Payout") {
        const getStatusBadge = (status) => {
          const colorMap = {
            ACTIVE: "success",
            PAID: "primary",
            PENDING: "warning",
            FAILED: "danger",
            EXPIRED: "secondary",
            APPROVED: "success",
            REJECTED: "danger",
          }
          return (
            <span
              className={`badge bg-${colorMap[status] || "dark"}`}
              style={{ cursor: "pointer" }}
              onClick={() => {
                setModalData(data)
                setNewStatus(data.order_status)
              }}
            >
              {status}
            </span>
          )
        }

        return (
          <tr key={data._id}>
            <td>{index + 1}</td>
            <td>{data._id}</td>
            <td>{data.orderId}</td>
            <td>{data.dealer_id?.name || "N/A"}</td>
            <td>₹{data.Amount}</td>
            <td>{data.Type}</td>
            <td>{data.Note}</td>
            <td>₹{data.Total}</td>
            <td>{getStatusBadge(data.order_status)}</td>
            <td>{new Date(data.createdAt).toLocaleDateString()}</td>
          </tr>
        )
      }

      return null
    })
  }, [currentData, text])

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-2">
          <div className="card-body">
            <div className="table-responsive">
              <table ref={tableRef} id="example" className="table table-striped">
                <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                  <tr>
                    {tableHeaders.map((header, index) => (
                      <th key={index}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="list">{memoizedRowList}</tbody>
              </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-3">
              <button className="btn btn-primary" onClick={handlePrevPage} disabled={currentPage === 1}>
                Previous
              </button>
              <span>
                Page {currentPage} of {totalPages}
              </span>
              <button className="btn btn-primary" onClick={handleNextPage} disabled={currentPage === totalPages}>
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalData && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Change Payout Status</h5>
                <button type="button" className="btn-close" onClick={() => setModalData(null)} />
              </div>
              <div className="modal-body">
                <label>Status</label>
                <select className="form-select" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                  {["ACTIVE", "PAID", "PENDING", "FAILED", "EXPIRED", "APPROVED", "REJECTED"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setModalData(null)}>
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  onClick={async () => {
                    try {
                      await approveDealerPayout(modalData.orderId, newStatus)
                      setModalData(null)
                      setTimeout(() => {
                        fetchLatest()
                      }, 500)
                    } catch (err) {
                      console.error(err)
                      alert("Status update failed")
                    }
                  }}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ServiceTable
