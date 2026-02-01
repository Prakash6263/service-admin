'use client';

import React, { useState, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Swal from "sweetalert2";
import ImagePreview from "../Global/ImagePreview";
import { deleteAdditionalService } from "../../api/additionalServiceApi";

const ServiceTable = ({
  triggerDownloadExcel,
  triggerDownloadPDF,
  tableHeaders,
  datas,
  text,
  onServiceDeleted,
}) => {
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Service_List",
    sheet: "Services",
  });

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text("Service List", 14, 10);

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

    doc.save(`${text}.pdf`);
  };

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(datas.length / rowsPerPage);
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return datas.slice(start, start + rowsPerPage);
  }, [datas, currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  triggerDownloadExcel.current = onDownload;
  triggerDownloadPDF.current = exportToPDF;

  const getServiceName = (data) => {
    // Backward compatibility: prefer base_additional_service_id.name, fallback to name
    return data.base_additional_service_id?.name || data.name || "N/A";
  };

  const getServiceImage = (data) => {
    // Backward compatibility: prefer base_additional_service_id.image, fallback to image
    return data.base_additional_service_id?.image || data.image || null;
  };

  const handleEdit = (serviceId) => {
    navigate(`/edit-additional-service/${serviceId}`);
  };

  const handleDelete = async (serviceId) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteAdditionalService(serviceId);
        if (onServiceDeleted) onServiceDeleted();
      } catch (error) {
        console.error("Delete error:", error);
      }
    }
  };

  const memoizedServiceList = useMemo(() => {
    return currentData.map((data, index) => (
      <tr key={data._id}>
        <td>{index + 1 + (currentPage - 1) * rowsPerPage}</td>
        <td>{data._id || "N/A"}</td>
        <td>{getServiceName(data)}</td>
        <td>
          {getServiceImage(data) ? (
            <ImagePreview image={`${getServiceImage(data)}`} />
          ) : (
            "N/A"
          )}
        </td>
        <td>{data.description || "N/A"}</td>
        <td>{data.dealer_id?.shopName || "N/A"}</td>
        <td>
          {data.bikes && data.bikes.length > 0 ? (
            <ul>
              {data.bikes.map((bike, idx) => (
                <li key={idx}>
                  {bike.cc} CC - ₹{bike.price}
                </li>
              ))}
            </ul>
          ) : (
            "N/A"
          )}
        </td>
        <td className="d-flex align-items-center">
          <div className="dropdown">
            <button className="btn-action-icon" data-bs-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleEdit(data._id)}
                >
                  <i className="far fa-edit me-2" /> Edit
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => handleDelete(data._id)}
                >
                  <i className="far fa-trash-alt me-2" /> Delete
                </button>
              </li>
            </ul>
          </div>
        </td>
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
                <table ref={tableRef} id="example" className="table table-striped">
                  <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                    <tr>
                      {tableHeaders.map((header, index) => (
                        <th key={index}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="list">{memoizedServiceList}</tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <button
                  className="btn btn-primary"
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-primary"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceTable;
