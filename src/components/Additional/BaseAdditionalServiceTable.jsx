'use client'

import { useState, useMemo, useRef } from 'react'
import Swal from 'sweetalert2'
import ImagePreview from '../Global/ImagePreview'
import { deleteBaseAdditionalService } from '../../api/additionalServiceApi'
import { useNavigate } from 'react-router-dom'

const BaseAdditionalServiceTable = ({
  triggerDownloadExcel,
  triggerDownloadPDF,
  tableHeaders,
  datas,
  text,
  onServiceDeleted,
  loading,
}) => {
  const navigate = useNavigate()
  const tableRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  const rowsPerPage = 10

  const handleDelete = async (serviceId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteBaseAdditionalService(serviceId)
          if (response && response.status === true) {
            onServiceDeleted()
          }
        } catch (error) {
          console.error('[v0] Delete failed in UI:', error)
        }
      }
    })
  }

  const filteredData = useMemo(() => {
    const dataList = Array.isArray(datas) ? datas : []

    if (searchTerm.trim() === '') return dataList

    return dataList.filter((item) => {
      const search = searchTerm.toLowerCase()
      const nameMatch = item.name?.toLowerCase().includes(search) ?? false
      return nameMatch
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
      <td>{data.image ? <ImagePreview image={data.image} /> : 'N/A'}</td>
      <td>{data.name || 'N/A'}</td>
      <td>{new Date(data.createdAt).toLocaleDateString()}</td>
      <td className="d-flex align-items-center">
        <div className="dropdown">
          <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
            <i className="fas fa-ellipsis-v" />
          </a>
          <ul className="dropdown-menu dropdown-menu-end">
            <li>
              <button className="dropdown-item" onClick={() => navigate(`/edit-base-additional-service/${data._id}`)}>
                <i className="far fa-edit me-2" /> Edit
              </button>
            </li>
            <li>
              <button className="dropdown-item" onClick={() => handleDelete(data._id)}>
                <i className="far fa-trash-alt me-2" /> Delete
              </button>
            </li>
          </ul>
        </div>
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
                  <thead className="thead-light" style={{ backgroundColor: '#2e83ff' }}>
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
                            <div className="mt-2">Loading base additional services...</div>
                          </div>
                        </td>
                      </tr>
                    ) : filteredData.length === 0 ? (
                      <tr>
                        <td
                          colSpan={tableHeaders.length}
                          style={{
                            textAlign: 'center',
                            padding: '20px',
                            fontStyle: 'italic',
                            color: '#555',
                          }}
                        >
                          No Base Additional Services found.
                        </td>
                      </tr>
                    ) : (
                      memoizedServiceList
                    )}
                  </tbody>
                </table>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
                <div className="text-muted" style={{ fontWeight: '500', fontSize: '0.9rem' }}>
                  Total Records: <span className="text-primary fw-bold">{filteredData.length}</span>
                </div>

                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous"
                      >
                        &laquo;
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li key={page} className={`page-item ${page === currentPage ? 'active' : ''}`}>
                        <button className="page-link" onClick={() => handlePageChange(page)}>
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} aria-label="Next">
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
  )
}

export default BaseAdditionalServiceTable
