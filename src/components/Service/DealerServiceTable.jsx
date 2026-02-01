"use client"

import { useState, useMemo, useRef } from "react"
import ImagePreview from "../Global/ImagePreview"

const DealerServiceTable = ({ tableHeaders, datas, text, loading }) => {
  const tableRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 10

  const filteredData = useMemo(() => {
    const dataList = Array.isArray(datas) ? datas : []

    if (searchTerm.trim() === "") return dataList

    return dataList.filter((item) => {
      const search = searchTerm.toLowerCase()
      const serviceNameMatch = item.base_service_id?.name?.toLowerCase().includes(search) ?? false
      return serviceNameMatch
    })
  }, [datas, searchTerm])

  const totalPages = Math.ceil(filteredData.length / rowsPerPage)

  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    return filteredData.slice(start, start + rowsPerPage)
  }, [filteredData, currentPage])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page)
  }

  const memoizedServiceList = currentData.map((data, index) => (
    <tr key={data._id}>
      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
      <td>{data.base_service_id?.image ? <ImagePreview image={data.base_service_id.image} /> : "N/A"}</td>
      <td>{data.base_service_id?.name || "N/A"}</td>
      <td>
        {data.bikes && data.bikes.length > 0 ? (
          <ul className="mb-0 list-unstyled">
            {data.bikes
              .sort((a, b) => a.cc - b.cc)
              .map((bike, idx) => (
                <li key={idx} className="small">
                  {bike.cc} CC - ₹{bike.price}
                </li>
              ))}
          </ul>
        ) : (
          "N/A"
        )}
      </td>
      <td className="d-flex align-items-center">
        <span className="badge bg-success">Active</span>
      </td>
    </tr>
  ))

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
                  placeholder="Search by service name"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value)
                    setCurrentPage(1)
                  }}
                />
              </div>
              <div className="table-responsive">
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
                        <td colSpan={tableHeaders.length} className="text-center py-5">
                          <div className="d-flex justify-content-center align-items-center flex-column">
                            <div className="spinner-border text-primary" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <div className="mt-2">Loading services...</div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
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
                          No Services found.
                        </td>
                      </tr>
                    ) : (
                      memoizedServiceList
                    )}
                  </tbody>
                </table>
              </div>
              {filteredData.length > 0 && (
                <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                  <div className="text-muted" style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                    Total Records: <span className="text-primary fw-bold">{filteredData.length}</span>
                  </div>

                  <nav aria-label="Page navigation">
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
                        <li key={page} className={`page-item ${page === currentPage ? "active" : ""}`}>
                          <button className="page-link" onClick={() => handlePageChange(page)}>
                            {page}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next">
                          &raquo;
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DealerServiceTable
