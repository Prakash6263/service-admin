import React, { useState, useMemo, useRef, useCallback } from "react";
import Swal from "sweetalert2";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import { updateDealerDocStatus } from "../../api";
import ImagePreview from "../Global/ImagePreview";

export default function DocumentStatusTable({
  tableHeaders,
  datas,
  onDealerVerified,
  text = "Dealers",
}) {
  const tableRef = useRef(null);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(datas.length / rowsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return datas.slice(start, start + rowsPerPage);
  }, [datas, currentPage]);
  const handleNext = () =>
    currentPage < totalPages && setCurrentPage(currentPage + 1);
  const handlePrev = () => currentPage > 1 && setCurrentPage(currentPage - 1);

  // const handleUpdate = async (id) => {
  //   try {
  //     const resp = await updateDealerDocStatus(id);
  //     if (resp) {
  //       Swal.fire("Updated!", resp.message || "Dealer details updated.", "success");
  //       onDealerVerified();
  //     }
  //   } catch (err) {
  //     Swal.fire("Error", err.message || "Updation failed.", "error");
  //   }
  // };

  // const rows = useMemo(
  //   () =>
  //     currentData.map((d, idx) => (
  //       <tr key={d._id}>
  //         <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
  //         <td>{d.name}</td>
  //         <td>{d.email}</td>
  //         <td>{d.phone}</td>
  //         <td>{d.aadharCardNo || "N/A"}</td>
  //         <td>{d.adharCardFront ? <ImagePreview image={d.adharCardFront} /> : "N/A"}</td>
  //         <td>{d.panCardNo || "N/A"}</td>
  //         <td>{d.panCardFront ? <ImagePreview image={d.panCardFront} /> : "N/A"}</td>
  //         <td>
  //           <div className="d-flex gap-1">
  //             {!d.isDoc && (
  //               <button
  //                 onClick={() => handleUpdate(d._id)}
  //                 className="btn btn-success btn-sm"
  //               >
  //                 Update
  //               </button>
  //             )}
  //             <button className="btn btn-warning btn-sm">
  //               {d.isBlock ? "Unblock" : "Block"}
  //             </button>
  //           </div>
  //         </td>
  //       </tr>
  //     )),
  //   [currentData, currentPage]
  // );

  const handleUpdate = useCallback(async (id) => {
    try {
      const resp = await updateDealerDocStatus(id);
      if (resp) {
        Swal.fire("Updated!", resp.message || "Dealer details updated.", "success");
        onDealerVerified();
      }
    } catch (err) {
      Swal.fire("Error", err.message || "Updation failed.", "error");
    }
  }, [onDealerVerified]);

  const rows = useMemo(
    () =>
      currentData.map((d, idx) => (
        <tr key={d._id}>
          <td>{(currentPage - 1) * rowsPerPage + idx + 1}</td>
          <td>{d.name}</td>
          <td>{d.email}</td>
          <td>{d.phone}</td>
          <td>{d.aadharCardNo || "N/A"}</td>
          <td>{d.adharCardFront ? <ImagePreview image={d.adharCardFront} /> : "N/A"}</td>
          <td>{d.panCardNo || "N/A"}</td>
          <td>{d.panCardFront ? <ImagePreview image={d.panCardFront} /> : "N/A"}</td>
          <td>
            <div className="d-flex gap-1">
              {!d.isDoc && (
                <button
                  onClick={() => handleUpdate(d._id)}
                  className="btn btn-success btn-sm"
                >
                  Update
                </button>
              )}
              <button className="btn btn-warning btn-sm">
                {d.isBlock ? "Unblock" : "Block"}
              </button>
            </div>
          </td>
        </tr>
      )),
    [currentData, currentPage, handleUpdate] // <-- Fixed dependency array
  );

  return (
    <div className="card p-2">
      <div className="table-responsive">
        <table
          ref={tableRef}
          id="verify-table"
          className="table table-bordered"
        >
          <thead>
            <tr>
              {tableHeaders.map((h, i) => (
                <th key={i}>{h}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center mt-2">
        <button
          className="btn btn-primary"
          onClick={handlePrev}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
