"use client"

import { useState, useMemo, useRef } from "react"
import Swal from "sweetalert2"
import { useDownloadExcel } from "react-export-table-to-excel"
import jsPDF from "jspdf"
import "jspdf-autotable"
import { deleteBike } from "../../api"

const BikeTable = ({ triggerDownloadExcel, triggerDownloadPDF, tableHeaders, datas, text, onBikeDeleted }) => {
  const tableRef = useRef(null)
  const rowsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState({
    company: "",
    model: "",
    variant: "",
    engineCC: "",
  })

  // Handle filter changes with cascading reset
  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const newFilters = { ...prev, [key]: value }

      // Reset dependent filters when parent filter changes
      if (key === "company") {
        newFilters.model = ""
        newFilters.variant = ""
        newFilters.engineCC = ""
      } else if (key === "model") {
        newFilters.variant = ""
        newFilters.engineCC = ""
      } else if (key === "variant") {
        newFilters.engineCC = ""
      }

      return newFilters
    })
    setCurrentPage(1)
  }

  // Get filtered data based on current filters
  const filteredData = useMemo(() => {
    return datas
      .filter((company) => (filters.company ? company.name === filters.company : true))
      .map((company) => ({
        ...company,
        models: company.models
          .filter((model) => (filters.model ? model.model_name === filters.model : true))
          .map((model) => ({
            ...model,
            variants: model.variants.filter((variant) => {
              return (
                (filters.variant ? variant.variant_name === filters.variant : true) &&
                (filters.engineCC ? variant.engine_cc === +filters.engineCC : true)
              )
            }),
          }))
          .filter((model) => model.variants.length > 0),
      }))
      .filter((company) => company.models.length > 0)
  }, [datas, filters])

  // Cascading dropdown options
  const companyOptions = useMemo(() => [...new Set(datas.map((c) => c.name))].sort(), [datas])

  const modelOptions = useMemo(() => {
    if (!filters.company) {
      return [...new Set(datas.flatMap((c) => c.models.map((m) => m.model_name)))].sort()
    }

    const selectedCompany = datas.find((c) => c.name === filters.company)
    if (!selectedCompany) return []

    return [...new Set(selectedCompany.models.map((m) => m.model_name))].sort()
  }, [datas, filters.company])

  const variantOptions = useMemo(() => {
    if (!filters.company && !filters.model) {
      return [...new Set(datas.flatMap((c) => c.models.flatMap((m) => m.variants.map((v) => v.variant_name))))].sort()
    }

    if (filters.company && !filters.model) {
      const selectedCompany = datas.find((c) => c.name === filters.company)
      if (!selectedCompany) return []

      return [...new Set(selectedCompany.models.flatMap((m) => m.variants.map((v) => v.variant_name)))].sort()
    }

    if (filters.company && filters.model) {
      const selectedCompany = datas.find((c) => c.name === filters.company)
      if (!selectedCompany) return []

      const selectedModel = selectedCompany.models.find((m) => m.model_name === filters.model)
      if (!selectedModel) return []

      return [...new Set(selectedModel.variants.map((v) => v.variant_name))].sort()
    }

    return []
  }, [datas, filters.company, filters.model])

  const engineCCOptions = useMemo(() => {
    if (!filters.company && !filters.model && !filters.variant) {
      return [...new Set(datas.flatMap((c) => c.models.flatMap((m) => m.variants.map((v) => v.engine_cc))))].sort(
        (a, b) => a - b,
      )
    }

    let variants = []

    if (filters.company && filters.model && filters.variant) {
      const selectedCompany = datas.find((c) => c.name === filters.company)
      if (!selectedCompany) return []

      const selectedModel = selectedCompany.models.find((m) => m.model_name === filters.model)
      if (!selectedModel) return []

      variants = selectedModel.variants.filter((v) => v.variant_name === filters.variant)
    } else if (filters.company && filters.model) {
      const selectedCompany = datas.find((c) => c.name === filters.company)
      if (!selectedCompany) return []

      const selectedModel = selectedCompany.models.find((m) => m.model_name === filters.model)
      if (!selectedModel) return []

      variants = selectedModel.variants
    } else if (filters.company) {
      const selectedCompany = datas.find((c) => c.name === filters.company)
      if (!selectedCompany) return []

      variants = selectedCompany.models.flatMap((m) => m.variants)
    }

    return [...new Set(variants.map((v) => v.engine_cc))].sort((a, b) => a - b)
  }, [datas, filters.company, filters.model, filters.variant])

  // Pagination
  const totalRows = useMemo(() => {
    return filteredData.reduce(
      (count, company) => count + company.models.reduce((modelCount, model) => modelCount + model.variants.length, 0),
      0,
    )
  }, [filteredData])

  const totalPages = Math.ceil(totalRows / rowsPerPage)

  const currentData = useMemo(() => {
    const flatRows = []
    filteredData.forEach((company) => {
      company.models.forEach((model) => {
        model.variants.forEach((variant) => {
          flatRows.push({
            companyName: company.name,
            modelName: model.model_name,
            variantName: variant.variant_name,
            engineCC: variant.engine_cc,
            variantId: variant._id,
          })
        })
      })
    })
    const start = (currentPage - 1) * rowsPerPage
    return flatRows.slice(start, start + rowsPerPage)
  }, [filteredData, currentPage])

  // Excel & PDF
  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Bike_List",
    sheet: "Bikes",
  })

  const exportToPDF = () => {
    const doc = new jsPDF()
    doc.text("Bike List", 14, 10)
    const table = tableRef.current
    if (!table) return
    doc.autoTable({
      html: "#example",
      startY: 20,
      theme: "striped",
    })
    doc.save(`${text}.pdf`)
  }

  triggerDownloadExcel.current = onDownload
  triggerDownloadPDF.current = exportToPDF

  // Delete handler
  const handleDelete = async (variantId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await deleteBike(variantId)
          if (response.status === 200 || response.status === "200") {
            onBikeDeleted()
            Swal.fire({
              icon: "success",
              title: "Deleted!",
              text: response.message || "vehicle deleted successfully",
              timer: 2000,
              showConfirmButton: false,
            })
          } else {
            Swal.fire("Error!", response.message || "Deletion failed.", "error")
          }
        } catch (error) {
          console.error("[v0] Bike deletion error:", error)
          // Error alert is handled in api.js
        }
      }
    })
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-2">
          <div className="card-body">
            {/* Filters */}
            <div className="d-flex gap-2 mb-3">
              <select
                value={filters.company}
                onChange={(e) => handleFilterChange("company", e.target.value)}
                className="form-select form-select-sm"
              >
                <option value="">All Companies</option>
                {companyOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                value={filters.model}
                onChange={(e) => handleFilterChange("model", e.target.value)}
                className="form-select form-select-sm"
                disabled={!filters.company}
              >
                <option value="">All Models</option>
                {modelOptions.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
              <select
                value={filters.variant}
                onChange={(e) => handleFilterChange("variant", e.target.value)}
                className="form-select form-select-sm"
                disabled={!filters.model}
              >
                <option value="">All Variants</option>
                {variantOptions.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
              <select
                value={filters.engineCC}
                onChange={(e) => handleFilterChange("engineCC", e.target.value)}
                className="form-select form-select-sm"
                disabled={!filters.variant}
              >
                <option value="">All CC</option>
                {engineCCOptions.map((cc) => (
                  <option key={cc} value={cc}>
                    {cc}
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="table-responsive">
              <table ref={tableRef} id="example" className="table table-striped">
                <thead className="thead-light" style={{ backgroundColor: "#2e83ff" }}>
                  <tr>
                    {tableHeaders.map((header, i) => (
                      <th key={i}>{header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((row, index) => (
                    <tr key={row.variantId}>
                      <td>{(currentPage - 1) * rowsPerPage + index + 1}</td>
                      <td>{row.companyName}</td>
                      <td>{row.modelName}</td>
                      <td>{row.variantName}</td>
                      <td>{row.engineCC} CC</td>
                      <td className="d-flex align-items-center">
                        <div className="dropdown">
                          <a href="#" className="btn-action-icon" data-bs-toggle="dropdown">
                            <i className="fas fa-ellipsis-v" />
                          </a>
                          <ul className="dropdown-menu dropdown-menu-end">
                            {/* <li>
                              <button className="dropdown-item" onClick={(e) => e.preventDefault()}>
                                <i className="far fa-edit me-2" /> Edit
                              </button>
                            </li> */}
                            <li>
                              <button className="dropdown-item" onClick={() => handleDelete(row.variantId)}>
                                <i className="far fa-trash-alt me-2" /> Delete
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination & Total */}
            <div className="d-flex justify-content-between align-items-center mt-4 p-3 bg-light rounded shadow-sm">
              <div style={{ fontWeight: "500", fontSize: "0.9rem" }}>
                Total Records: <span className="text-primary fw-bold">{totalRows}</span>
              </div>

              <nav>
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>
                      &laquo;
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${currentPage === page ? "active" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>
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
  )
}

export default BikeTable
