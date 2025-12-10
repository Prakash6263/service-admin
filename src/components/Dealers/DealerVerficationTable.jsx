import React, { useState, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import "jspdf-autotable";
import { useNavigate } from "react-router-dom";

const DealerVerficationTable = ({ tableHeaders, datas, text, onBannerDeleted, loading }) => {
  const navigate = useNavigate()
  const tableRef = useRef(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: '',
    name: '',
    banner_image: '',
    from_date: '',
    expiry_date: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  const handleEdit = (banner) => {
    setEditFormData({
      _id: banner._id,
      name: banner.name || '',
      banner_image: banner.banner_image || '',
      from_date: banner.from_date ? new Date(banner.from_date).toISOString().split('T')[0] : '',
      expiry_date: banner.expiry_date ? new Date(banner.expiry_date).toISOString().split('T')[0] : ''
    });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      // Add your API call to update banner here
      // Example: const response = await updateBanner(editFormData._id, editFormData);
      Swal.fire('Success!', 'Banner updated successfully!', 'success');
      setShowEditModal(false);
      onBannerDeleted(); // Refresh the list
    } catch (error) {
      Swal.fire('Error!', 'Failed to update banner', 'error');
    } finally {
      setEditLoading(false);
    }
  };

  const filteredData = useMemo(() => {
    if (!searchTerm.trim()) return datas;
    return datas.filter((item) =>
      [item.name, item._id]
        .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm, datas]);

  const rowsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return filteredData.slice(start, start + rowsPerPage);
  }, [filteredData, currentPage, rowsPerPage]);

  const memoizedTableRows = useMemo(() => {
    console.log("Rendering table rows",currentData);
    return currentData?.map((data, index) => (
      <tr key={data._id}>
        <td>{index + 1}</td>
        <td>{data._id || "N/A"}</td>
        <td>{data.commission || 0}%</td>
        <td>{data.tax}%</td>
        <td>{data.ownerName || "N/A"}</td>
        <td>{"N/A"}</td>
        <td>{data.presentAddress?.address || data.permanentAddress?.address || "N/A"}</td>
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
        <td className="d-flex align-items-center">
          <div className="dropdown">
            <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
              <i className="fas fa-ellipsis-v" />
            </a>
            <ul className="dropdown-menu dropdown-menu-end">
              {/* <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/view-verify-dealer/${data._id}`);
                  }}
                >
                  <i className="fa-solid fa-eye me-2" /> View Details
                </a>
              </li> */}
              <li>
                <a
                  className="dropdown-item"
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/update-dealer-verify/${data._id}`);
                  }}
                >
                  <i className="far fa-edit me-2" /> Edit
                </a>
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
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by promo code, service or discount"
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
                          <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <div className="mt-2">Loading Banners...</div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td colSpan={tableHeaders.length} className="text-center py-5">
                          <div className="d-flex flex-column align-items-center text-muted">
                            <i className="fa fa-box-open mb-3" style={{ fontSize: "2rem", color: "#adb5bd" }}></i>
                            <h6 className="mb-1" style={{ fontWeight: 600 }}>No Dealers Request Found</h6>
                            {/* <p style={{ fontSize: "0.9rem", color: "#6c757d", margin: 0 }}>
                              Add a new banner.
                            </p> */}
                          </div>
                        </td>
                      </tr>
                    ) : (
                      memoizedTableRows
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="text-muted">
                  Total Records: <span className="fw-bold text-primary">{filteredData.length}</span>
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
      {showEditModal && (
        <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">View Banner</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEditModal(false)}
                  disabled={editLoading}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  {editLoading ? (
                    <div className="text-center py-4">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label className="form-label">Banner Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="name"
                          value={editFormData.name}
                          onChange={handleInputChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label className="form-label">From Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="from_date"
                            value={editFormData.from_date}
                            onChange={handleInputChange}
                            required
                            disabled
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label className="form-label">Expiry Date</label>
                          <input
                            type="date"
                            className="form-control"
                            name="expiry_date"
                            value={editFormData.expiry_date}
                            onChange={handleInputChange}
                            required
                            disabled
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Banner Image URL</label>
                        <input
                          type="text"
                          className="form-control"
                          name="banner_image"
                          value={editFormData.banner_image}
                          onChange={handleInputChange}
                          disabled
                        />
                        {editFormData.banner_image && (
                          <img
                            src={editFormData.banner_image}
                            alt="Banner Preview"
                            className="img-thumbnail mt-2"
                            style={{ maxHeight: '150px' }}
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
                {/* <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEditModal(false)}
                    disabled={editLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={editLoading}
                  >
                    {editLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Saving...
                      </>
                    ) : 'Save Changes'}
                  </button>
                </div> */}
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DealerVerficationTable