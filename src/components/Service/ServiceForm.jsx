"use client"

import React, { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { addService, getBikeCompanies, getCCListByCompany } from "../../api"
import { useNavigate } from "react-router-dom"

const ServiceForm = () => {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
  })

  const [image, setImage] = useState(null)
  const [bikes, setBikes] = useState([{ cc: "", price: "" }])
  const [companies, setCompanies] = useState([])
  const [selectedCompanies, setSelectedCompanies] = useState([])
  const [availableCCs, setAvailableCCs] = useState([])
  const [formErrors, setFormErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getBikeCompanies()
        setCompanies(response?.data || [])
      } catch (error) {
        console.error("Failed to fetch companies", error)
        setCompanies([])
      }
    }
    fetchCompanies()
  }, [])

useEffect(() => {
  const fetchCCs = async () => {
    if (selectedCompanies.length === 0) {
      setAvailableCCs([])
      setBikes([{ cc: "", price: "" }]) // reset
      return
    }

    try {
      const allCCs = new Set()

      for (const companyId of selectedCompanies) {
        const response = await getCCListByCompany(companyId)
        if (response?.data) {
          response.data.forEach((cc) => allCCs.add(cc))
        }
      }

      const sortedCCs = Array.from(allCCs).sort((a, b) => a - b)
      setAvailableCCs(sortedCCs)

      // ✅ Reset bikes when CC list changes
      setBikes([{ cc: "", price: "" }])

    } catch (error) {
      console.error("Failed to fetch CC list", error)
      setAvailableCCs([])
    }
  }

  fetchCCs()
}, [selectedCompanies])


  const validate = () => {
    const errors = {}

    if (!formData.name.trim()) {
      errors.name = "Service name is required"
    } else if (formData.name.length < 2) {
      errors.name = "Name must be at least 2 characters"
    }

    if (selectedCompanies.length === 0) {
      errors.companies = "Please select at least one company"
    }

    bikes.forEach((bike, index) => {
      if (!bike.cc) {
        errors[`bike_cc_${index}`] = "Bike CC is required"
      } else if (Number.parseInt(bike.cc) <= 0) {
        errors[`bike_cc_${index}`] = "CC must be greater than 0"
      }

      if (!bike.price) {
        errors[`bike_price_${index}`] = "Price is required"
      } else if (Number.parseInt(bike.price) <= 0) {
        errors[`bike_price_${index}`] = "Price must be greater than 0"
      }
    })

    if (!image) {
      errors.image = "Service image is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  }

  const handleCompanyToggle = (companyId) => {
    setSelectedCompanies((prev) => {
      if (prev.includes(companyId)) {
        return prev.filter((id) => id !== companyId)
      } else {
        return [...prev, companyId]
      }
    })
  }

  const handleBikeChange = (index, e) => {
    const { name, value } = e.target
    const updatedBikes = [...bikes]
    updatedBikes[index][name] = value
    setBikes(updatedBikes)
  }

  const addBikeField = () => {
    setBikes([...bikes, { cc: "", price: "" }])
  }

  const removeBikeField = (index) => {
    setBikes(bikes.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormErrors({})

    const isValid = validate()
    if (!isValid) return

    setIsSubmitting(true)

    const form = new FormData()
    form.append("name", formData.name)
    form.append("companies", JSON.stringify(selectedCompanies))
    form.append("bikes", JSON.stringify(bikes))
    if (image) form.append("image", image)

    try {
      const response = await addService(form)
      if (response?.status === true || response?.status === 200) {
        Swal.fire({
          title: "Success!",
          text: response.message || "Service added successfully.",
          icon: "success",
        })
        navigate("/services")
        setFormData({ name: "" })
        setImage(null)
        setBikes([{ cc: "", price: "" }])
        setSelectedCompanies([])
      }
    } catch (error) {
      const err = error.response?.data
      Swal.fire({
        title: "Error!",
        text: err?.message || "Something went wrong!",
        icon: "error",
      })

      if (err?.field) {
        setFormErrors((prev) => ({ ...prev, [err.field]: err.message }))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="row">
      <div className="col-sm-12">
        <div className="card-table card p-3">
          <div className="card-body">
            <form className="form-horizontal" onSubmit={handleSubmit}>
              <div className="row">
                {/* Left Column - Service Details */}
                <div className="col-md-6">
                  <h5 className="mb-3">Create a Service</h5>

                  <div className="input-block mb-3">
                    <label className="form-control-label">Service Name</label>
                    <input
                      className={`form-control ${formErrors.name ? "is-invalid" : ""}`}
                      name="name"
                      type="text"
                      placeholder="e.g. General Service"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    {formErrors.name && <div className="invalid-feedback">{formErrors.name}</div>}
                  </div>

                  <div className="input-block mb-3">
                    <label className="form-control-label">Upload Service Image</label>
                    <input
                      type="file"
                      name="image"
                      className={`form-control ${formErrors.image ? "is-invalid" : ""}`}
                      onChange={handleFileChange}
                    />
                    {formErrors.image && <div className="invalid-feedback">{formErrors.image}</div>}
                  </div>

                  <hr className="my-3" />

                  {/* Pricing Section */}
                  <div className="input-block mb-3">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <label className="form-control-label mb-0">CC & Rate (Fill like this row)</label>
                      <button type="button" className="btn btn-outline-success btn-sm" onClick={addBikeField}>
                        <i className="fa fa-plus me-1"></i> Add Row
                      </button>
                    </div>

                    <div className="cc-pricing-rows">
                      {bikes.map((bike, index) => (
                        <div key={index} className="row g-2 mb-2 align-items-center">
                          <div className="col-5 col-md-5">
                            <div className="input-group">
                              <select
  name="cc"
  className={`form-control ${formErrors[`bike_cc_${index}`] ? "is-invalid" : ""}`}
  value={bike.cc}
  onChange={(e) => handleBikeChange(index, e)}
>
  <option value="">Select CC</option>
  {availableCCs.map((cc) => (
    <option key={cc} value={cc}>
      {cc} CC
    </option>
  ))}
</select>

                              <span className="input-group-text">CC</span>
                            </div>
                          </div>
                          <div className="col-5 col-md-5">
                            <div className="input-group">
                              <input
                                className={`form-control ${formErrors[`bike_price_${index}`] ? "is-invalid" : ""}`}
                                type="number"
                                name="price"
                                placeholder="Rate"
                                value={bike.price}
                                onChange={(e) => handleBikeChange(index, e)}
                              />
                              <span className="input-group-text">₹</span>
                            </div>
                          </div>
                          <div className="col-2">
                            {index > 0 && (
                              <button
                                type="button"
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => removeBikeField(index)}
                              >
                                <i className="fa fa-trash"></i>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {bikes.map((_, index) => (
                      <React.Fragment key={index}>
                        {formErrors[`bike_cc_${index}`] && (
                          <div className="text-danger small">{formErrors[`bike_cc_${index}`]}</div>
                        )}
                        {formErrors[`bike_price_${index}`] && (
                          <div className="text-danger small">{formErrors[`bike_price_${index}`]}</div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>

                  {/* Show available CCs for reference */}
                  {availableCCs.length > 0 && (
                    <div className="alert alert-info small">
                      <strong>Available CCs for selected companies:</strong> {availableCCs.join(", ")}
                    </div>
                  )}
                </div>

                {/* Right Column - Company Selection */}
                <div className="col-md-6">
                  <h5 className="mb-3">List Company Names / Select Company</h5>

                  <div className="input-block mb-3">
                    <div
                      className="company-selection-list border rounded p-3"
                      style={{ maxHeight: "400px", overflowY: "auto" }}
                    >
                      {companies.map((company) => (
                        <div key={company._id} className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`company-${company._id}`}
                            checked={selectedCompanies.includes(company._id)}
                            onChange={() => handleCompanyToggle(company._id)}
                          />
                          <label className="form-check-label" htmlFor={`company-${company._id}`}>
                            {company.name}
                          </label>
                        </div>
                      ))}
                    </div>
                    {formErrors.companies && <div className="text-danger mt-1 small">{formErrors.companies}</div>}
                  </div>
                </div>
              </div>

              <div className="text-end mt-3">
                <button className="btn btn-primary px-5" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Create Service"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiceForm
