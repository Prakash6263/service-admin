import React, { useState, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import { useDownloadExcel } from "react-export-table-to-excel";
import jsPDF from "jspdf";
import "jspdf-autotable";
import ImagePreview from "../Global/ImagePreview";
import { deleteService } from "../../api";
import { useNavigate } from "react-router-dom";

const ServiceTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, onServiceDeleted, loading, error }) => {
  const navigate = useNavigate()
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    name: "",
    image: "",
    description: "",
    dealer_id: "",
    bikes: [],
  });

  const handleBikeChange = (selectedBikeId) => {
    setEditFormData((prev) => ({
      ...prev,
      bike_id: selectedBikeId,
    }));
  };

  const handleView = (service) => {
    setEditFormData({
      _id: service._id,
      name: service.name || "",
      image: service.image || "",
      description: service.description || "",
      dealer_id: service.dealer_id?._id || "",
      bikes: service.bikes || [],
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data:", editFormData);
    } catch (err) {
      Swal.fire("Error", "Something went wrong", "error");
    }
  };

  const handleEdit = () => {

  }

  const rowsPerPage = 10;

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

  const handleDelete = async (serviceId) => {
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
          const response = await deleteService(serviceId);
          if (response.status === 200) {
            const updatedData = datas.filter(
              (service) => service._id !== serviceId
            );
            datas.splice(0, datas.length, ...updatedData);
            onServiceDeleted();
            Swal.fire(
              "Deleted!",
              response.message || "Service deleted successfully.",
              "success"
            );
          } else {
            Swal.fire(
              "Error!",
              response.message || "Deletion failed.",
              "error"
            );
          }
        } catch (error) {
          Swal.fire("Error!", "Failed to delete service.", "error");
        }
      }
    });
  };

  // Filtered data based on search
  // const filteredData = useMemo(() => {
  //   return datas.filter((item) => {
  //     const search = searchTerm.toLowerCase();
  //     return (
  //       item.name?.toLowerCase().includes(search) ||
  //       item.description?.toLowerCase().includes(search) ||
  //       item.dealer_id?.name?.toLowerCase().includes(search)
  //     );
  //   });
  // }, [datas, searchTerm]);
  // Filtered data based on search
  const filteredData = useMemo(() => {
    return datas.filter((item) => {
      const search = searchTerm.toLowerCase();

      const idMatch = item._id?.toLowerCase().includes(search) ?? false;
      const serviceNameMatch = item.name?.toLowerCase().includes(search) ?? false;
      const dealerShopNameMatch = item.dealer_id?.shopName?.toLowerCase().includes(search) ?? false;
      const dealerNameMatch = item.dealer_id?.name?.toLowerCase().includes(search) ?? false;

      return idMatch || serviceNameMatch || dealerShopNameMatch || dealerNameMatch;
    });
  }, [datas, searchTerm]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  triggerDownloadExcel.current = onDownload;
  triggerDownloadPDF.current = exportToPDF;

  const memoizedServiceList = currentData.map((data, index) => (
    <tr key={data._id}>
      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
      <td>{data._id || "N/A"}</td>
      <td>{data.name || "N/A"}</td>
      <td>{data.image ? <ImagePreview image={data.image} /> : "N/A"}</td>
      {/* <td>{data.description || "N/A"}</td> */}
      <td
        style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "300px" }}
        title={data.description}
      >
        {data.description
          ? data.description.length > 100
            ? `${data.description.slice(0, 100)}...`
            : data.description
          : "N/A"}
      </td>
      <td
        style={{ whiteSpace: "normal", wordBreak: "break-word", maxWidth: "500px" }}
      >
        {data.dealer_id?.shopName || "N/A"}
      </td>

      {/* <td>
        {data.bikes && data.bikes.length > 0 ? (
          <ul>
            {data.bikes.map((bike, idx) => (
              <li key={idx}>{bike.cc} CC - ₹{bike.price}</li>
            ))}
          </ul>
        ) : "N/A"}
      </td> */}
      <td>
        {data.bikes && data.bikes.length > 0 ? (
          <ul>
            {data.bikes
              .sort((a, b) => a.cc - b.cc)
              .map((bike, idx) => (
                <li key={idx}>{bike.cc} CC - ₹{bike.price}</li>
              ))
            }
          </ul>
        ) : "N/A"}
      </td>
      <td>{new Date(data.createdAt).toLocaleDateString()}</td>
      <td>{new Date(data.updatedAt).toLocaleDateString()}</td>
      <td className="d-flex align-items-center">
        <div className="dropdown">
          <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
            <i className="fas fa-ellipsis-v" />
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={() => handleView(data)}>
                <i className="far fa-edit me-2" /> View
              </button>
            </li>
            <li>
              {/* <button className="dropdown-item" onClick={() => handleEdit(data)}>
                <i className="far fa-edit me-2" /> Editsssss
              </button> */}
              <button
                className="dropdown-item"
                onClick={() => navigate(`/edit-services/${data._id}`)}
              >
                <i className="far fa-edit me-2" /> Edit
              </button>
            </li>
            <li><button className="dropdown-item" onClick={() => handleDelete(data._id)}><i className="far fa-trash-alt me-2" /> Delete</button></li>
          </ul>
        </div>
      </td>
    </tr>
  ));

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="card-table card p-2">
            <div className="card-body">
              <div className="mb-3">
                {/* <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email or phone"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                /> */}
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by ID, dealer name, or service name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </div>
              <div className="table-responsive">
                <table ref={tableRef} id="example" className="table table-striped">
                  <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                    <tr>{tableHeaders.map((header, index) => (<th key={index}>{header}</th>))}</tr>
                  </thead>
                  <tbody className="list">
                    {loading ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="text-center py-5">
                          <div className="d-flex justify-content-center align-items-center flex-column">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="mt-2">Loading services...</div>
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
                    ) : filteredData.length === 0 ? (
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
                          No Services found.
                        </td>
                      </tr>
                    ) : (
                      memoizedServiceList
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                <div
                  className="text-muted"
                  style={{ fontWeight: "500", fontSize: "0.9rem" }}
                >
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
      {showEditModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered modal-lg">
            <form onSubmit={handleEditSubmit} className="w-100">
              <div className="modal-content shadow-lg border-0 rounded-3">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">View Service Details</h5>
                  <button type="button" className="btn-close btn-close-white" onClick={() => setShowEditModal(false)}></button>
                </div>

                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Service Name</label>
                      <input
                        type="text"
                        name="name"
                        className="form-control"
                        value={editFormData.name} onChange={handleInputChange}
                        required
                        disabled
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Dealer ID</label>
                      <input
                        type="text"
                        name="dealer_id"
                        className="form-control"
                        value={editFormData.dealer_id} onChange={handleInputChange}
                        disabled
                      />
                    </div>


                    <div className="col-12">
                      <label className="form-label">Bikes (CC & Price)</label>
                      {editFormData.bikes.map((bike, index) => (
                        <div className="row mb-2" key={index}>
                          <div className="col">
                            <input
                              type="number"
                              name="cc"
                              placeholder="CC"
                              className="form-control"
                              value={bike.cc}
                              onChange={(e) => handleBikeChange(e, index, "cc")}
                              disabled
                            />
                          </div>
                          <div className="col">
                            <input
                              type="number"
                              name="price"
                              placeholder="Price"
                              className="form-control"
                              value={bike.price}
                              onChange={(e) => handleBikeChange(e, index, "price")}
                              disabled
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="col-12">
                      <label className="form-label">Description</label>
                      <textarea
                        name="description"
                        className="form-control"
                        rows={3}
                        value={editFormData.description}
                        onChange={handleInputChange}
                        disabled
                      />
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default ServiceTable;
